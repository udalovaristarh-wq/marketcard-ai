from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session
from app.db import get_session
from app.models import User


router = APIRouter()



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
        raise HTTPException(
        status_code=403,
        detail=user.ban_reason or "Ваш аккаунт заблокирован"
    )

    return user

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "full_name": current_user.full_name,
        "tariff_name": current_user.tariff_name,
        "tariff_active": current_user.tariff_active,
        "tariff_generations_total": current_user.tariff_generations_total,
        "tariff_generations_used": current_user.tariff_generations_used,
        "tariff_generations_left": current_user.tariff_generations_left,
        "is_admin": getattr(current_user, "is_admin", False),
        "is_banned": getattr(current_user, "is_banned", False),
        "ban_reason": getattr(current_user, "ban_reason", None),
    }
