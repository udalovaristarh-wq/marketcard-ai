from __future__ import annotations

from typing import Any


def _normalize_category(category: str) -> str:
    value = (category or "").strip().lower()

    electronics_keys = [
        "элект", "гаджет", "смартфон", "ноут", "планшет", "науш", "колон",
        "телев", "power bank", "smart", "watch", "bluetooth", "кабель",
        "мыш", "клав", "роутер", "монитор", "ssd", "hdd", "принтер",
    ]
    auto_keys = [
        "авто", "запчаст", "масло", "фильтр", "колод", "свеч", "грм",
        "амортиз", "аккум", "регистратор", "антирадар", "магнитол",
        "парктрон", "антифриз", "омывател", "чехол", "коврик",
    ]
    fashion_keys = [
        "одеж", "обув", "кроссов", "футбол", "худи", "джинс", "плать",
        "рубаш", "куртк", "сумк", "рюкзак", "ремень", "очки", "кошел",
        "бижут", "ювелир", "аксессуар",
    ]
    beauty_keys = [
        "космет", "крем", "сывор", "шампун", "парфюм", "духи", "маска",
        "помад", "туш", "лосьон", "дезодорант", "гигиен", "брить",
    ]
    home_keys = [
        "дом", "кух", "сковор", "кастрю", "тарел", "чаш", "нож", "текстиль",
        "подуш", "одеял", "полотен", "плед", "светиль", "декор", "ваза",
        "свеч", "вешал", "короб", "корзин", "хозтовар", "утюг", "пылесос",
        "чайник", "блендер", "гриль", "тостер", "микровол",
    ]
    books_keys = [
        "книг", "канц", "тетрад", "ручк", "карандаш", "маркер", "ежедневник",
        "учеб", "атлас", "словар", "творч", "холст", "краск", "пластилин",
    ]
    kids_keys = [
        "дет", "игруш", "lego", "конструктор", "кукл", "машинк", "пазл",
        "подгуз", "салфет", "пустыш", "коляск", "автокрес", "самокат", "велосипед",
    ]
    tools_keys = [
        "стро", "ремонт", "дрель", "шурупов", "ключ", "рулетк", "смесител",
        "лейк", "розет", "выключ", "лампоч", "удлин", "сад", "газон", "секатор",
        "шланг", "инструмент",
    ]
    sports_keys = [
        "спорт", "туризм", "йога", "гантел", "эспандер", "палатк", "спальн",
        "термос", "фонар", "коврик", "отдых",
    ]
    food_keys = [
        "еда", "продукт", "сладост", "чай", "кофе", "бакале", "макарон",
        "круп", "консерв", "зоотовар", "корм", "наполнитель", "ошейник",
    ]

    mapping = [
        ("electronics", electronics_keys),
        ("auto", auto_keys),
        ("fashion", fashion_keys),
        ("beauty", beauty_keys),
        ("home", home_keys),
        ("books", books_keys),
        ("kids", kids_keys),
        ("tools", tools_keys),
        ("sports", sports_keys),
        ("food", food_keys),
    ]

    for normalized, keys in mapping:
        if any(key in value for key in keys):
            return normalized

    return "general"


def _marketplace_size(marketplace: str) -> dict[str, Any]:
    mp = (marketplace or "").strip().lower()

    profiles = {
        "uzum": {"width": 1080, "height": 1440, "ratio": "3:4"},
        "wildberries": {"width": 900, "height": 1200, "ratio": "3:4"},
        "ozon": {"width": 1200, "height": 1600, "ratio": "3:4"},
        "yandex": {"width": 1000, "height": 1000, "ratio": "1:1"},
    }

    return profiles.get(mp, profiles["uzum"])


def _base_scene_tags(category_type: str) -> list[str]:
    mapping = {
        "electronics": ["premium tech", "modern glow", "dynamic marketplace design"],
        "auto": ["industrial premium", "performance mood", "strong contrast"],
        "fashion": ["editorial premium", "clean stylish", "brand-focused"],
        "beauty": ["clean luxury", "soft premium light", "delicate commercial design"],
        "home": ["cozy premium", "warm ambient", "modern home aesthetic"],
        "books": ["editorial clean", "intellectual premium", "minimal commercial look"],
        "kids": ["bright playful", "friendly premium", "clean colorful"],
        "tools": ["industrial clean", "strong utility design", "bold practical"],"sports": ["energetic sport style", "motion design", "high impact"],
        "food": ["fresh commercial", "appetizing premium", "clean product focus"],
        "general": ["premium marketplace", "commercial design", "high contrast"],
    }
    return mapping.get(category_type, mapping["general"])


def _slide_blueprints(category_type: str) -> list[dict[str, Any]]:
    common = [
        {
            "key": "hero",
            "goal": "main selling cover",
            "text_mode": "headline_plus_3_benefits",
            "visual_mode": "hero_product_focus",
        },
        {
            "key": "benefits",
            "goal": "show key advantages",
            "text_mode": "3_or_4_benefits",
            "visual_mode": "benefit_infographic",
        },
        {
            "key": "specs",
            "goal": "show important characteristics",
            "text_mode": "specs_grid",
            "visual_mode": "clean_tech_specs",
        },
        {
            "key": "usage",
            "goal": "show how product is used",
            "text_mode": "scenario_copy",
            "visual_mode": "lifestyle_or_usage_scene",
        },
        {
            "key": "trust",
            "goal": "final trust / compatibility / result slide",
            "text_mode": "closing_confidence",
            "visual_mode": "premium_closing_slide",
        },
    ]

    if category_type == "auto":
        common[3] = {
            "key": "usage",
            "goal": "show installation / usage / practical context",
            "text_mode": "practical_usage",
            "visual_mode": "garage_or_auto_context",
        }
        common[4] = {
            "key": "trust",
            "goal": "show compatibility / reliability / quality confidence",
            "text_mode": "compatibility_or_quality",
            "visual_mode": "compatibility_infographic",
        }

    elif category_type == "fashion":
        common[2] = {
            "key": "specs",
            "goal": "show material / fit / details",
            "text_mode": "material_and_fit",
            "visual_mode": "detail_fashion_infographic",
        }
        common[3] = {
            "key": "usage",
            "goal": "show style scenario / look / wearing context",
            "text_mode": "style_usage",
            "visual_mode": "lifestyle_fashion_scene",
        }

    elif category_type == "beauty":
        common[3] = {
            "key": "usage",
            "goal": "show effect / routine / use result",
            "text_mode": "beauty_usage",
            "visual_mode": "clean_beauty_scene",
        }

    elif category_type == "home":
        common[3] = {
            "key": "usage",
            "goal": "show interior / comfort / household scenario",
            "text_mode": "home_usage",
            "visual_mode": "interior_lifestyle_scene",
        }

    elif category_type == "books":
        common[1] = {
            "key": "benefits",
            "goal": "show value of the book / why it is useful",
            "text_mode": "reading_benefits",
            "visual_mode": "editorial_infographic",
        }
        common[3] = {
            "key": "usage",
            "goal": "show reading context / audience / purpose",
            "text_mode": "reader_scenario",
            "visual_mode": "editorial_lifestyle_scene",
        }

    elif category_type == "sports":
        common[3] = {
            "key": "usage",
            "goal": "show sport / active lifestyle context",
            "text_mode": "active_usage",
            "visual_mode": "sport_action_scene",
        }

    return common


def build_series_plan(
    product_title: str,
    category: str,
    marketplace: str,
    language_mode: str,
    variant_count: int = 5,
) -> dict[str, Any]:
    category_type = _normalize_category(category)
    marketplace_profile = _marketplace_size(marketplace)
    scene_tags = _base_scene_tags(category_type)
    blueprints = _slide_blueprints(category_type)

    max_variants = max(1, min(int(variant_count), 5))
    slides = blueprints[:max_variants]
    return {
        "product_title": product_title or "Товар",
        "category": category or "",
        "category_type": category_type,
        "marketplace": marketplace or "uzum",
        "language_mode": language_mode or "ru",
        "marketplace_profile": marketplace_profile,
        "scene_tags": scene_tags,
        "slides": slides,
    }