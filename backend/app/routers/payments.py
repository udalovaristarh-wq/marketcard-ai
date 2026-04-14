from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db import get_session
from app.models.user import User
from app.models.payment_order import PaymentOrder

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

    return {
        "success": True,
        "order_id": order.id,
        "amount": order.amount_uzs,
        "provider": provider,
    }
