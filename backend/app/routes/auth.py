from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session
from app.db import get_session
from app.models import User

SECRET_KEY = "SECRET"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


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
        user_id: int = payload.get("user_id")
    except JWTError:
        raise credentials_exception

    user = session.get(User, user_id)

    if not user:
        raise credentials_exception

    if user.is_banned:
        raise HTTPException(status_code=403, detail="User banned")

    return user
