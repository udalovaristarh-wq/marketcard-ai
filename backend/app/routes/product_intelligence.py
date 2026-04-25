
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.product_intelligence.parsers.uzum_parser import parse_uzum
from app.services.product_intelligence.parsers.yandex_parser import parse_yandex
from app.services.product_intelligence.parsers.wb_parser import parse_wildberries
from app.services.product_intelligence.uzum_analyzer import analyze_items

router = APIRouter()

class AnalyzeRequest(BaseModel):
    query: str
    category: str
    marketplace: str = "uzum"

@router.post("/product-intelligence")
def analyze_product(req: AnalyzeRequest):
    
    if req.marketplace == "yandex":
        items = parse_yandex(req.query, req.category, 30)
        if not items:
            items = parse_uzum(req.query, req.category, 30)

    elif req.marketplace == "wb":
        items = parse_wildberries(req.query, req.category, 30)
        if not items:
            items = parse_uzum(req.query, req.category, 30)
    else:
        items = parse_uzum(req.query, req.category, 30)
    
    result = analyze_items(items)

    return result
