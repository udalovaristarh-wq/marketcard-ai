from sqlalchemy import text
from fastapi import HTTPException

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from sqlmodel import Session, select
from sqlalchemy import func
from app.db import engine
from app.models import User
from app.models.generationjob import GenerationJob

import json
import uuid
from pathlib import Path
import shutil
from io import BytesIO
from PIL import Image

def check_queue_limit(db):
    result = db.execute(text("""
        SELECT COUNT(*) FROM generationjob
        WHERE status IN ('queued', 'processing')
    """))
    return result.scalar()

QUEUE_LIMIT = 20

router = APIRouter(tags=["Queue Generate"])

TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}

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



@router.post("/queue/full-generate")
async def queue_full_generate(
    email: str = Form(...),
    product_title: str = Form(""),
    brand: str = Form(""),
    category: str = Form(""),
    marketplace: str = Form("uzum"),
    language_mode: str = Form("ru"),
    variant_count: int = Form(5),
    image: UploadFile = File(...)
):
    if not image:
        raise HTTPException(status_code=400, detail="Image required")

    suffix = Path(image.filename).suffix or ".png"
    filename = f"{uuid.uuid4().hex}{suffix}"
    image_path = TEMP_DIR / filename

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    with Session(engine) as session:
        queued_count = check_queue_limit(session)
        if queued_count is not None and int(queued_count) >= QUEUE_LIMIT:
            raise HTTPException(
                status_code=429,
                detail="Очередь генерации переполнена. Попробуйте позже.",
            )

        user = session.exec(select(User).where(func.lower(User.email) == email.lower().strip())).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        variant_count = normalize_variant_count(user.tariff_name, int(variant_count))

        payload = {
            "product_title": product_title,
            "brand": brand,
            "category": category,
            "marketplace": marketplace,
            "language_mode": language_mode,
            "variant_count": variant_count,
            "product_image": str(image_path),
        }

        job = GenerationJob(
            user_id=user.id,
            email=user.email,
            tariff_name=user.tariff_name,
            marketplace=marketplace,
            language_mode=language_mode,
            variant_count=variant_count,
            payload_json=json.dumps(payload),
            status="queued"
        )

        session.add(job)
        session.commit()
        session.refresh(job)

        return {
            "success": True,
            "job_id": job.id
        }


@router.get("/queue/job-status/{job_id}")
def get_job_status(job_id: int):
    with Session(engine) as session:
        job = session.get(GenerationJob, job_id)
        if not job:
            return {"success": False, "error": "Job not found"}

        return {
            "success": True,
            "status": job.status,
            "result": json.loads(job.result_json) if job.result_json else None,
            "error": job.error_message
        }
