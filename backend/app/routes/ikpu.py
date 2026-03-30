from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from app.services.ikpu_service import search_ikpu

router = APIRouter(prefix="/api/ikpu", tags=["IKPU"])


@router.get("/search")
def ikpu_search_endpoint(q: str = Query(..., min_length=2)):
    try:
        result = search_ikpu(q)
        return {
            "success": True,
            "query": q,
            "items": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))