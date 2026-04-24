from __future__ import annotations

import requests
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/translate", tags=["translate"])


class ListingTranslateRequest(BaseModel):
    title: str = ""
    short_description: str = ""
    full_description: str = ""
    characteristics: List[str] = []


def translate_text(text: str) -> str:
    value = (text or "").strip()
    if not value or value == "—":
        return "—"

    try:
        r = requests.get(
            "https://api.mymemory.translated.net/get",
            params={"q": value, "langpair": "ru|uz"},
            timeout=20,
        )
        data = r.json()
        translated = data.get("responseData", {}).get("translatedText")
        return translated or value
    except Exception:
        return value


@router.post("/listing")
def translate_listing(payload: ListingTranslateRequest):
    return {
        "title": translate_text(payload.title),
        "short_description": translate_text(payload.short_description),
        "full_description": translate_text(payload.full_description),
        "characteristics": [translate_text(x) for x in payload.characteristics[:5]],
    }
