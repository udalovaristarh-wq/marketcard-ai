from __future__ import annotations

import os
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.models import User
from app.security import get_current_user

router = APIRouter(tags=["marketplace-publish"])


MARKETPLACE_ENV = {
    "uzum": ("UZUM_API_KEY", "UZUM_SELLER_ID"),
    "wildberries": ("WILDBERRIES_TOKEN",),
    "ozon": ("OZON_CLIENT_ID", "OZON_API_KEY"),
    "yandex": ("YANDEX_MARKET_TOKEN", "YANDEX_MARKET_CAMPAIGN_ID"),
}


class PublishRequest(BaseModel):
    marketplace: str = Field(default="uzum")
    product_title: str = Field(default="")
    brand: str = Field(default="")
    category: str = Field(default="")
    description: str = Field(default="")
    ikpu_code: str = Field(default="")
    image_urls: list[str] = Field(default_factory=list)
    video_url: str = Field(default="")
    price: float | None = None
    stock: int | None = None


def _marketplace_status() -> dict[str, dict[str, Any]]:
    status: dict[str, dict[str, Any]] = {}
    for marketplace, keys in MARKETPLACE_ENV.items():
        missing = [key for key in keys if not os.getenv(key)]
        status[marketplace] = {
            "configured": not missing,
            "required_env": list(keys),
            "missing_env": missing,
        }
    return status


def _payload_dump(payload: PublishRequest) -> dict[str, Any]:
    if hasattr(payload, "model_dump"):
        return payload.model_dump()
    return payload.dict()


@router.get("/marketplaces/status")
def get_marketplace_status(current_user: User = Depends(get_current_user)):
    return {
        "success": True,
        "user_id": current_user.id,
        "marketplaces": _marketplace_status(),
    }


@router.post("/marketplaces/publish")
def publish_to_marketplace(
    payload: PublishRequest,
    current_user: User = Depends(get_current_user),
):
    marketplace = payload.marketplace.strip().lower()
    status = _marketplace_status()

    if marketplace not in status:
        raise HTTPException(status_code=400, detail="Unsupported marketplace")

    if not status[marketplace]["configured"]:
        return {
            "success": False,
            "published": False,
            "marketplace": marketplace,
            "user_id": current_user.id,
            "message": "Marketplace API keys are not configured yet",
            "missing_env": status[marketplace]["missing_env"],
            "payload_preview": _payload_dump(payload),
        }

    return {
        "success": True,
        "published": False,
        "marketplace": marketplace,
        "user_id": current_user.id,
        "message": "API credentials are configured; connector implementation is ready for marketplace-specific mapping",
        "payload_preview": _payload_dump(payload),
    }
