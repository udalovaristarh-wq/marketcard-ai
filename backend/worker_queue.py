import time
import json
from datetime import datetime

from sqlmodel import Session, select

from app.db import engine
from app.models.generationjob import GenerationJob
from app.services.ai_pipeline.full_generate_service import full_generate


def run_worker():
    print("🚀 Worker started...")

    while True:
        try:
            with Session(engine) as session:
                job = session.exec(
                    select(GenerationJob)
                    .where(GenerationJob.status == "queued")
                    .order_by(GenerationJob.created_at)
                ).first()

                if not job:
                    time.sleep(2)
                    continue

                print(f"▶️ START JOB {job.id}")

                job.status = "processing"
                job.started_at = datetime.utcnow()
                session.add(job)
                session.commit()

                payload = json.loads(job.payload_json)

            # ⚠️ вне сессии делаем тяжёлую генерацию
            result = full_generate(payload)

            with Session(engine) as session:
                job = session.get(GenerationJob, job.id)

                if result.get("success"):
                    job.status = "done"
                    job.result_json = json.dumps(result)
                else:
                    job.status = "failed"
                    job.error_message = str(result)

                job.finished_at = datetime.utcnow()
                session.add(job)
                session.commit()

                print(f"✅ DONE JOB {job.id}")

        except Exception as e:
            print("❌ WORKER ERROR:", e)
            time.sleep(3)


if __name__ == "__main__":
    run_worker()
