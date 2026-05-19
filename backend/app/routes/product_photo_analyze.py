from __future__ import annotations

import base64
import json
import os
import re

from fastapi import APIRouter, UploadFile, File, HTTPException
from openai import OpenAI

router = APIRouter(tags=["Product Photo Analyze"])

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def _extract_json(text: str) -> dict:
    text = (text or "").strip()
    text = re.sub(r"^
    text = re.sub(r"^
\s*", "", text)
    text = re.sub(r"\s*`$", "", text)
    return json.loads(text)


@router.post("/analyze-product-photo")
async def analyze_product_photo(image: UploadFile = File(...)):
    try:
        image_bytes = await image.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Фото обязательно")

        b64 = base64.b64encode(image_bytes).decode("utf-8")

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Ты анализируешь фото товара для маркетплейса. "
                        "Верни только JSON без markdown: "
                        '{"title":"...","brand":"...","category":"..."} '
                        "Если бренд не виден, brand пустая строка. "
                        "Пиши на русском языке."
                    ),
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{b64}"
                            },
                        }
                    ],
                },
            ],
            temperature=0.2,
        )

        raw = response.choices[0].message.content or "{}"
        data = _extract_json(raw)

        return {
            "success": True,
            "title": str(data.get("title") or ""),
            "brand": str(data.get("brand") or ""),
            "category": str(data.get("category") or ""),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка анализа фото: {e}")
