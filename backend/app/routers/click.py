import hashlib
import logging
import os
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select

from app.db import get_session
from app.models.finance_income import TariffIncome
from app.models.payment_order import PaymentOrder
from app.models.user import User
from app.services.tariff_activation import grant_tariff_benefits

logger = logging.getLogger(__name__)

CLICK_SECRET_KEY = os.getenv("CLICK_SECRET_KEY", "").strip()
CLICK_SERVICE_ID = os.getenv("CLICK_SERVICE_ID", "").strip()

router = APIRouter(prefix="/payments/click", tags=["click"])


def _verify_click_signature(data: dict) -> bool:
    if not CLICK_SECRET_KEY:
        return False

    sign_string = (
        f"{data.get('click_trans_id', '')}"
        f"{data.get('service_id', '')}"
        f"{CLICK_SECRET_KEY}"
        f"{data.get('merchant_trans_id', '')}"
        f"{data.get('amount', '')}"
        f"{data.get('action', '')}"
        f"{data.get('sign_time', '')}"
    )
    expected = hashlib.md5(sign_string.encode("utf-8")).hexdigest()
    return expected == str(data.get("sign_string", ""))


@router.post("/callback")
async def click_callback(request: Request, session: Session = Depends(get_session)):
    data = await request.json()

    if CLICK_SECRET_KEY and not _verify_click_signature(data):
        logger.warning("Click callback rejected: invalid signature")
        raise HTTPException(status_code=403, detail="Invalid Click signature")

    if CLICK_SERVICE_ID and str(data.get("service_id", "")) != CLICK_SERVICE_ID:
        raise HTTPException(status_code=403, detail="Invalid Click service")

    order_id = data.get("merchant_trans_id")
    if not order_id:
        raise HTTPException(status_code=400, detail="merchant_trans_id is required")

    order = session.exec(
        select(PaymentOrder).where(PaymentOrder.id == int(order_id))
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    error_code = int(data.get("error", 0))

    if error_code != 0:
        order.status = "failed"
        session.add(order)
        session.commit()
        return {"error": error_code}

    if order.status == "paid":
        return {
            "error": 0,
            "merchant_trans_id": str(order.id),
            "merchant_prepare_id": data.get("merchant_prepare_id", ""),
        }

    user = session.exec(select(User).where(User.id == order.user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    amount = int(data.get("amount", 0))
    if amount and int(order.amount_uzs) != amount:
        raise HTTPException(status_code=400, detail="Incorrect amount")

    grant_tariff_benefits(user, order)
    order.status = "paid"
    order.paid_at = datetime.utcnow()

    session.add(
        TariffIncome(
            user_id=user.id,
            email=user.email,
            tariff_name=order.tariff_name,
            amount_uzs=int(order.amount_uzs or 0),
            generations_total=int(user.tariff_generations_total or 0),
            source="click",
        )
    )
    session.add(order)
    session.add(user)
    session.commit()

    return {
        "error": 0,
        "merchant_trans_id": str(order.id),
        "merchant_prepare_id": data.get("merchant_prepare_id", ""),
    }
