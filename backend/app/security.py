from datetime import datetime, timedelta, timezone
import os

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlmodel import Session

from app.db import get_session
from app.models import User

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    SECRET_KEY = "dev-only-change-me"
ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto",
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password.strip())


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password.strip(), hashed_password)


def create_access_token(data: dict):
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    payload = data.copy()
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_reset_token(email: str):
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    payload = {
        "email": email,
        "type": "password_reset",
        "exp": expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_reset_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "password_reset":
            return None
        return payload.get("email")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise credentials_exception
    except jwt.InvalidTokenError:
        raise credentials_exception

    user = session.get(User, user_id)
    if not user:
        raise credentials_exception
   
    if hasattr(user, "is_banned") and user.is_banned:
          raise HTTPException(
        status_code=403,
        detail=user.ban_reason or "Ваш аккаунт заблокирован",
    )

    return user
