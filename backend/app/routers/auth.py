from __future__ import annotations

from datetime import datetime, timedelta
import os
import re
import secrets
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import requests
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from sqlmodel import Session, select

from app.db import get_session
from app.models import OfferAcceptanceLog, User
from app.schemas import (
    ForgotPasswordRequest,
    GoogleAuthRequest,
    PhoneForgotPasswordRequest,
    PhoneLoginRequest,
    PhoneRegisterRequest,
    PhoneResetPasswordRequest,
    ProfileResponse,
    ResetPasswordRequest,
    TariffActivateRequest,
    TokenResponse,
    UserLogin,
    UserRegister,
)
from app.security import (
    create_access_token,
    create_reset_token,
    get_current_user,
    hash_password,
    set_auth_cookie,
    validate_password_strength,
    verify_password,
    verify_reset_token,
)


router = APIRouter(tags=["auth"])

_admin_raw = os.getenv(
    "ADMIN_EMAILS",
    os.getenv("MARKETCARD_OWNER_EMAILS", ""),
).strip()
ADMIN_EMAILS = {
    item.strip().lower()
    for item in _admin_raw.split(",")
    if item.strip()
}
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

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
SMS_WEBHOOK_URL = os.getenv("SMS_WEBHOOK_URL", "")
SMS_WEBHOOK_TOKEN = os.getenv("SMS_WEBHOOK_TOKEN", "")

PHONE_RESET_CODES: dict[str, tuple[str, datetime]] = {}


def _public_reset_message() -> dict[str, str]:
    return {"message": "Если аккаунт найден, мы отправили инструкцию для сброса пароля"}


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

    accepted_at = getattr(user, "accepted_terms_at", None)
    accepted_at_value = accepted_at.isoformat() if hasattr(accepted_at, "isoformat") else None

    return {
        "email": user.email,
        "full_name": user.full_name,
        "tariff_name": tariff_name,
        "tariff_active": tariff_active,
        "tariff_generations_total": tariff_total,
        "tariff_generations_used": tariff_used,
        "audit_credits": audit_credits,
        "tariff_generations_left": tariff_left,
        "offer_accepted": bool(accepted_at),
        "offer_accepted_at": accepted_at_value,
        "offer_accept_lang": getattr(user, "accepted_terms_version", None),
    }


def _normalize_phone(phone: str) -> str:
    digits = re.sub(r"\D+", "", phone or "")
    if len(digits) < 9:
        raise HTTPException(status_code=400, detail="Некорректный номер телефона")
    if digits.startswith("998"):
        return f"+{digits}"
    return f"+998{digits[-9:]}"


def _phone_email(phone: str) -> str:
    digits = re.sub(r"\D+", "", _normalize_phone(phone))
    return f"phone_{digits}@phone.marketcard.local"


def _issue_token(user: User, response: Response) -> TokenResponse:
    token = create_access_token(
        {
            "user_id": user.id,
            "tv": int(getattr(user, "token_version", 0) or 0),
        }
    )
    set_auth_cookie(response, token)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        email=user.email,
    )


def _invalidate_user_tokens(user: User) -> None:
    user.token_version = int(getattr(user, "token_version", 0) or 0) + 1


def _assert_user_can_login(user: User) -> None:
    if getattr(user, "is_banned", False):
        reason = getattr(user, "ban_reason", None) or "Причина не указана"
        raise HTTPException(
            status_code=403,
            detail=f"Ваш аккаунт заблокирован. Причина: {reason}",
        )


def _create_user(
    *,
    session: Session,
    email: str,
    password: str,
    full_name: str = "",
    terms_version: str = "v1",
) -> User:
    user = User(
        email=email,
        password=hash_password(password),
        full_name=full_name or "",
        accepted_terms_at=datetime.utcnow(),
        accepted_terms_version=terms_version,
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
    return user


def send_reset_email(to_email: str, reset_link: str) -> None:
    if not SMTP_USER or not SMTP_PASSWORD:
        raise RuntimeError("SMTP credentials are not configured")

    subject = "Сброс пароля MarketCard AI"
    body = f"""Здравствуйте!

Вы запросили сброс пароля для MarketCard AI.

Перейдите по ссылке ниже, чтобы задать новый пароль:
{reset_link}

Если это были не вы, просто проигнорируйте письмо.

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


def send_sms(phone: str, message: str) -> None:
    if not SMS_WEBHOOK_URL:
        raise RuntimeError("SMS provider is not configured")

    headers = {}
    if SMS_WEBHOOK_TOKEN:
        headers["Authorization"] = f"Bearer {SMS_WEBHOOK_TOKEN}"

    response = requests.post(
        SMS_WEBHOOK_URL,
        json={"phone": phone, "message": message},
        headers=headers,
        timeout=20,
    )
    response.raise_for_status()


def verify_google_id_token(id_token: str) -> dict:
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google OAuth is not configured")

    response = requests.get(
        "https://oauth2.googleapis.com/tokeninfo",
        params={"id_token": id_token},
        timeout=10,
    )
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    payload = response.json()
    if payload.get("aud") != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=401, detail="Google token audience mismatch")
    if payload.get("email_verified") not in (True, "true", "True", "1"):
        raise HTTPException(status_code=401, detail="Google email is not verified")

    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Google token has no email")
    return payload


@router.post("/register", response_model=TokenResponse)
def register_user(
    data: UserRegister,
    response: Response,
    session: Session = Depends(get_session),
):
    if not getattr(data, "offer_accepted", False):
        raise HTTPException(status_code=400, detail="Нужно принять условия оферты")

    validate_password_strength(data.password)

    existing = session.exec(select(User).where(User.email == data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = _create_user(
        session=session,
        email=data.email,
        password=data.password,
        full_name=data.full_name,
        terms_version=getattr(data, "offer_accept_lang", None) or "v1",
    )
    return _issue_token(user, response)


@router.post("/google", response_model=TokenResponse)
def google_auth(
    data: GoogleAuthRequest,
    response: Response,
    session: Session = Depends(get_session),
):
    if not data.offer_accepted:
        raise HTTPException(status_code=400, detail="Нужно принять условия оферты")

    payload = verify_google_id_token(data.id_token)
    email = payload["email"].lower()
    full_name = payload.get("name") or payload.get("given_name") or ""

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        user = _create_user(
            session=session,
            email=email,
            password=secrets.token_urlsafe(32),
            full_name=full_name,
            terms_version="google",
        )

    _assert_user_can_login(user)
    user.last_login = datetime.utcnow()
    session.add(user)
    session.commit()
    session.refresh(user)
    return _issue_token(user, response)


@router.post("/phone/register", response_model=TokenResponse)
def phone_register(
    data: PhoneRegisterRequest,
    response: Response,
    session: Session = Depends(get_session),
):
    if not data.offer_accepted:
        raise HTTPException(status_code=400, detail="Нужно принять условия оферты")

    validate_password_strength(data.password)

    phone = _normalize_phone(data.phone)
    email = _phone_email(phone)
    existing = session.exec(select(User).where(User.email == email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone already exists")

    user = _create_user(
        session=session,
        email=email,
        password=data.password,
        full_name=data.full_name or phone,
        terms_version="phone",
    )
    return _issue_token(user, response)


@router.post("/phone/login", response_model=TokenResponse)
def phone_login(
    data: PhoneLoginRequest,
    response: Response,
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == _phone_email(data.phone))).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid login")

    _assert_user_can_login(user)
    user.last_login = datetime.utcnow()
    session.add(user)
    session.commit()
    session.refresh(user)
    return _issue_token(user, response)


@router.post("/phone/forgot-password")
def phone_forgot_password(
    data: PhoneForgotPasswordRequest,
    session: Session = Depends(get_session),
):
    phone = _normalize_phone(data.phone)
    user = session.exec(select(User).where(User.email == _phone_email(phone))).first()
    if not user:
        return _public_reset_message()

    code = f"{secrets.randbelow(1_000_000):06d}"
    PHONE_RESET_CODES[phone] = (
        hash_password(code),
        datetime.utcnow() + timedelta(minutes=10),
    )

    try:
        send_sms(phone, f"MarketCard AI: код для сброса пароля {code}. Действует 10 минут.")
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Ошибка отправки SMS: {exc}") from exc

    return _public_reset_message()


@router.post("/phone/reset-password")
def phone_reset_password(
    data: PhoneResetPasswordRequest,
    session: Session = Depends(get_session),
):
    phone = _normalize_phone(data.phone)
    code_record = PHONE_RESET_CODES.get(phone)
    if not code_record:
        raise HTTPException(status_code=400, detail="Неверный или просроченный код")

    hashed_code, expires_at = code_record
    if expires_at < datetime.utcnow() or not verify_password(data.code, hashed_code):
        raise HTTPException(status_code=400, detail="Неверный или просроченный код")

    user = session.exec(select(User).where(User.email == _phone_email(phone))).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    validate_password_strength(data.new_password)
    user.password = hash_password(data.new_password)
    _invalidate_user_tokens(user)
    session.add(user)
    session.commit()
    PHONE_RESET_CODES.pop(phone, None)
    return {"message": "Пароль успешно обновлен"}


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


@router.post("/activate-tariff")
def activate_tariff(
    data: TariffActivateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user = session.get(User, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

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
        amount_uzs={"Start": 249000, "Business": 799000, "Premium": 1900000}.get(
            user.tariff_name, 0
        ),
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
        return _public_reset_message()

    token = create_reset_token(user.email)
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    try:
        send_reset_email(user.email, reset_link)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Ошибка отправки письма: {exc}") from exc

    return _public_reset_message()


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

    validate_password_strength(data.new_password)
    user.password = hash_password(data.new_password)
    _invalidate_user_tokens(user)
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"message": "Пароль успешно обновлен"}


@router.post("/login", response_model=TokenResponse)
def login(
    data: UserLogin,
    response: Response,
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == data.email)).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid login")

    _assert_user_can_login(user)
    user.last_login = datetime.utcnow()
    session.add(user)
    session.commit()
    session.refresh(user)
    return _issue_token(user, response)


@router.post("/accept-offer")
def accept_offer(
    request: Request,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user = session.get(User, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    accept_lang = request.headers.get("x-offer-lang", "ru")
    offer_version = request.headers.get("x-offer-version", "v1")

    if hasattr(user, "accepted_terms_at"):
        user.accepted_terms_at = datetime.utcnow()
    if hasattr(user, "accepted_terms_version"):
        user.accepted_terms_version = offer_version

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
