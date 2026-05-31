from __future__ import annotations
from fastapi import Depends
from app.security import get_current_user
from app.db import get_session
from sqlmodel import Session
from app.models.user import User


from fastapi import APIRouter, File, UploadFile, HTTPException

from app.services.card_audit_service import analyze_product_card

router = APIRouter(prefix="/card-audit", tags=["card-audit"])


@router.post("/analyze")
async def analyze_card(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Загрузите изображение")

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Файл пустой")

    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Файл слишком большой")

    # 🔒 проверка лимита
    if (current_user.audit_credits or 0) <= 0:
        raise HTTPException(
            status_code=402,
            detail="Лимит оценок карточек исчерпан. Купите дополнительные аудиты."
        )

    result = analyze_product_card(image_bytes, file.filename or "card.jpg")

    if not result:
        raise HTTPException(status_code=500, detail="Не удалось выполнить аудит карточки")

    current_user.audit_credits = max((current_user.audit_credits or 0) - 1, 0)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return {
        "success": True,
        "audit": result,
        "audit_credits_left": current_user.audit_credits,
    }
