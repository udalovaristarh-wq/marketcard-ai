import hashlib
import logging
import os
import time
from datetime import datetime

import base64
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select

from app.db import get_session
from app.models.finance_income import TariffIncome
from app.models.payment_order import PaymentOrder
from app.models.user import User
from app.security import get_current_user

logger = logging.getLogger(__name__)

PAYME_MERCHANT_ID = os.getenv("PAYME_MERCHANT_ID", "").strip()
PAYME_SECRET_KEY = os.getenv("PAYME_SECRET_KEY", "").strip()
PAYME_BASE_URL = os.getenv("PAYME_BASE_URL", "https://checkout.paycom.uz").strip().rstrip("/")

CLICK_SERVICE_ID = os.getenv("CLICK_SERVICE_ID", "").strip()
CLICK_MERCHANT_ID = os.getenv("CLICK_MERCHANT_ID", "").strip()
CLICK_SECRET_KEY = os.getenv("CLICK_SECRET_KEY", "").strip()

router = APIRouter(prefix="/payments", tags=["payments"])

TARIFF_PRICES = {
    "Start": 249000,
    "Business": 799000,
    "Premium": 1900000,
}

TARIFF_LIMITS = {
    "Start": 20,
    "Business": 60,
    "Premium": 200,
}

from app.services.tariff_activation import grant_tariff_benefits

def _record_tariff_income(session: Session, user: User, order: PaymentOrder) -> None:
    session.add(
        TariffIncome(
            user_id=user.id,
            email=user.email,
            tariff_name=order.tariff_name,
            amount_uzs=int(order.amount_uzs or 0),
            generations_total=int(user.tariff_generations_total or 0),
            source=f"payme:{order.provider or 'payme'}",
        )
    )


@router.post("/create-order")
def create_order(
    tariff_name: str,
    provider: str = "unknown",
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.id == current_user.id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if tariff_name not in TARIFF_PRICES:
        raise HTTPException(status_code=400, detail="Invalid tariff")

    order = PaymentOrder(
        user_id=user.id,
        email=user.email,
        tariff_name=tariff_name,
        amount_uzs=TARIFF_PRICES[tariff_name],
        provider=provider,
        status="pending",
    )
    session.add(order)
    session.commit()
    session.refresh(order)

    amount_tiyin = int(order.amount_uzs) * 100
    payme_data = f"m={PAYME_MERCHANT_ID};ac.order_id={order.id};a={amount_tiyin};c=https://marketcard.uz/dashboard"
    payme_encoded = base64.b64encode(payme_data.encode()).decode()

    return {
        "success": True,
        "order_id": order.id,
        "payme_url": f"{PAYME_BASE_URL}/{payme_encoded}",
    }


@router.post("/payme/callback")
async def payme_callback(request: Request, session: Session = Depends(get_session)):
    data = await request.json()
    method = data.get("method")
    params = data.get("params", {}) or {}
    request_id = data.get("id")

    def ok(result):
        return {"jsonrpc": "2.0", "id": request_id, "result": result}

    def err(code, msg):
        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "error": {
                "code": code,
                "message": {"ru": msg, "uz": msg, "en": msg},
            },
        }

    if not PAYME_MERCHANT_ID or not PAYME_SECRET_KEY:
        return err(-32400, "Payme credentials are not configured")

    auth_header = request.headers.get("authorization", "").strip()
    token_raw = f"Paycom:{PAYME_SECRET_KEY}"
    expected_auth = "Basic " + base64.b64encode(token_raw.encode()).decode()

    if auth_header != expected_auth:
        logger.warning("Payme callback rejected: invalid authorization")
        return err(-32504, "Insufficient privileges")

    def ms(dt):
        return int(dt.timestamp() * 1000) if dt else 0

    account = params.get("account", {}) or {}
    order_id = account.get("order_id")
    amount = params.get("amount")
    tx_id = str(params.get("id"))

    if method and method.lower() == "checkperformtransaction":
        order = session.exec(select(PaymentOrder).where(PaymentOrder.id == int(order_id))).first()
        if not order:
            return err(-31050, "Order not found")
        if int(order.amount_uzs) * 100 != int(amount):
            return err(-31001, "Incorrect amount")
        return ok({"allow": True})

    if method == "CreateTransaction":
        order = session.exec(select(PaymentOrder).where(PaymentOrder.id == int(order_id))).first()
        if not order:
            return err(-31050, "Order not found")

        if order.external_transaction_id:
            if order.external_transaction_id == tx_id:
                return ok({
                    "create_time": ms(order.payme_create_time),
                    "transaction": tx_id,
                    "state": 1,
                })
            return err(-31050, "Transaction exists")

        order.external_transaction_id = tx_id
        order.payme_create_time = datetime.utcnow()
        session.add(order)
        session.commit()

        return ok({
            "create_time": ms(order.payme_create_time),
            "transaction": tx_id,
            "state": 1,
        })

    if method == "PerformTransaction":
        order = session.exec(
            select(PaymentOrder).where(PaymentOrder.external_transaction_id == tx_id)
        ).first()
        if not order:
            return err(-31003, "Not found")

        user = session.exec(select(User).where(User.id == order.user_id)).first()
        if not user:
            return err(-31050, "User not found")

        if order.status == "paid":
            return ok({
                "transaction": tx_id,
                "perform_time": ms(order.paid_at),
                "state": 2,
            })

        grant_tariff_benefits(user, order)
        order.status = "paid"
        if not order.paid_at:
            order.paid_at = datetime.utcnow()

        _record_tariff_income(session, user, order)
        session.add(user)
        session.add(order)
        session.commit()

        return ok({
            "transaction": tx_id,
            "perform_time": ms(order.paid_at),
            "state": 2,
        })

    if method == "CancelTransaction":
        tx_id = params.get("id")
        order = session.exec(
            select(PaymentOrder).where(PaymentOrder.external_transaction_id == tx_id)
        ).first()
        if not order:
            return err(-31003, "Transaction not found")

        user = session.exec(select(User).where(User.id == order.user_id)).first()

        if order.status == "paid" and user:
            if order.tariff_name == "audit10":
                user.audit_credits = max((user.audit_credits or 0) - 10, 0)
            elif order.tariff_name == "audit30":
                user.audit_credits = max((user.audit_credits or 0) - 30, 0)
            elif order.tariff_name in ("Start", "Business", "Premium"):
                if order.tariff_name == "Start":
                    user.audit_credits = max((user.audit_credits or 0) - 10, 0)
                elif order.tariff_name == "Business":
                    user.audit_credits = max((user.audit_credits or 0) - 30, 0)
                elif order.tariff_name == "Premium":
                    user.audit_credits = max((user.audit_credits or 0) - 100, 0)

                user.tariff_name = None
                user.tariff_active = False
                user.tariff_generations_total = 0
                user.tariff_generations_used = 0
                user.tariff_generations_left = 0

        order.status = "cancelled"
        session.add(order)
        if user:
            session.add(user)
        session.commit()

        return ok({
            "transaction": tx_id,
            "cancel_time": int(time.time() * 1000),
            "state": -2,
        })

    if method == "CheckTransaction":
        tx_id = params.get("id")
        order = session.exec(
            select(PaymentOrder).where(PaymentOrder.external_transaction_id == str(tx_id))
        ).first()
        if not order:
            return err(-31003, "Transaction not found")

        create_dt = order.payme_create_time or order.created_at
        if order.status == "paid" and order.paid_at:
            return ok({
                "create_time": ms(create_dt),
                "perform_time": ms(order.paid_at),
                "cancel_time": 0,
                "transaction": str(tx_id),
                "state": 2,
                "reason": None,
            })

        return ok({
            "create_time": ms(create_dt),
            "perform_time": 0,
            "cancel_time": 0,
            "transaction": str(tx_id),
            "state": 1,
            "reason": None,
        })

    return err(-32601, "Method not found")


@router.post("/create-audit-order")
def create_audit_order(
    package: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    PACKAGES = {
        "audit10": {"credits": 10, "amount": 49000},
        "audit30": {"credits": 30, "amount": 99000},
    }

    if package not in PACKAGES:
        raise HTTPException(400, "Invalid package")

    pkg = PACKAGES[package]

    order = PaymentOrder(
        user_id=current_user.id,
        email=current_user.email,
        tariff_name=package,
        amount_uzs=pkg["amount"],
        provider="payme",
        status="pending",
    )

    session.add(order)
    session.commit()
    session.refresh(order)

    amount_tiyin = int(order.amount_uzs) * 100
    payme_data = f"m={PAYME_MERCHANT_ID};ac.order_id={order.id};a={amount_tiyin};c=https://marketcard.uz/dashboard"
    payme_encoded = base64.b64encode(payme_data.encode()).decode()

    return {
        "success": True,
        "order_id": order.id,
        "amount": pkg["amount"],
        "credits": pkg["credits"],
        "payme_url": f"{PAYME_BASE_URL}/{payme_encoded}",
    }
