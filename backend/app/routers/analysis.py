from fastapi import APIRouter, Depends, Query

from app.models.user import User
from app.security import get_current_user
from app.services.product_intelligence.parsers.uzum_parser import parse_uzum
from app.services.product_intelligence.parsers.wb_parser import parse_wildberries
from app.services.product_intelligence.uzum_analyzer import analyze_items

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/uzum")
def analyze_uzum(
    query: str = Query(..., min_length=2),
    category: str = "товары",
    current_user: User = Depends(get_current_user),
):
    items = parse_uzum(query, category, 30)
    result = analyze_items(items)
    result["items_preview"] = items[:5]
    return result


@router.get("/analysis/wb")
def analysis_wb(
    query: str,
    category: str = "товары",
    current_user: User = Depends(get_current_user),
):
    items = parse_wildberries(query, category, 30)
    return analyze_items(items)
