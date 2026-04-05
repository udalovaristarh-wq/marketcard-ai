from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db import get_session
from app.models import User
from .auth import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])


def check_admin(user: User):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user


@router.get("/users")
def get_all_users(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    check_admin(current_user)

    users = session.exec(select(User)).all()

    return [
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "tariff_name": user.tariff_name,
            "tariff_active": user.tariff_active,
            "generations_total": user.tariff_generations_total,
            "generations_used": user.tariff_generations_used,
            "generations_left": user.tariff_generations_left,
            "is_admin": user.is_admin,
            "is_banned": user.is_banned,
            "ban_reason": user.ban_reason,
        }
        for user in users
    ]
