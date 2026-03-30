from __future__ import annotations

from fastapi import APIRouter, Query
from sqlmodel import Session, select

from app.db import engine
from app.models.ikpu import IKPU

router = APIRouter(prefix="/api/ikpu", tags=["IKPU"])


@router.get("/search")
def search_ikpu(q: str = Query(..., min_length=1)):
    query = q.strip()

    with Session(engine) as session:
        results = session.exec(
            select(IKPU)
            .where(IKPU.name.ilike(f"%{query}%"))
            .limit(20)
        ).all()

        if not results:
            results = session.exec(
                select(IKPU)
                .where(IKPU.code.ilike(f"%{query}%"))
                .limit(20)
            ).all()

    return {
        "success": True,
        "query": query,
        "items": [
            {
                "code": item.code,
                "name": item.name,
            }
            for item in results
        ],
    }