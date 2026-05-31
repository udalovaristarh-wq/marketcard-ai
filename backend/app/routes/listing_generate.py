from fastapi import APIRouter, Depends, Form, HTTPException
from sqlmodel import Session

from app.db import engine
from app.models import User
from app.security import get_current_user
from app.services.ai_pipeline.seo_generator import generate_listing

router = APIRouter(prefix="/listing", tags=["listing"])


@router.post("/generate")
async def generate_listing_endpoint(
    title: str = Form(...),
    brand: str = Form(...),
    category: str = Form(...),
    marketplace: str = Form(...),
    current_user: User = Depends(get_current_user),
):
    with Session(engine) as session:
        user = session.get(User, current_user.id)

        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        generations_left = (user.tariff_generations_total or 0) - (
            user.tariff_generations_used or 0
        )
        if generations_left <= 0:
            raise HTTPException(status_code=403, detail="Лимит генераций исчерпан")

        result = generate_listing(
            title=title,
            brand=brand,
            category=category,
            marketplace=marketplace,
        )

        user.tariff_generations_used = (user.tariff_generations_used or 0) + 1
        user.tariff_generations_left = max(
            0,
            (user.tariff_generations_total or 0) - user.tariff_generations_used,
        )
        session.add(user)
        session.commit()

        return {
            "success": True,
            **result,
        }
