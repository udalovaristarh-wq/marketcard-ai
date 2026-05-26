from __future__ import annotations

import json
from typing import Any

from openai import OpenAI

from app.services.marketplace_rules import get_marketplace_rules

client = OpenAI()


def normalize_text(value: str) -> str:
    return " ".join(str(value).strip().split())


def trim_to_limit(text: str, limit: int) -> str:
    text = normalize_text(text)
    if len(text) <= limit:
        return text

    trimmed = text[:limit].rstrip(" ,.-")
    return trimmed


def detect_category_type(category: str, title: str) -> str:
    text = f"{category} {title}".lower()

    auto_keys = [
        "auto", "авто", "запчаст", "амортиз", "насос", "датчик",
        "тормоз", "фильтр", "подшип", "стойка", "ремень",
        "spark", "cobalt", "malibu", "tracker", "nexia", "matiz",
        "lacetti", "captiva", "damas", "gentra", "ravon",
    ]
    electronics_keys = [
        "elect", "элект", "науш", "bluetooth", "usb", "кабель",
        "speaker", "headphone", "powerbank", "monitor", "laptop",
        "телефон", "смарт", "мыш", "клав",
    ]
    beauty_keys = [
        "beauty", "космет", "крем", "сыворот", "маска", "уход",
        "парфюм", "шампун", "hair", "skin",
    ]
    home_keys = [
        "home", "дом", "кухн", "посуда", "органайзер", "коврик",
        "подушка", "полка", "контейнер",
    ]
    tools_keys = [
        "tool", "инструм", "дрель", "шурупов", "ключ", "отверт",
        "молоток", "ремонт", "строит",
    ]

    if any(key in text for key in auto_keys):
        return "auto"
    if any(key in text for key in electronics_keys):
        return "electronics"
    if any(key in text for key in beauty_keys):
        return "beauty"
    if any(key in text for key in home_keys):
        return "home"
    if any(key in text for key in tools_keys):
        return "tools"

    return "general"


def get_base_keywords(category_type: str, title: str, brand: str, marketplace: str) -> list[str]:
    common = [normalize_text(title), normalize_text(brand), normalize_text(marketplace)]

    presets = {
        "auto": [
            "автозапчасти",
            "совместимость",
            "надежная замена",
            "долгий срок службы",
            "качество детали",
            "простая установка",
        ],
        "electronics": [
            "электроника",
            "современный дизайн",
            "стабильная работа",
            "комфортное использование",
            "качественный сигнал",
            "удобный формат",
        ],
        "beauty": [
            "уход",
            "качественный состав",
            "комфортное применение",
            "современный продукт",
            "ежедневное использование",
        ],
        "home": [
            "для дома",
            "удобно использовать",
            "практичное решение",
            "современный дизайн",
            "качественные материалы",
        ],
        "tools": [
            "инструменты",
            "надежная конструкция",
            "для работы",
            "прочный материал",
            "удобный хват",
        ],
        "general": [
            "качественный товар",
            "удобно использовать",
            "современный дизайн",
            "практичное решение",
        ],
    }

    result = common + presets.get(category_type, presets["general"])

    cleaned: list[str] = []
    seen: set[str] = set()

    for item in result:
        value = normalize_text(item)
        key = value.lower()
        if not value or key in seen:
            continue
        seen.add(key)
        cleaned.append(value)

    return cleaned


def build_characteristics(category_type: str, title: str, brand: str) -> dict[str, str]:
    base = {
        "Бренд": brand,
        "Название": title,
        "Категория": category_type,
        "Материал": "Качественные материалы",
        "Состояние": "Новый",
    }
    if category_type == "auto":
        base.update(
            {
                "Тип товара": "Автозапчасть",
                "Совместимость": "Уточняется по модели автомобиля",
                "Назначение": "Замена оригинальной детали",
                "Установка": "Стандартная установка",
            }
        )
    elif category_type == "electronics":
        base.update(
            {
                "Тип товара": "Электроника",
                "Подключение": "Стандартное",
                "Назначение": "Повседневное использование",
                "Формат": "Современный",
            }
        )
    elif category_type == "beauty":
        base.update(
            {
                "Тип товара": "Beauty product",
                "Назначение": "Уход и комфорт",
                "Использование": "Регулярное",
                "Формат": "Удобный",
            }
        )
    elif category_type == "home":
        base.update(
            {
                "Тип товара": "Товар для дома",
                "Назначение": "Практичное использование",
                "Формат": "Удобный",
                "Применение": "Повседневное",
            }
        )
    elif category_type == "tools":
        base.update(
            {
                "Тип товара": "Инструмент",
                "Назначение": "Работа и ремонт",
                "Конструкция": "Надежная",
                "Применение": "Практичное",
            }
        )
    else:
        base.update(
            {
                "Тип товара": "Универсальный товар",
                "Назначение": "Повседневное использование",
                "Формат": "Удобный",
                "Качество": "Надежное",
            }
        )

    return base


def build_ru_content(title: str, brand: str, category_type: str, marketplace: str) -> dict[str, Any]:
    improved_title = normalize_text(title)
    if brand and brand.lower() not in improved_title.lower():
        improved_title = f"{improved_title} {brand}"

    seo_title = f"{improved_title} купить для {marketplace} с быстрой доставкой"
    short_description = (
        f"{improved_title} — качественный товар бренда {brand}. "
        f"Подходит для удобного и надежного использования."
    )

    if category_type == "auto":
        full_description = (
            f"{improved_title} — надежная замена оригинальной детали. "
            f"Товар отличается качественным исполнением, точной совместимостью и удобной установкой. "
            f"Подходит для тех, кто ищет стабильную работу, долговечность и уверенное качество. "
            f"Перед покупкой рекомендуется уточнить совместимость с конкретной моделью автомобиля."
        )
    elif category_type == "electronics":
        full_description = (
            f"{improved_title} — современное решение для комфортного ежедневного использования. "
            f"Товар сочетает стабильную работу, качественное исполнение и удобный формат. "
            f"Подходит для пользователей, которым важны надежность, удобство и актуальный дизайн."
        )
    else:
        full_description = (
            f"{improved_title} — качественный товар бренда {brand}, созданный для удобного повседневного использования. "
            f"Сочетает современный подход, практичность и надежное качество. "
            f"Подходит для покупателей, которым важны комфорт, функциональность и аккуратная подача."
        )

    return {
        "title": improved_title,
        "seo_title": seo_title,
        "short_description": short_description,
        "full_description": full_description,
    }


def build_uz_content(title: str, brand: str, category_type: str, marketplace: str) -> dict[str, Any]:
    improved_title = normalize_text(title)
    if brand and brand.lower() not in improved_title.lower():
        improved_title = f"{improved_title} {brand}"

    seo_title = f"{improved_title} {marketplace} uchun qulay va ishonchli tanlov"
    short_description = (
        f"{improved_title} — {brand} brendining sifatli mahsuloti. "
        f"Qulay va ishonchli foydalanish uchun mos."
    )
    if category_type == "auto":
        full_description = (
            f"{improved_title} — original detal o‘rnini bosuvchi ishonchli yechim. "
            f"Mahsulot sifatli ishlab chiqarilgan, qulay o‘rnatiladi va uzoq xizmat qiladi. "
            f"Barqaror ishlash va ishonchli sifat izlayotgan xaridorlar uchun mos."
        )
    elif category_type == "electronics":
        full_description = (
            f"{improved_title} — har kunlik foydalanish uchun zamonaviy va qulay yechim. "
            f"Mahsulot barqaror ishlash, sifatli bajarilish va qulay formatni birlashtiradi. "
            f"Ishonchlilik va qulaylik muhim bo‘lgan foydalanuvchilar uchun mos."
        )
    else:
        full_description = (
            f"{improved_title} — {brand} brendining sifatli mahsuloti bo‘lib, kundalik foydalanishda qulaylik yaratadi. "
            f"Amaliylik, zamonaviy ko‘rinish va ishonchli sifatni birlashtiradi."
        )

    return {
        "title": improved_title,
        "seo_title": seo_title,
        "short_description": short_description,
        "full_description": full_description,
    }


def build_en_content(title: str, brand: str, category_type: str, marketplace: str) -> dict[str, Any]:
    improved_title = normalize_text(title)
    if brand and brand.lower() not in improved_title.lower():
        improved_title = f"{improved_title} {brand}"

    seo_title = f"{improved_title} buy online for {marketplace}"
    short_description = (
        f"{improved_title} is a quality product by {brand}, designed for reliable and practical everyday use."
    )

    if category_type == "auto":
        full_description = (
            f"{improved_title} is a reliable replacement part designed for stable performance and long service life. "
            f"It offers solid build quality, practical installation, and dependable use for customers who need confidence and consistency."
        )
    elif category_type == "electronics":
        full_description = (
            f"{improved_title} is a modern product built for comfortable everyday use. "
            f"It combines stable performance, practical design, and a clean user-friendly format."
        )
    else:
        full_description = (
            f"{improved_title} is a quality product by {brand}, created for practical everyday use. "
            f"It combines convenience, clean design, and dependable quality."
        )

    return {
        "title": improved_title,
        "seo_title": seo_title,
        "short_description": short_description,
        "full_description": full_description,
    }


def limit_characteristics(characteristics: dict[str, str], max_count: int) -> dict[str, str]:
    result: dict[str, str] = {}
    for idx, (key, value) in enumerate(characteristics.items()):
        if idx >= max_count:
            break
        result[normalize_text(key)] = normalize_text(value)
    return result


def limit_keywords(keywords: list[str], max_count: int) -> list[str]:
    return keywords[:max_count]


def apply_marketplace_limits(content: dict[str, Any], marketplace: str) -> dict[str, Any]:
    rules = get_marketplace_rules(marketplace)

    return {
        "title": trim_to_limit(content["title"], rules["title_max"]),
        "seo_title": trim_to_limit(content["seo_title"], rules["seo_title_max"]),
        "short_description": trim_to_limit(
            content["short_description"],
            rules["short_description_max"],
        ),
        "full_description": trim_to_limit(
            content["full_description"],
            rules["full_description_max"],
        ),
        "characteristics": limit_characteristics(
            content["characteristics"],
            rules["characteristics_max"],
        ),
        "keywords": limit_keywords(
            content["keywords"],
            rules["keywords_max"],
        ),
    }


def generate_ai_content(title: str, brand: str, category: str, marketplace: str) -> dict[str, Any] | None:
    prompt = f"""
Ты топовый маркетолог маркетплейсов: Uzum, Wildberries, Ozon, Yandex Market.Твоя задача — сгенерировать продающий контент для товара.

ДАННЫЕ:
Название товара: {title}
Бренд: {brand}
Категория: {category}
Маркетплейс: {marketplace}

Сделай:

1. SEO:
- product_title
- seo_title
- short_description
- full_description
- characteristics (массив из 4-8 пунктов)
- keywords (массив из 6-12 пунктов)

2. Структуру для серии инфографики:
slides = массив из 5 слайдов

Для каждого slide:
- type (hero / benefits / specs / usage / trust)
- headline
- subheadline
- bullets (3-5 коротких пунктов)

ТРЕБОВАНИЯ:
- пиши коротко
- пиши продающе
- без воды
- без лишней болтовни
- подход под маркетплейс
- возвращай только JSON
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Ты эксперт по маркетплейсам, SEO и продающей инфографике."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
        )

        text = response.choices[0].message.content or ""

        start = text.find("{")
        end = text.rfind("}") + 1
        if start == -1 or end <= 0:
            return None

        return json.loads(text[start:end])

    except Exception as e:
        print("❌ AI LISTING ERROR:", e)
        return None


def generate_listing_content(
    title: str,
    brand: str,
    category: str,
    marketplace: str,
) -> dict[str, Any]:
    ai_data = generate_ai_content(title, brand, category, marketplace)

    if ai_data:
        return {
            "marketplace": marketplace,
            "category_type": detect_category_type(category, title),
            "ai": True,
            "data": ai_data,
        }

    clean_title = normalize_text(title)
    clean_brand = normalize_text(brand)
    clean_category = normalize_text(category)
    category_type = detect_category_type(clean_category, clean_title)

    ru = build_ru_content(clean_title, clean_brand, category_type, marketplace)
    uz = build_uz_content(clean_title, clean_brand, category_type, marketplace)
    en = build_en_content(clean_title, clean_brand, category_type, marketplace)

    base_characteristics = build_characteristics(category_type, clean_title, clean_brand)
    base_keywords = get_base_keywords(category_type, clean_title, clean_brand, marketplace)

    ru["characteristics"] = base_characteristics
    ru["keywords"] = base_keywords

    uz["characteristics"] = {
        "Brend": clean_brand,
        "Nomi": clean_title,
        "Kategoriya": category_type,
        "Holati": "Yangi",
        "Sifat": "Ishonchli",
    }
    uz["keywords"] = base_keywords

    en["characteristics"] = {
        "Brand": clean_brand,
        "Title": clean_title,
        "Category": category_type,
        "Condition": "New",
        "Quality": "Reliable",
    }
    en["keywords"] = base_keywords

    return {
        "marketplace": marketplace,
        "category_type": category_type,
        "ai": False,
        "ru": apply_marketplace_limits(ru, marketplace),
        "uz": apply_marketplace_limits(uz, marketplace),
        "en": apply_marketplace_limits(en, marketplace),
    }