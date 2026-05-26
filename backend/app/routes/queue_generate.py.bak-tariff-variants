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

router = APIRouter(tags=["Queue Generate"])

TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(parents=True, exist_ok=True)


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

    print("QUEUE EMAIL RAW =", repr(email))
    with Session(engine) as session:
        user = session.exec(select(User).where(func.lower(User.email) == email.lower().strip())).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

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
