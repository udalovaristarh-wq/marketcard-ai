from __future__ import annotations

import jwt
from fastapi import Request
from starlette.responses import JSONResponse

from app.security import ALGORITHM, COOKIE_NAME, SECRET_KEY

PROTECTED_PREFIXES = (
    "/generated_cards",
    "/generated_reports",
    "/generated_videos",
)


def _extract_token(request: Request) -> str | None:
    auth_header = request.headers.get("authorization", "").strip()
    if auth_header.lower().startswith("bearer "):
        return auth_header[7:].strip()
    cookie_token = request.cookies.get(COOKIE_NAME)
    if cookie_token:
        return cookie_token
    return None


async def protect_generated_assets(request: Request, call_next):
    path = request.url.path
    if not any(path.startswith(prefix) for prefix in PROTECTED_PREFIXES):
        return await call_next(request)

    token = _extract_token(request)
    if not token:
        return JSONResponse(status_code=401, content={"detail": "Authentication required"})

    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.InvalidTokenError:
        return JSONResponse(status_code=401, content={"detail": "Invalid token"})

    return await call_next(request)
