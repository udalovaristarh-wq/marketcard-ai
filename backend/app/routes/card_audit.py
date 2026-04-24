from __future__ import annotations

from fastapi import APIRouter, File, UploadFile, HTTPException

from app.services.card_audit_service import analyze_product_card

router = APIRouter(prefix="/card-audit", tags=["card-audit"])


@router.post("/analyze")
async def analyze_card(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Загрузите изображение карточки товара")

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Файл пустой")

    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Файл слишком большой. Максимум 10 МБ")

    result = analyze_product_card(image_bytes, file.filename or "card.jpg")

    return {
        "success": True,
        "audit": result,
    }
