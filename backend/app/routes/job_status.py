import json

from fastapi import APIRouter
from sqlmodel import Session

from app.db import engine
from app.models.generationjob import GenerationJob

router = APIRouter()


@router.get("/job-status/{job_id}")
def get_job_status(job_id: int):
    with Session(engine) as session:
        job = session.get(GenerationJob, job_id)

        if not job:
            return {"success": False, "status": "not_found"}

        return {
            "success": True,
            "status": job.status,
            "variants": job.variant_count,
            "result": json.loads(job.result_json) if job.result_json else None,
            "error": job.error_message,
        }
