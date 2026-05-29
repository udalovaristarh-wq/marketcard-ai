from __future__ import annotations

import base64
import json
import os
import re

from fastapi import APIRouter, File, HTTPException, UploadFile
from openai import OpenAI

router = APIRouter(tags=["Product Photo Analyze"])

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def _extract_json(text: str) -> dict:
    text = (text or "").strip()
    text = re.sub(r"^```(?:json)?", "", text, flags=re.IGNORECASE).strip()
    text = re.sub(r"```$", "", text).strip()
    return json.loads(text or "{}")


def _as_list(value) -> list[str]:
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    if isinstance(value, dict):
        return [
            f"{str(key).strip()}: {str(item).strip()}"
            for key, item in value.items()
            if str(key).strip() and str(item).strip()
        ]
    if isinstance(value, str):
        return [
            item.strip(" -•\t")
            for item in re.split(r"[\n;,]+", value)
            if item.strip(" -•\t")
        ]
    return []


@router.post("/analyze-product-photo")
async def analyze_product_photo(image: UploadFile = File(...)):
    try:
        image_bytes = await image.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Фото обязательно")

        b64 = base64.b64encode(image_bytes).decode("utf-8")
        content_type = image.content_type or "image/png"

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Ты AI-мерчандайзер MarketCard AI. Проанализируй фото товара "
                        "для карточки маркетплейса. Верни только валидный JSON без markdown. "
                        "Не выдумывай точные цифры, объемы, материалы или совместимость, если их не видно. "
                        "Пиши на русском языке. Формат: "
                        "{\"title\":\"короткое название товара\","
                        "\"brand\":\"видимый бренд или пустая строка\","
                        "\"category\":\"категория товара\","
                        "\"characteristics\":[\"3-6 визуально определимых характеристик\"],"
                        "\"short_description\":\"1 короткое продающее описание\","
                        "\"confidence\":0.0}"
                    ),
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{content_type};base64,{b64}"
                            },
                        }
                    ],
                },
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content or "{}"
        data = _extract_json(raw)
        characteristics = _as_list(data.get("characteristics"))[:8]

        return {
            "success": True,
            "title": str(data.get("title") or ""),
            "brand": str(data.get("brand") or ""),
            "category": str(data.get("category") or ""),
            "characteristics": characteristics,
            "short_description": str(data.get("short_description") or ""),
            "confidence": float(data.get("confidence") or 0),
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка анализа фото: {exc}",
        )
