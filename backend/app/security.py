from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlmodel import Session

from app.db import get_session
from app.models import User

APP_ENV = os.getenv("APP_ENV", "development").strip().lower()
SECRET_KEY = os.getenv("SECRET_KEY", "").strip()
if not SECRET_KEY:
    if APP_ENV in ("production", "prod"):
        raise RuntimeError("SECRET_KEY must be set in production")
    SECRET_KEY = "dev-only-change-me"

ALGORITHM = "HS256"
ACCESS_TOKEN_HOURS = int(os.getenv("ACCESS_TOKEN_HOURS", "8"))
COOKIE_NAME = "access_token"

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto",
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def hash_password(password: str) -> str:
    return pwd_context.hash(password.strip())


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password.strip(), hashed_password)


def validate_password_strength(password: str) -> None:
    cleaned = (password or "").strip()
    if len(cleaned) < 8:
        raise HTTPException(status_code=400, detail="Пароль должен быть не короче 8 символов")
    if cleaned.isdigit():
        raise HTTPException(status_code=400, detail="Пароль не должен состоять только из цифр")


def create_access_token(data: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_HOURS)
    payload = data.copy()
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_reset_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    payload = {
        "email": email,
        "type": "password_reset",
        "exp": expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_reset_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "password_reset":
            return None
        return payload.get("email")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def extract_bearer_token(
    request: Request,
    token: Optional[str] = Depends(oauth2_scheme),
) -> str:
    if token:
        return token
    cookie_token = request.cookies.get(COOKIE_NAME)
    if cookie_token:
        return cookie_token
    auth_header = request.headers.get("authorization", "").strip()
    if auth_header.lower().startswith("bearer "):
        return auth_header[7:].strip()
    raise HTTPException(status_code=401, detail="Could not validate credentials")


def set_auth_cookie(response, token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=APP_ENV in ("production", "prod"),
        samesite="lax",
        max_age=ACCESS_TOKEN_HOURS * 3600,
        path="/",
    )


def clear_auth_cookie(response) -> None:
    response.delete_cookie(key=COOKIE_NAME, path="/")


def get_current_user(
    request: Request,
    token: Optional[str] = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )

    try:
        raw_token = extract_bearer_token(request, token)
        payload = jwt.decode(raw_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise credentials_exception
        token_version = payload.get("tv", 0)
    except HTTPException:
        raise
    except jwt.InvalidTokenError:
        raise credentials_exception

    user = session.get(User, user_id)
    if not user:
        raise credentials_exception

    current_tv = int(getattr(user, "token_version", 0) or 0)
    if int(token_version or 0) != current_tv:
        raise credentials_exception

    if getattr(user, "is_banned", False):
        raise HTTPException(
            status_code=403,
            detail=user.ban_reason or "Ваш аккаунт заблокирован",
        )

    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if not getattr(current_user, "is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def try_get_current_user(
    request: Request,
    token: Optional[str] = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> Optional[User]:
    try:
        return get_current_user(request, token, session)
    except HTTPException:
        return None
