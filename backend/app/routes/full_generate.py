from __future__ import annotations

import asyncio
import json
import shutil
import uuid
from pathlib import Path

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

                    return result
        raise HTTPException(
            status_code=504,
            detail="Генерация заняла слишком много времени. Попробуйте позже.",
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
