
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session
from app.db import get_session
from app.security import get_current_user
from app.models.user import User

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
def analyze_product(req: AnalyzeRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if (current_user.audit_credits or 0) <= 0:
        raise HTTPException(status_code=402, detail="Пополните аудиты")

    
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

    
    if result.get("count", 0) > 0:
        current_user.audit_credits = max((current_user.audit_credits or 0) - 1, 0)
        session.add(current_user)
        session.commit()
        session.refresh(current_user)
        result["audit_credits_left"] = current_user.audit_credits

    return result

