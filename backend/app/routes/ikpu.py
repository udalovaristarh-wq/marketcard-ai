from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.services.ikpu_service import search_ikpu, suggest_ikpu_for_product

router = APIRouter(prefix="/ikpu", tags=["IKPU"])


class IkpuSuggestRequest(BaseModel):
    title: str
    brand: str = ""
    category: str = ""
    description: str = ""


@router.get("/search")
def ikpu_search_endpoint(
    q: str = Query(..., min_length=2),
    limit: int = Query(10, ge=1, le=30),
):
    try:
        result = search_ikpu(q, limit=limit)
        return {
            "success": True,
            "query": q,
            "items": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/suggest")
def ikpu_suggest_endpoint(data: IkpuSuggestRequest):
    try:
        return suggest_ikpu_for_product(
            title=data.title,
            brand=data.brand,
            category=data.category,
            description=data.description,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
