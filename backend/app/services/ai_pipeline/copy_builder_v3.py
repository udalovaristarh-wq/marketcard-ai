from __future__ import annotations
import json
import os
from typing import Any
import requests

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"

def _language_rule(language_mode: str) -> str:
    mode = (language_mode or "ru").strip().lower()
    if mode == "uz":
        return "Uzbek latin only. No Russian."
    if mode in {"ru+uz", "uz+ru", "both"}:
        return "Russian and Uzbek latin. Do not translate line by line. Do not repeat the same meaning."
    return "Russian only."

def _slide_rule(slide_key: str) -> str:
    mapping = {
        "hero": "Create 1 strong headline, 1 short subheadline, 2 or 3 short bullets, and 1 short badge.",
        "benefits": "Create 1 short title, 3 short benefits, and 1 short badge.",
        "specs": "Create 1 short title, 3 or 4 short characteristics, and 1 short badge. Do not invent exact facts.",
        "usage": "Create 1 short usage title, 2 or 3 practical usage bullets, and 1 short badge.",
        "trust": "Create 1 trust title, 2 or 3 confidence bullets, and 1 short badge.",
    }
    return mapping.get(slide_key, "Create 1 short title, 2 or 3 bullets, and 1 short badge.")

def _build_copy_prompt(
    *,
    product_title: str,
    brand: str,
    category: str,
    marketplace: str,
    language_mode: str,
    slide_key: str,
) -> str:
    return f"""
You generate short premium marketplace copy for a product card.

Language:
{_language_rule(language_mode)}

Marketplace:
{marketplace}

Product title:
{product_title}

Brand:
{brand}

Category:
{category}

Slide type:
{slide_key}

Task:
{_slide_rule(slide_key)}

Rules:
- Output valid JSON only.
- No spelling mistakes.
- No gibberish.
- No long sentences.
- Use short, commercially strong phrases.
- Keep wording natural and premium.
- If exact characteristics are uncertain, do not invent precise numbers.
- Brand names must be correct or omitted.
- For bilingual mode: do not duplicate the same meaning in both languages.
- Text must feel like strong marketplace copy, not generic filler.

Return JSON in this exact shape:
{{
  "headline": "string",
  "subheadline": "string",
  "bullets": ["string", "string", "string"],
  "badge": "string"
}}
""".strip()

def build_copy_v3(
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

    prompt = _build_copy_prompt(
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
        "max_output_tokens": 600,
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
