from __future__ import annotations

import json
import os
import re
from typing import Dict, Any, List

import requests


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"


def clean(text: str) -> str:
    return " ".join((text or "").strip().split())


def normalize_spaces(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip()


def trim_to_limit(text: str, max_len: int) -> str:
    value = normalize_spaces(text)
    if len(value) <= max_len:
        return value

    trimmed = value[:max_len].rstrip(" ,.;:-")
    last_space = trimmed.rfind(" ")
    if last_space > max_len * 0.6:
        trimmed = trimmed[:last_space].rstrip(" ,.;:-")
    return trimmed


def detect_category_type(category: str) -> str:
    c = clean(category).lower()

    if any(x in c for x in ["авто", "запчаст", "масло", "фильтр", "рул", "амортиз", "тормоз"]):
        return "auto"

    if any(x in c for x in ["смарт", "науш", "электро", "watch", "часы", "телефон", "заряд"]):
        return "electronics"

    if any(x in c for x in ["космет", "крем", "сыворот", "маска", "маникюр", "педикюр"]):
        return "beauty"

    if any(x in c for x in ["одеж", "обув", "сумка"]):
        return "fashion"

    return "general"


def build_characteristics(brand: str, category: str, marketplace: str) -> List[Dict[str, str]]:
    category_type = detect_category_type(category)

    items = [
        {"key": "Бренд", "value": brand or "—"},
        {"key": "Категория", "value": category or "—"},
        {"key": "Состояние", "value": "Новый"},
    ]

    if category_type == "auto":
        items.extend(
            [
                {"key": "Тип товара", "value": "Автозапчасть"},
                {"key": "Совместимость", "value": "Уточняется по модели автомобиля"},
            ]
        )
    elif category_type == "electronics":
        items.extend(
            [
                {"key": "Тип товара", "value": "Электроника"},
                {"key": "Назначение", "value": "Для дома, работы и повседневных задач"},
            ]
        )
    elif category_type == "beauty":
        items.extend(
            [
                {"key": "Тип товара", "value": "Товар для маникюра и ухода"},
                {"key": "Назначение", "value": "Для домашнего и профессионального применения"},
            ]
        )
    else:
        items.extend(
            [
                {"key": "Тип товара", "value": "Практичный товар"},
                {"key": "Назначение", "value": "По назначению товара"},
            ]
        )

    if marketplace.lower() == "yandex":
        items.append({"key": "Вес и габариты", "value": "Требует заполнения продавцом"})

    return items


def _extract_output_text(payload: dict[str, Any]) -> str:
    if payload.get("output_text"):
        return str(payload["output_text"]).strip()

    output = payload.get("output") or []
    parts: list[str] = []

    for item in output:
        content = item.get("content") or []
        for block in content:
            if block.get("type") == "output_text" and block.get("text"):
                parts.append(block["text"])

    return "\n".join(parts).strip()


def _parse_json_text(text: str) -> Dict[str, Any]:
    raw = (text or "").strip()

    raw = re.sub(r"^`json\s*", "", raw, flags=re.IGNORECASE)
    raw = re.sub(r"^\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    data = json.loads(raw)

    title = trim_to_limit(clean(str(data.get("title", ""))), 90)
    seo_title = trim_to_limit(clean(str(data.get("seo_title", ""))), 120)
    short_description = normalize_spaces(str(data.get("short_description", "")))
    full_description = str(data.get("full_description", "")).strip()

    keywords = data.get("keywords", [])
    if isinstance(keywords, str):
        keywords = [clean(x) for x in keywords.split(",") if clean(x)]
    elif isinstance(keywords, list):
        keywords = [clean(str(x)) for x in keywords if clean(str(x))]
    else:
        keywords = []
    return {
        "title": title,
        "seo_title": seo_title or title,
        "short_description": short_description,
        "full_description": full_description,
        "keywords": keywords,
    }


def _build_prompt(
    product_title: str,
    brand: str,
    category: str,
    marketplace: str,
) -> str:
    return f"""
Ты сильный маркетолог и SEO-специалист маркетплейсов Uzum, Wildberries, Ozon и Yandex Market.

Создай мощный продающий SEO-текст на русском языке.

Данные:
- Название товара: {product_title}
- Бренд: {brand}
- Категория: {category}
- Маркетплейс: {marketplace}

Верни результат строго в JSON-формате с такими ключами:
title
seo_title
short_description
full_description
keywords

Требования:

1. title
- до 90 символов
- максимально продающее название
- с сильными ключевыми словами
- без мусора и без воды
- должно выглядеть как топовое название карточки товара

2. seo_title
- может быть равен title или быть чуть усиленной версией
- без спама
- без кринж-фраз

3. short_description
- 2–3 сильных предложения
- конкретная польза товара
- без шаблонных фраз:
  "для повседневного использования"
  "надежный товар"
  "товар общего назначения"
  "относится к категории"
  "практичное решение"
  "универсальный товар"

4. full_description
- 3000–4000 символов
- разбить на абзацы
- писать как сильный продавец маркетплейса
- раскрыть:
  • что это за товар
  • в чем его реальные преимущества
  • кому подходит
  • где используется
  • почему его стоит купить
  • что получает покупатель
- без тупых повторов
- без канцелярщины
- без сухих шаблонов

5. keywords
- массив из 10–20 ключевых слов или фраз
- только реальные полезные поисковые запросы

Очень важно:
- не выдумывай технические характеристики, если их нет во входных данных
- не пиши пояснений вне JSON
- ответ должен быть только валидным JSON
""".strip()


def _call_openai_for_listing(
    product_title: str,
    brand: str,
    category: str,
    marketplace: str,
) -> Dict[str, Any]:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set")

    prompt = _build_prompt(
        product_title=product_title,
        brand=brand,
        category=category,
        marketplace=marketplace,
    )

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    data = {
        "model": "gpt-5.4",
        "input": [
            {
                "role": "developer",
                "content": [
                    {
                        "type": "input_text",
                        "text": "Ты создаешь только сильные продающие SEO-тексты для маркетплейсов и отвечаешь только валидным JSON."
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": prompt
                    }
                ],
            },
        ],
        "text": {
            "format": {
                "type": "json_object"
            }
        },
    }

    response = requests.post(
        OPENAI_RESPONSES_URL,
        headers=headers,
        json=data,
        timeout=180,
    )

    if response.status_code != 200:
        print("OPENAI SEO STATUS:", response.status_code)
        print("OPENAI SEO RESPONSE:", response.text)
        raise RuntimeError(f"SEO generation error {response.status_code}: {response.text[:1000]}")

    payload = response.json()
    text = _extract_output_text(payload)
    if not text:
        raise RuntimeError("OpenAI returned empty SEO text")

    parsed = _parse_json_text(text)
    parsed["_openai_meta"] = {
        "provider": "openai",
        "model": data.get("model"),
        "response_id": payload.get("id"),
        "usage": payload.get("usage", {}),
    }

    return parsed



def generate_listing(
    product_title: str,
    brand: str,
    category: str,
    marketplace: str = "uzum",
    language: str = "ru",
) -> Dict[str, Any]:
    product_title = clean(product_title)
    brand = clean(brand)
    category = clean(category)
    marketplace = clean(marketplace).lower() or "uzum"
    parsed = _call_openai_for_listing(
        product_title=product_title,
        brand=brand,
        category=category,
        marketplace=marketplace,
    )

    characteristics = build_characteristics(brand, category, marketplace)

    return {
        "marketplace": marketplace,
        "title": parsed["title"],
        "raw_title": product_title,
        "seo_title": parsed["seo_title"],
        "short_description": parsed["short_description"],
        "full_description": parsed["full_description"],
        "characteristics": characteristics,
        "keywords": parsed["keywords"],
        "_openai_meta": parsed.get("_openai_meta"),
        "variants": [],
        "style": "ai_generated",
        "limits": {
            "title_max": 90,
            "short_max": 600,
            "full_max": 10000,
        },
        "lengths": {
            "title": len(parsed["title"]),
            "seo_title": len(parsed["seo_title"]),
            "short_description": len(parsed["short_description"]),
            "full_description": len(parsed["full_description"]),
        },
    }
