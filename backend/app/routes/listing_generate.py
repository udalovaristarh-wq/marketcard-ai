from fastapi import APIRouter, Form
from app.services.ai_pipeline.seo_generator import generate_listing
from sqlmodel import Session
from app.models import User
from app.db import engine

router = APIRouter(prefix="/listing", tags=["listing"])


@router.post("/generate")
async def generate_listing(
    title: str = Form(...),
    brand: str = Form(...),
    category: str = Form(...),
    marketplace: str = Form(...),
):
    user_id = 1  # временно для теста

    with Session(engine) as session:
        user = session.get(User, user_id)

        if not user:
            return {"success": False, "error": "Пользователь не найден"}

        if user.tariff_generations_total - user.tariff_generations_used <= 0:
            return {"success": False, "error": "Лимит генераций исчерпан"}

        result = generate_listing(
            title=title,
            brand=brand,
            category=category,
            marketplace=marketplace,
        )

        user.tariff_generations_used += 1
        session.add(user)
        session.commit()

        return {
            "success": True,
            **result,
        }