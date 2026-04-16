from __future__ import annotations
import base64
import json
import mimetypes
import os
from pathlib import Path
from typing import Any
import requests

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"

def _guess_mime(path: Path) -> str:
    mime, _ = mimetypes.guess_type(str(path))
    return mime or "image/png"

def _image_to_data_url(image_path: str) -> str:
    p = Path(image_path).resolve()
    if not p.exists():
        raise FileNotFoundError(f"Image not found: {p}")

    mime = _guess_mime(p)
    raw = p.read_bytes()
    b64 = base64.b64encode(raw).decode("utf-8")
    return f"data:{mime};base64,{b64}"

def _safe_slide_rule(slide_key: str) -> str:
    mapping = {
        "hero": "Focus on main headline zone, secondary short subtitle zone, and one small badge zone.",
        "benefits": "Focus on 3 benefit zones around the product without covering the product.",
        "specs": "Focus on clean technical info zones that do not overlap the product body.",
        "usage": "Focus on one headline zone and 2 or 3 supporting text zones.",
        "trust": "Focus on one trust headline zone and 2 supporting short zones.",
    }
    return mapping.get(slide_key, "Find the cleanest text zones around the product.")

def _build_scene_prompt(slide_key: str) -> str:
    return f"""
You are a scene layout analyzer for a marketplace product card.

Task:
Analyze the uploaded product card image and return ONLY valid JSON.

Goal:
Find the product area and find the best clean visual zones for text placement
without covering the product, without breaking composition, and without ruining the design.

Slide rule:
{_safe_slide_rule(slide_key)}

Important rules:
- Return JSON only.
- Do not explain anything.
- Detect the main product bounding box.
- Detect clean zones for:
  - headline
  - subheadline
  - bullets
  - badge
  - footer
- Prefer natural empty or low-detail areas.
- Avoid placing text over the main product.
- Avoid placing text over faces, hands, or important visual highlights.
- If the image already contains decorative shapes or text-like containers, prefer them.
- Coordinates must be relative ratios from 0 to 1.
- Each zone must be a box:
  {{ "x": 0.1, "y": 0.1, "w": 0.3, "h": 0.1 }}

Return JSON in this exact shape:
{{
  "product_box": {{ "x": 0.2, "y": 0.2, "w": 0.5, "h": 0.5 }},
  "zones": {{
    "headline": {{ "x": 0.1, "y": 0.08, "w": 0.5, "h": 0.10 }},
    "subheadline": {{ "x": 0.1, "y": 0.19, "w": 0.4, "h": 0.07 }},
    "bullets": {{ "x": 0.62, "y": 0.28, "w": 0.25, "h": 0.30 }},
    "badge": {{ "x": 0.72, "y": 0.08, "w": 0.16, "h": 0.06 }},
    "footer": {{ "x": 0.15, "y": 0.80, "w": 0.50, "h": 0.09 }}
  }}
}}
""".strip()

def _clamp(v: float) -> float:
    return max(0.0, min(1.0, float(v)))

def _normalize_box(box: dict[str, Any]) -> dict[str, float]:
    return {
        "x": _clamp(box.get("x", 0.1)),
        "y": _clamp(box.get("y", 0.1)),
        "w": _clamp(box.get("w", 0.3)),
        "h": _clamp(box.get("h", 0.1)),
    }

def analyze_scene_layout(image_path: str, slide_key: str) -> dict[str, Any]:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set")

    data_url = _image_to_data_url(image_path)
    prompt = _build_scene_prompt(slide_key)

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "gpt-4.1-mini",
        "input": [
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {"type": "input_image", "image_url": data_url},
                ],
            }
        ],
        "temperature": 0.1,
        "max_output_tokens": 1200,
    }

    response = requests.post(
        OPENAI_RESPONSES_URL,
        headers=headers,
        json=payload,
        timeout=180,
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

    parsed = json.loads(text)

    product_box = _normalize_box(parsed.get("product_box", {}))
    zones_raw = parsed.get("zones", {}) or {}

    zones = {
        "headline": _normalize_box(zones_raw.get("headline", {})),
        "subheadline": _normalize_box(zones_raw.get("subheadline", {})),
        "bullets": _normalize_box(zones_raw.get("bullets", {})),
        "badge": _normalize_box(zones_raw.get("badge", {})),
        "footer": _normalize_box(zones_raw.get("footer", {})),
    }

    return {
        "product_box": product_box,
        "zones": zones,
        "slide_key": slide_key,
    }
