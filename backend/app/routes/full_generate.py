from __future__ import annotations

import asyncio
import json
import shutil
import uuid
from pathlib import Path
from datetime import datetime, timedelta

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from sqlmodel import Session, select
from sqlalchemy import func

from app.db import engine
from app.models import User
from app.models.generationexpense import GenerationExpense
from app.models.generationjob import GenerationJob

router = APIRouter(tags=["AI Full Generate"])

TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(parents=True, exist_ok=True)

COOLDOWN_SECONDS = 180

def normalize_variant_count(tariff_name: str | None, variant_count: int) -> int:
    tariff = (tariff_name or "").strip()

    if tariff == "Start":
        if variant_count != 1:
            raise HTTPException(
                status_code=403,
                detail="Тариф Start позволяет только 1 фото за генерацию",
            )
        return 1

    if tariff == "Business":
        if variant_count not in (1, 3):
            raise HTTPException(
                status_code=403,
                detail="Тариф Business позволяет только 1 или 3 фото за генерацию",
            )
        return variant_count

    if tariff == "Premium":
        if variant_count not in (1, 3, 5):
            raise HTTPException(
                status_code=403,
                detail="Тариф Premium позволяет только 1, 3 или 5 фото за генерацию",
            )
        return variant_count

    raise HTTPException(
        status_code=403,
        detail="Тариф не активирован или не поддерживается",
    )


def ensure_cooldown(session: Session, user_id: int) -> None:
    latest_job = session.exec(
        select(GenerationJob)
        .where(GenerationJob.user_id == user_id)
        .order_by(GenerationJob.created_at.desc())
    ).first()

    if not latest_job:
        return

    now = datetime.utcnow()
    next_allowed_at = latest_job.created_at + timedelta(seconds=COOLDOWN_SECONDS)

    if next_allowed_at > now:
        remaining_seconds = int((next_allowed_at - now).total_seconds())
        raise HTTPException(
            status_code=429,
            detail={
                "message": "Следующая генерация будет доступна позже",
                "remaining_seconds": remaining_seconds,
                "cooldown_seconds": COOLDOWN_SECONDS,
            },
        )



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

        clean_email = email.strip().lower()

        suffix = Path(image.filename).suffix.lower() or ".png"
        temp_filename = f"{uuid.uuid4().hex}{suffix}"
        image_path = TEMP_DIR / temp_filename

        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        with Session(engine) as session:
            user = session.exec(
                select(User).where(func.lower(User.email) == clean_email)
            ).first()

            if not user:
                raise HTTPException(status_code=404, detail="Пользователь не найден")

            remaining = user.tariff_generations_total - user.tariff_generations_used
            if remaining <= 0:
                raise HTTPException(status_code=403, detail="Лимит генераций исчерпан")

            variant_count = normalize_variant_count(user.tariff_name, int(variant_count))
            ensure_cooldown(session, int(user.id))

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

            job = GenerationJob(
                user_id=user.id,
                email=user.email,
                tariff_name=user.tariff_name,
                marketplace=marketplace,
                language_mode=language_mode,
                variant_count=variant_count,
                payload_json=json.dumps(payload, ensure_ascii=False),
                status="queued",
            )
            session.add(job)
            session.commit()
            session.refresh(job)

            job_id = job.id
        for _ in range(300):
            await asyncio.sleep(2)

            with Session(engine) as session:
                job = session.get(GenerationJob, job_id)

                if not job:
                    raise HTTPException(status_code=500, detail="Задача очереди потеряна")

                if job.status in ("queued", "processing"):
                    continue

                if job.status == "failed":
                    raise HTTPException(
                        status_code=500,
                        detail=job.error_message or "Ошибка генерации в очереди",
                    )

                if job.status == "done":
                    result = json.loads(job.result_json) if job.result_json else {}

                    if result.get("success"):
                        user = session.exec(
                            select(User).where(func.lower(User.email) == clean_email)
                        ).first()

                        if user:
                            user.tariff_generations_used += 1
                            session.add(user)

                            cost = result.get("cost", {}) or {}

                            expense = GenerationExpense(
                                user_id=user.id,
                                email=user.email,
                                tariff_name=user.tariff_name,
                                marketplace=marketplace,
                                language_mode=language_mode,
                                variants_count=variant_count,
                                text_model=None,
                                image_model=None,
                                text_cost_usd=cost.get("text_cost", 0.0),
                                image_cost_usd=cost.get("image_cost", 0.0),
                                total_cost_usd=cost.get("total_cost", 0.0),
                                source="full_generate_queue_bridge",
                            )
                            session.add(expense)
                            session.commit()

                    result["cooldown_seconds"] = COOLDOWN_SECONDS
                    return result
        raise HTTPException(
            status_code=504,
            detail="Генерация заняла слишком много времени. Попробуйте позже.",
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
