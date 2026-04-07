from __future__ import annotations

from pathlib import Path
import shutil
import uuid

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from sqlmodel import Session, select

from app.db import engine
from app.models import User
from app.services.ai_pipeline.full_generate_service import full_generate

router = APIRouter(tags=["AI Full Generate"])

TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/full-generate")
async def full_generate_endpoint(
    email: str = Form(...),
    product_title: str = Form(""),
    brand: str = Form(""),
    category: str = Form(""),
    purpose: str = Form(""),
    compatibility: str = Form(""),
    marketplace: str = Form("uzum"),
    language_mode: str = Form("ru"),
    variant_count: int = Form(5),
    extra_features: str = Form(""),
    image: UploadFile = File(...),
):
    try:
        if image is None:
            raise HTTPException(status_code=400, detail="Image file is required")

        if not image.filename:
            raise HTTPException(status_code=400, detail="Uploaded image has no filename")

        suffix = Path(image.filename).suffix.lower() or ".png"
        temp_filename = f"{uuid.uuid4().hex}{suffix}"
        image_path = TEMP_DIR / temp_filename

        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        with Session(engine) as session:
            user = session.exec(select(User).where(User.email == email)).first()

            if not user:
                raise HTTPException(status_code=404, detail="Пользователь не найден")

            remaining = user.tariff_generations_total - user.tariff_generations_used
            if remaining <= 0:
                raise HTTPException(status_code=403, detail="Лимит генераций исчерпан")

        payload = {
            "product_title": product_title,
            "brand": brand,
            "category": category,
            "purpose": purpose,
            "compatibility": compatibility,
            "marketplace": marketplace,
            "language_mode": language_mode,
            "variant_count": variant_count,
            "extra_features": extra_features,
            "product_image": str(image_path),
        }

        result = full_generate(payload)

        if result.get("success"):
            with Session(engine) as session:
                user = session.exec(select(User).where(User.email == email)).first()
                if user:
                    user.tariff_generations_used += 1
                    session.add(user)
                    session.commit()
                    session.refresh(user)

        return result

    except HTTPException:
        raise

    except Exception as e:
        from app.models import UserError

    with Session(engine) as session:
        error = UserError(
            user_id=0,
            error_type="generation_error",
            error_message=str(e),
        )
        session.add(error)
        session.commit()

        raise HTTPException(status_code=500, detail=str(e))
