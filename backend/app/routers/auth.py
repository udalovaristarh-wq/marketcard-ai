from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.db import get_session
from app.models import User
from app.schemas import (
    UserRegister,
    UserLogin,
    TokenResponse,
    TariffActivateRequest,
    ProfileResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_reset_token,
    verify_reset_token,
)

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(tags=["auth"])

TARIFFS = {
    "Start": 20,
    "Business": 60,
    "Premium": 200,
}

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "marketcardai@gmail.com"
SMTP_PASSWORD = "tqogmqncvuwzfqkx"
FRONTEND_RESET_URL = "http://localhost:3000/reset-password"


def send_reset_email(to_email: str, reset_link: str):
    subject = "Сброс пароля MarketCard AI"
    body = f"""Здравствуйте!

Вы запросили сброс пароля для MarketCard AI.

Перейдите по ссылке ниже, чтобы задать новый пароль:
{reset_link}

Если это были не вы, просто проигнорируйте это письмо.

Ссылка действует 30 минут.
"""

    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain", "utf-8"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, to_email, msg.as_string())


@router.post("/register", response_model=TokenResponse)
def register_user(data: UserRegister, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        email=data.email,
        password=hash_password(data.password),
        full_name=data.full_name,
        tariff_name=None,
        tariff_active=False,
        tariff_generations_total=0,
        tariff_generations_used=0,
        tariff_generations_left=0,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token({"user_id": user.id})
    return {"access_token": token}


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data.email)).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid login")

    try:
        password_valid = verify_password(data.password, user.password)
    except Exception:
        password_valid = False

    if not password_valid:
        raise HTTPException(status_code=400, detail="Invalid login")

    token = create_access_token({"user_id": user.id})
    return {"access_token": token}


@router.get("/me", response_model=ProfileResponse)
def get_profile(
    email: str = Query(...),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "email": user.email,
        "full_name": user.full_name,
        "tariff_name": user.tariff_name,
        "tariff_active": user.tariff_active,
        "tariff_generations_total": user.tariff_generations_total,
        "tariff_generations_used": user.tariff_generations_used,
        "tariff_generations_left": max(
            user.tariff_generations_total - user.tariff_generations_used, 0
        ),
    }


@router.post("/activate-tariff")
def activate_tariff(
    data: TariffActivateRequest,
    email: str = Query(...),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.tariff_name not in TARIFFS:
        raise HTTPException(status_code=400, detail="Invalid tariff")
    user.tariff_name = data.tariff_name
    user.tariff_active = True
    user.tariff_generations_total = TARIFFS[data.tariff_name]
    user.tariff_generations_used = 0

    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "message": "Tariff activated",
        "tariff_name": user.tariff_name,
        "tariff_generations_total": user.tariff_generations_total,
        "tariff_generations_used": user.tariff_generations_used,
        "tariff_generations_left": max(
            user.tariff_generations_total - user.tariff_generations_used, 0
        ),
    }


@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == data.email)).first()

    if not user:
        return {"message": "Если такая почта существует, письмо отправлено"}

    token = create_reset_token(user.email)
    reset_link = f"{FRONTEND_RESET_URL}?token={token}"

    try:
        send_reset_email(user.email, reset_link)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка отправки письма: {str(e)}")

    return {"message": "Если такая почта существует, письмо отправлено"}


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    session: Session = Depends(get_session),
):
    email = verify_reset_token(data.token)
    if not email:
        raise HTTPException(status_code=400, detail="Неверный или просроченный токен")

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(data.new_password)
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"message": "Пароль успешно обновлён"}