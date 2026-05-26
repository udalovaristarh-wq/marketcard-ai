from __future__ import annotations
import json
import os
from typing import Any
import requests

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"

def _safe_language(language_mode: str) -> str:
    mode = (language_mode or "ru").strip().lower()
    if mode == "uz":
        return "Uzbek latin only"
    if mode in {"ru+uz", "uz+ru", "both"}:
        return "Russian and Uzbek latin without repeating the same meaning"
    return "Russian only"

def _slide_instruction(slide_key: str) -> str:
    mapping = {
        "hero": "Create 1 strong headline, 2 or 3 short selling bullets, and 1 short badge.",
        "benefits": "Create 1 short title and 3 short benefit bullets.",
        "specs": "Create 1 short title and 3 or 4 short specification bullets. Do not invent exact facts unless obvious.",
        "usage": "Create 1 short usage title and 2 or 3 short real-life use bullets.",
        "trust": "Create 1 trust title and 2 or 3 short confidence bullets.",
    }
    return mapping.get(slide_key, "Create 1 short title and 2 or 3 short bullets.")

def _build_prompt(
    *,
    product_title: str,
    brand: str,
    category: str,
    marketplace: str,
    language_mode: str,
    slide_key: str,
) -> str:
    return f"""
You generate short overlay text for a marketplace product card.

Language mode: {_safe_language(language_mode)}
Marketplace: {marketplace}
Product title: {product_title}
Brand: {brand}
Category: {category}
Slide type: {slide_key}

Rules:
- Output valid JSON only.
- Keep text very short and commercially strong.
- No spelling mistakes.
- No gibberish.
- No fake specs unless clearly inferable from product title/category.
- If uncertain, stay generic and safe.
- For bilingual mode: do NOT translate line by line. Use one language in one block and the other language in another block.
- Brand names must be correct or omitted.
- No long sentences.
- No punctuation clutter.

{_slide_instruction(slide_key)}

Return JSON in this exact shape:
{{
  "headline": "string",
  "subheadline": "string",
  "bullets": ["string", "string", "string"],
  "badge": "string"
}}
""".strip()

def build_overlay_copy(
    *,
    product_title: str,
    brand: str,
    category: str,
    marketplace: str,
    language_mode: str,
    slide_key: str,
) -> dict[str, Any]:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set")

    prompt = _build_prompt(
        product_title=product_title,
        brand=brand,
        category=category,
        marketplace=marketplace,
        language_mode=language_mode,
        slide_key=slide_key,
    )

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "gpt-4.1-mini",
        "input": prompt,
        "temperature": 0.2,
        "max_output_tokens": 500,
    }

    response = requests.post(
        OPENAI_RESPONSES_URL,
        headers=headers,
        json=payload,
        timeout=120,
    )
    response.raise_for_status()
    data = response.json()

    text = ""
    for item in data.get("output", []):
        for content in item.get("content", []):
            if content.get("type") == "output_text":
                text += content.get("text", "")

    text = text.strip()

    if text.startswith("`"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:].strip()

    try:
        parsed = json.loads(text)
    except Exception:
        parsed = {
            "headline": product_title or "Товар",
            "subheadline": "",
            "bullets": [],
            "badge": "",
        }

    parsed.setdefault("headline", product_title or "Товар")
    parsed.setdefault("subheadline", "")
    parsed.setdefault("bullets", [])
    parsed.setdefault("badge", "")

    bullets = parsed.get("bullets") or []
    if not isinstance(bullets, list):
        bullets = []
    parsed["bullets"] = [str(x).strip() for x in bullets if str(x).strip()][:4]

    return parsed
