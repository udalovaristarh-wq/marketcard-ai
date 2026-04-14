from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db import get_session
from app.models.user import User
from app.models.payment_order import PaymentOrder


import base64

PAYME_MERCHANT_ID = "TEST_MERCHANT_ID"
PAYME_BASE_URL = "https://test.paycom.uz"
CLICK_SERVICE_ID = "TEST_SERVICE_ID"
CLICK_MERCHANT_ID = "TEST_MERCHANT_ID"

router = APIRouter(prefix="/payments", tags=["payments"])


TARIFF_PRICES = {
    "Start": 249000,
    "Business": 799000,
    "Premium": 1900000,
}


@router.post("/create-order")
def create_order(
    email: str,
    tariff_name: str,
    provider: str = "unknown",
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == email)).first()

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

    amount_tiyin = order.amount_uzs * 100
    payme_data = f"m={PAYME_MERCHANT_ID};ac.order_id={order.id};a={amount_tiyin}"
    payme_encoded = base64.b64encode(payme_data.encode()).decode()
    payme_url = f"{PAYME_BASE_URL}/{payme_encoded}"

    click_url = (
        f"https://my.click.uz/services/pay"
        f"?service_id={CLICK_SERVICE_ID}"
        f"&merchant_id={CLICK_MERCHANT_ID}"
        f"&amount={order.amount_uzs}"
        f"&transaction_param={order.id}"
    )

    return {
        "success": True,
        "order_id": order.id,
        "amount": order.amount_uzs,
        "provider": provider,
        "payme_url": payme_url,
        "click_url": click_url,
    }


@router.post("/payme/callback")
async def payme_callback(data: dict, session: Session = Depends(get_session)):
    method = data.get("method")
    params = data.get("params", {})

    if method == "CheckPerformTransaction":
        return {
            "result": {
                "allow": True
            }
        }

    if method == "CreateTransaction":
        return {
            "result": {
                "create_time": 0,
                "transaction": "test"
            }
        }

    if method == "PerformTransaction":
        order_id = params.get("account", {}).get("order_id")

        order = session.exec(
            select(PaymentOrder).where(PaymentOrder.id == int(order_id))
        ).first()

        if not order:
            return {"error": {"code": -31050, "message": "Order not found"}}

        user = session.exec(
            select(User).where(User.id == order.user_id)
        ).first()

        if not user:
            return {"error": {"code": -31050, "message": "User not found"}}

        # 🔥 АКТИВАЦИЯ ТАРИФА
        user.tariff_name = order.tariff_name
        user.tariff_active = True
        user.tariff_generations_used = 0

        if order.tariff_name == "Start":
            user.tariff_generations_total = 20
            user.tariff_generations_left = 20
        elif order.tariff_name == "Business":
            user.tariff_generations_total = 60
            user.tariff_generations_left = 60
        elif order.tariff_name == "Premium":
            user.tariff_generations_total = 200
            user.tariff_generations_left = 200
        else:
            user.tariff_generations_total = 0
            user.tariff_generations_left = 0

        order.status = "paid"

        session.add(user)
        session.add(order)
        session.commit()

        return {
            "result": {
                "perform_time": 0,
                "transaction": "test",
                "state": 2
            }
        }

    return {"error": {"code": -32601, "message": "Method not found"}}
