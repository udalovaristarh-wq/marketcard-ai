from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext

SECRET_KEY = "super-secret-key"
ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto",
)

print("SECURITY.PY LOADED")


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