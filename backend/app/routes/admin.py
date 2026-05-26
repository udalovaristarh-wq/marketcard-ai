from fastapi import APIRouter, Depends, HTTPException
import os
from pydantic import BaseModel
from datetime import datetime
from sqlmodel import Session, select
from app.db import get_session
from app.models import User
from app.security import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])
class AdminPasswordRequest(BaseModel):
    password: str

class BanUserRequest(BaseModel):
    user_id: int
    reason: str | None = None


class UnbanUserRequest(BaseModel):
    user_id: int

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
            "created_at": user.created_at,
            "last_login": user.last_login,
        }
        for user in users
    ]
    
@router.post("/verify-password")
def verify_admin_password(
    data: AdminPasswordRequest,
    current_user: User = Depends(get_current_user),
):
    check_admin(current_user)

    admin_password = os.getenv("ADMIN_PANEL_PASSWORD", "").strip()

    if not admin_password:
        raise HTTPException(status_code=500, detail="Admin password not configured")

    if data.password.strip() != admin_password:
        raise HTTPException(status_code=403, detail="Неверный пароль администратора")

    return {"success": True}

@router.post("/ban-user")
def ban_user(
    data: BanUserRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    check_admin(current_user)

    user = session.get(User, data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if user.is_admin:
        raise HTTPException(status_code=400, detail="Нельзя забанить администратора")

    user.is_banned = True
    user.ban_reason = data.reason.strip() if data.reason else "Без причины"

    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "success": True,
        "message": "Пользователь забанен",
        "user_id": user.id,
        "is_banned": user.is_banned,
        "ban_reason": user.ban_reason,
    }


@router.post("/unban-user")
def unban_user(
    data: UnbanUserRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    check_admin(current_user)

    user = session.get(User, data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user.is_banned = False
    user.ban_reason = None

    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "success": True,
        "message": "Пользователь разбанен",
        "user_id": user.id,
        "is_banned": user.is_banned,
        "ban_reason": user.ban_reason,
    }
