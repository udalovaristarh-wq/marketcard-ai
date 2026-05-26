from __future__ import annotations

import html
from typing import Any, List

import requests
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/translate", tags=["translate"])


class ListingTranslateRequest(BaseModel):
    title: str = ""
    short_description: str = ""
    full_description: str = ""
    characteristics: List[Any] = []


def clean_text(value: Any) -> str:
    text = str(value or "").strip()
    text = html.unescape(text)
    text = text.replace("&#39;", "'").replace("&quot;", '"').replace("&amp;", "&")
    return text


def split_text(text: str, max_len: int = 450) -> list[str]:
    text = clean_text(text)
    if len(text) <= max_len:
        return [text]

    parts = []
    current = ""

    for piece in text.replace("\n", "\n ").split(". "):
        piece = piece.strip()
        if not piece:
            continue

        if len(current) + len(piece) + 2 <= max_len:
            current = (current + ". " + piece).strip(". ")
        else:
            if current:
                parts.append(current)
            current = piece

    if current:
        parts.append(current)

    return parts


def translate_small(text: Any) -> str:
    value = clean_text(text)
    if not value or value == "—":
        return "—"

    try:
        r = requests.get(
            "https://api.mymemory.translated.net/get",
            params={"q": value, "langpair": "ru|uz"},
            timeout=25,
        )
        data = r.json()
        translated = data.get("responseData", {}).get("translatedText")
        return clean_text(translated or value)
    except Exception:
        return value


def translate_text(text: Any) -> str:
    value = clean_text(text)
    if not value or value == "—":
        return "—"

    chunks = split_text(value)
    translated_chunks = [translate_small(chunk) for chunk in chunks]
    return clean_text("\n\n".join(translated_chunks))


def translate_characteristic(item: Any) -> Any:
    if isinstance(item, dict):
        return {
            "key": translate_small(item.get("key", "")),
            "value": translate_small(item.get("value", "")),
        }

    return translate_small(item)


@router.post("/listing")
def translate_listing(payload: ListingTranslateRequest):
    return {
        "title": translate_small(payload.title),
        "short_description": translate_text(payload.short_description),
        "full_description": translate_text(payload.full_description),
        "characteristics": [
            translate_characteristic(x) for x in payload.characteristics[:5]
        ],
    }
