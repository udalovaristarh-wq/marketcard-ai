from fastapi import APIRouter, Query

from app.services.product_intelligence.parsers.uzum_parser import parse_uzum
from app.services.product_intelligence.uzum_analyzer import analyze_items

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/uzum")
def analyze_uzum(
    query: str = Query(..., min_length=2),
    category: str = "товары",
):
    items = parse_uzum(query, category, 30)
    result = analyze_items(items)
    result["items_preview"] = items[:5]
    return result
