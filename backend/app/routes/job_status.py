from fastapi import APIRouter
from sqlmodel import Session, select
from app.db import engine
from app.models.generationexpense import GenerationExpense

router = APIRouter()

@router.get("/job-status/{job_id}")
def get_job_status(job_id: int):
    with Session(engine) as session:
        job = session.exec(
            select(GenerationExpense).where(GenerationExpense.id == job_id)
        ).first()

        if not job:
            return {"status": "not_found"}

        return {
            "status": job.status,
            "variants": job.variants_count
        }
