from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select

from app.db import get_session
from app.models.payment_order import PaymentOrder
from app.models.user import User

router = APIRouter(prefix="/payments/click", tags=["click"])


@router.post("/callback")
async def click_callback(request: Request, session: Session = Depends(get_session)):
    data = await request.json()

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

    user = session.exec(
        select(User).where(User.id == order.user_id)
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

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

    session.add(order)
    session.add(user)
    session.commit()

    return {
        "error": 0,
        "merchant_trans_id": str(order.id),
        "merchant_prepare_id": data.get("merchant_prepare_id", ""),
    }
