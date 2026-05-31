from datetime import datetime
import os

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlmodel import Session, select
from app.db import get_session
from app.models import User, OfferAcceptanceLog
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
    get_current_user,
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
ADMIN_EMAILS = {"udalovaristarh@gmail.com"}
TARIFFS = {
    "Start": 20,
    "Business": 60,
    "Premium": 200,
}

AUDIT_CREDITS_BY_TARIFF = {
    "Start": 10,
    "Business": 30,
    "Premium": 100,
}


SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://marketcard.uz").rstrip("/")


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


def _normalize_email(email: str | None) -> str:
    return (email or "").strip().lower()


def _profile_payload(user: User) -> dict:
    tariff_name = getattr(user, "tariff_name", None)
    tariff_active = bool(getattr(user, "tariff_active", False))
    tariff_used = int(getattr(user, "tariff_generations_used", 0) or 0)
    tariff_total = int(getattr(user, "tariff_generations_total", 0) or 0)

    if tariff_active and tariff_name in TARIFFS and tariff_total <= 0:
        tariff_total = TARIFFS[tariff_name]

    stored_left = getattr(user, "tariff_generations_left", None)
    computed_left = max(tariff_total - tariff_used, 0)
    if stored_left is None:
        tariff_left = computed_left
    else:
        tariff_left = int(stored_left or 0)
        if tariff_active and computed_left > tariff_left:
            tariff_left = computed_left

    audit_credits = int(getattr(user, "audit_credits", 0) or 0)
    if tariff_active and tariff_name in AUDIT_CREDITS_BY_TARIFF and audit_credits <= 0:
        audit_credits = AUDIT_CREDITS_BY_TARIFF[tariff_name]

    offer_accepted_at = getattr(user, "offer_accepted_at", None)
    if hasattr(offer_accepted_at, "isoformat"):
        offer_accepted_at = offer_accepted_at.isoformat()

    return {
        "email": user.email,
        "full_name": user.full_name,
        "tariff_name": tariff_name,
        "tariff_active": tariff_active,
        "tariff_generations_total": tariff_total,
        "tariff_generations_used": tariff_used,
        "tariff_generations_left": tariff_left,
        "audit_credits": audit_credits,
        "offer_accepted": bool(getattr(user, "offer_accepted", False)),
        "offer_accepted_at": offer_accepted_at,
        "offer_accept_lang": getattr(user, "offer_accept_lang", None),
    }


@router.post("/register", response_model=TokenResponse)
def register_user(data: UserRegister, session: Session = Depends(get_session)):
    if not getattr(data, "offer_accepted", False):
        raise HTTPException(status_code=400, detail="You must accept the Terms of Offer")

    existing = session.exec(
        select(User).where(
            User.email == data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        email=data.email,
        password=hash_password(data.password),
        full_name=data.full_name,
        offer_accepted=True,
        offer_accepted_at=datetime.utcnow(),
        offer_accept_lang=getattr(data, "offer_accept_lang", None),
        tariff_name=None,
        tariff_active=False,
        tariff_generations_total=0,
        tariff_generations_used=0,
        tariff_generations_left=0,
        audit_credits=0,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token({"user_id": user.id})
    return {"access_token": token}

@router.get("/me", response_model=ProfileResponse)
def get_profile(
    email: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user = current_user
    requested_email = _normalize_email(email)
    current_email = _normalize_email(current_user.email)

    if requested_email and requested_email != current_email:
        if not getattr(current_user, "is_admin", False):
            raise HTTPException(status_code=403, detail="Profile access denied")

        requested_user = session.exec(
            select(User).where(User.email == requested_email)
        ).first()
        if not requested_user:
            raise HTTPException(status_code=404, detail="User not found")

        user = requested_user

    return _profile_payload(user)


@router.get("/profile", response_model=ProfileResponse)
def get_profile_alias(
    email: str | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return get_profile(email=email, current_user=current_user, session=session)


@router.post("/activate-tariff")
def activate_tariff(
    data: TariffActivateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user = current_user

    if user.email not in ADMIN_EMAILS and not getattr(user, "is_admin", False):
        raise HTTPException(status_code=403, detail="Оплата обязательна")

    if data.tariff_name not in TARIFFS:
        raise HTTPException(status_code=400, detail="Invalid tariff")
    user.tariff_name = data.tariff_name
    user.tariff_active = True
    user.tariff_generations_total = TARIFFS[data.tariff_name]
    user.tariff_generations_used = 0
    user.tariff_generations_left = TARIFFS[data.tariff_name]
    user.audit_credits = AUDIT_CREDITS_BY_TARIFF.get(data.tariff_name, 0)

    session.add(user)
    session.commit()
    session.refresh(user)

    from app.models.finance_income import TariffIncome
    income = TariffIncome(
        user_id=user.id,
        email=user.email,
        tariff_name=user.tariff_name,
        amount_uzs={"Start":249000,"Business":799000,"Premium":1900000}.get(user.tariff_name, 0),
        generations_total=user.tariff_generations_total,
        source="tariff_activation",
    )
    session.add(income)
    session.commit()

    payload = _profile_payload(user)
    payload["message"] = "Tariff activated"
    return payload

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == data.email)).first()

    if not user:
        return {"message": "Если такая почта существует, письмо отправлено"}

    token = create_reset_token(user.email)
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    try:
        send_reset_email(user.email, reset_link)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка отправки письма: {
                str(e)}")

    return {"message": "Если такая почта существует, письмо отправлено"}


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    session: Session = Depends(get_session),
):
    email = verify_reset_token(data.token)
    if not email:
        raise HTTPException(status_code=400,
                            detail="Неверный или просроченный токен")

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(data.new_password)
    session.add(user)
    session.commit()
    session.refresh(user)

    from app.models.finance_income import TariffIncome

    income = TariffIncome(

        user_id=user.id,

        email=user.email,

        tariff_name=user.tariff_name,

        amount_uzs={"Start":249000,"Business":799000,"Premium":1900000}.get(user.tariff_name,0),

        generations_total=user.tariff_generations_total,

        source="tariff_activation",

    )

    session.add(income)

    session.commit()


    return {"message": "Пароль успешно обновлён"}

from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import User
from app.security import verify_password, create_access_token
from app.db import get_session
from fastapi import Depends


@router.post("/login")
def login(data: UserLogin, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid login")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid login")

    # 🔥 БАН ПРОВЕРКА
    if getattr(user, "is_banned", False):
        raise HTTPException(
            status_code=403,
            detail=f"Ваш аккаунт заблокирован. Причина: {getattr(user, 'ban_reason', 'Не указана')}"
        )

    token = create_access_token({"user_id": user.id})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/accept-offer")
def accept_offer(
    request: Request,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user = current_user

    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    accept_lang = request.headers.get("x-offer-lang", "ru")
    offer_version = request.headers.get("x-offer-version", "v1")

    user.offer_accepted = True

    if hasattr(user, "offer_accepted_at"):
        user.offer_accepted_at = datetime.utcnow()
    if hasattr(user, "offer_accept_lang"):
        user.offer_accept_lang = accept_lang
    if hasattr(user, "offer_accept_ip"):
        user.offer_accept_ip = client_ip
    if hasattr(user, "offer_accept_user_agent"):
        user.offer_accept_user_agent = user_agent

    log = OfferAcceptanceLog(
        user_id=user.id,
        email=user.email,
        accepted=True,
        accepted_at=datetime.utcnow(),
        accept_lang=accept_lang,
        accept_ip=client_ip,
        accept_user_agent=user_agent,
        offer_version=offer_version,
    )

    session.add(user)
    session.add(log)
    session.commit()
    session.refresh(user)

    return {"success": True, "message": "Offer accepted"}
