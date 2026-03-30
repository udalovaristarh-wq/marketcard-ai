from __future__ import annotations

from typing import Any, Dict, List


CATEGORY_RULES: Dict[str, Dict[str, Any]] = {
    "electronics_audio": {
        "keywords": [
            "науш", "earbuds", "headset", "гарнитур", "колонк", "speaker",
            "soundbar", "микрофон", "audio", "bluetooth",
        ],
        "family": "electronics",
        "scene_style": "tech_energy",
        "needs_lifestyle": True,
        "needs_human": True,
        "preferred_human_scene": "sport_or_city",
        "icon_pack": "electronics_audio",
        "hero_layout": "hero_center_large",
        "benefits_layout": "left_text_right_product",
        "specs_layout": "tech_specs_grid",
        "usage_layout": "lifestyle_right_text",
        "trust_layout": "offer_bar",
        "product_scale": 0.92,
        "text_density": "medium",
    },
    "electronics_smartwatch": {
        "keywords": [
            "watch", "smartwatch", "смарт", "часы", "браслет", "watch c",
        ],
        "family": "electronics",
        "scene_style": "tech_premium",
        "needs_lifestyle": False,
        "needs_human": False,
        "preferred_human_scene": None,
        "icon_pack": "electronics_watch",
        "hero_layout": "hero_center_large",
        "benefits_layout": "left_text_right_product",
        "specs_layout": "tech_specs_grid",
        "usage_layout": "feature_chips",
        "trust_layout": "offer_bar",
        "product_scale": 0.88,
        "text_density": "medium",
    },
    "electronics_phone": {
        "keywords": [
            "смартфон", "телефон", "iphone", "android", "phone", "tablet",
            "планшет", "power bank", "powerbank", "кабель", "charger",
        ],
        "family": "electronics",
        "scene_style": "tech_clean",
        "needs_lifestyle": False,
        "needs_human": False,
        "preferred_human_scene": None,
        "icon_pack": "electronics_mobile",
        "hero_layout": "hero_center_large",
        "benefits_layout": "right_product_left_cards",
        "specs_layout": "tech_specs_grid",
        "usage_layout": "compatibility_split",
        "trust_layout": "offer_bar",
        "product_scale": 0.9,
        "text_density": "medium",
    },
    "electronics_computer": {
        "keywords": [
            "ноутбук", "laptop", "monitor", "монитор", "клавиатур", "мыш",
            "router", "роутер", "ssd", "hdd", "printer", "принтер",
        ],
        "family": "electronics",
        "scene_style": "tech_premium",
        "needs_lifestyle": False,
        "needs_human": False,
        "preferred_human_scene": None,
        "icon_pack": "electronics_computer",
        "hero_layout": "hero_wide_product",
        "benefits_layout": "left_text_right_product",
        "specs_layout": "spec_table_clean",
        "usage_layout": "workspace_scene",
        "trust_layout": "offer_bar",
        "product_scale": 0.86,
        "text_density": "medium",
    },
    "electronics_home_appliance": {
        "keywords": [
            "пылесос", "утюг", "отпарив", "чайник", "кофевар", "блендер",
            "микроволнов", "тостер", "гриль", "стираль", "холодильник",
            "кондиционер", "вентилятор", "увлажнитель", "обогреватель",
        ],
        "family": "electronics",
        "scene_style": "clean_premium_home",
        "needs_lifestyle": True,
        "needs_human": False,
        "preferred_human_scene": "home",
        "icon_pack": "home_appliance",
        "hero_layout": "hero_large_right",
        "benefits_layout": "left_cards_product_right",
        "specs_layout": "spec_table_clean",
        "usage_layout": "interior_scene",
        "trust_layout": "offer_bar",
        "product_scale": 0.84,
        "text_density": "medium",
    },
    "auto_parts": {
        "keywords": [
            "фильтр", "колодк", "амортиз", "датчик", "подшип", "свеч","grm", "грм", "масло", "антифриз", "радиатор", "тормозн",
            "стойк", "шрус", "насос", "рулевая", "авто", "запчаст",
        ],
        "family": "auto",
        "scene_style": "auto_performance",
        "needs_lifestyle": False,
        "needs_human": False,
        "preferred_human_scene": None,
        "icon_pack": "auto_tech",
        "hero_layout": "hero_technical",
        "benefits_layout": "spec_badges_left",
        "specs_layout": "tech_specs_grid",
        "usage_layout": "compatibility_split",
        "trust_layout": "offer_bar",
        "product_scale": 0.9,
        "text_density": "medium",
    },
    "auto_accessories": {
        "keywords": [
            "видеорегистратор", "магнитол", "парктроник", "коврик",
            "чехол", "органайзер", "держатель", "автошампун", "полироль",
        ],
        "family": "auto",
        "scene_style": "auto_modern",
        "needs_lifestyle": True,
        "needs_human": False,
        "preferred_human_scene": "car_interior",
        "icon_pack": "auto_accessories",
        "hero_layout": "hero_large_right",
        "benefits_layout": "left_text_right_product",
        "specs_layout": "spec_table_clean",
        "usage_layout": "interior_scene",
        "trust_layout": "offer_bar",
        "product_scale": 0.88,
        "text_density": "medium",
    },
    "fashion": {
        "keywords": [
            "футболк", "худи", "джинс", "плать", "рубаш", "куртк", "кроссов",
            "ботин", "сумк", "рюкзак", "ремень", "очки", "кошелек",
        ],
        "family": "fashion",
        "scene_style": "fashion_editorial",
        "needs_lifestyle": True,
        "needs_human": True,
        "preferred_human_scene": "studio_or_street",
        "icon_pack": "fashion",
        "hero_layout": "hero_editorial",
        "benefits_layout": "fashion_cards",
        "specs_layout": "spec_table_clean",
        "usage_layout": "lifestyle_scene_full",
        "trust_layout": "offer_bar",
        "product_scale": 0.86,
        "text_density": "low",
    },
    "beauty": {
        "keywords": [
            "крем", "сыворот", "шампун", "бальзам", "маска", "духи", "парфюм",
            "помад", "туш", "лосьон", "дезодорант", "масло для волос",
        ],
        "family": "beauty",
        "scene_style": "beauty_clean",
        "needs_lifestyle": False,
        "needs_human": False,
        "preferred_human_scene": None,
        "icon_pack": "beauty",
        "hero_layout": "hero_clean_product",
        "benefits_layout": "beauty_cards",
        "specs_layout": "spec_table_clean",
        "usage_layout": "ingredient_focus",
        "trust_layout": "offer_bar",
        "product_scale": 0.82,
        "text_density": "low",
    },
    "home_textile": {
        "keywords": [
            "подушк", "одеял", "плед", "матрас", "постель", "полотенц",
            "текстиль", "наволочк",
        ],
        "family": "home",
        "scene_style": "cozy_home",
        "needs_lifestyle": True,
        "needs_human": False,
        "preferred_human_scene": "bedroom",
        "icon_pack": "home_textile",
        "hero_layout": "hero_large_right",
        "benefits_layout": "soft_cards",
        "specs_layout": "spec_table_clean",
        "usage_layout": "interior_scene",
        "trust_layout": "offer_bar",
        "product_scale": 0.9,
        "text_density": "low",
    },
    "home_kitchen": {
        "keywords": [
            "тарелк", "чашк", "нож", "кастрюл", "сковород", "форма для запекания",
            "посуда", "ложк", "вилк",
        ],
        "family": "home",
        "scene_style": "kitchen_modern",
        "needs_lifestyle": True,
        "needs_human": False,
        "preferred_human_scene": "kitchen",
        "icon_pack": "kitchen",
        "hero_layout": "hero_large_right","benefits_layout": "left_cards_product_right",
        "specs_layout": "spec_table_clean",
        "usage_layout": "interior_scene",
        "trust_layout": "offer_bar",
        "product_scale": 0.86,
        "text_density": "low",
    },
    "home_decor": {
        "keywords": [
            "светильник", "лампа", "ваза", "картина", "декор", "часы настенные",
            "свеча",
        ],
        "family": "home",
        "scene_style": "decor_ambient",
        "needs_lifestyle": True,
        "needs_human": False,
        "preferred_human_scene": "interior",
        "icon_pack": "decor",
        "hero_layout": "hero_large_right",
        "benefits_layout": "soft_cards",
        "specs_layout": "spec_table_clean",
        "usage_layout": "interior_scene",
        "trust_layout": "offer_bar",
        "product_scale": 0.84,
        "text_density": "low",
    },
    "books": {
        "keywords": [
            "книга", "ежедневник", "тетрад", "учебник", "атлас", "словарь",
            "блокнот", "ручка", "карандаш", "канцеляр",
        ],
        "family": "books",
        "scene_style": "editorial_book",
        "needs_lifestyle": True,
        "needs_human": False,
        "preferred_human_scene": "desk",
        "icon_pack": "books",
        "hero_layout": "hero_clean_product",
        "benefits_layout": "left_cards_product_right",
        "specs_layout": "spec_table_clean",
        "usage_layout": "desk_scene",
        "trust_layout": "offer_bar",
        "product_scale": 0.82,
        "text_density": "low",
    },
    "kids": {
        "keywords": [
            "игрушк", "конструктор", "lego", "кукл", "машинк", "пазл",
            "подгузник", "салфетк", "коляск", "самокат", "велосипед",
        ],
        "family": "kids",
        "scene_style": "kids_bright",
        "needs_lifestyle": False,
        "needs_human": False,
        "preferred_human_scene": None,
        "icon_pack": "kids",
        "hero_layout": "hero_fun",
        "benefits_layout": "kids_cards",
        "specs_layout": "spec_table_clean",
        "usage_layout": "play_scene",
        "trust_layout": "offer_bar",
        "product_scale": 0.88,
        "text_density": "medium",
    },
    "tools": {
        "keywords": [
            "дрель", "шуруповерт", "ключ", "рулетк", "смеситель", "розетк",
            "выключатель", "лампочк", "шланг", "секатор", "инструмент",
        ],
        "family": "tools",
        "scene_style": "industrial_clean",
        "needs_lifestyle": False,
        "needs_human": False,
        "preferred_human_scene": None,
        "icon_pack": "tools",
        "hero_layout": "hero_technical",
        "benefits_layout": "spec_badges_left",
        "specs_layout": "tech_specs_grid",
        "usage_layout": "compatibility_split",
        "trust_layout": "offer_bar",
        "product_scale": 0.88,
        "text_density": "medium",
    },
    "sports": {
        "keywords": [
            "гантел", "йог", "эспандер", "палатк", "термос", "фонарь",
            "туризм", "спорт", "коврик", "фитнес",
        ],
        "family": "sports",
        "scene_style": "sport_dynamic",
        "needs_lifestyle": True,
        "needs_human": True,
        "preferred_human_scene": "motion",
        "icon_pack": "sports",
        "hero_layout": "hero_editorial",
        "benefits_layout": "left_text_right_product",
        "specs_layout": "spec_table_clean",
        "usage_layout": "lifestyle_scene_full",
        "trust_layout": "offer_bar",
        "product_scale": 0.88,
        "text_density": "medium",
    },
    "food_pet": {
        "keywords": [
            "чай", "кофе", "сладост", "круп", "макарон", "консерв",
            "корм", "кошк", "собак", "ошейник", "наполнитель",
        ],
        "family": "food_pet",
        "scene_style": "clean_packshot","needs_lifestyle": False,
        "needs_human": False,
        "preferred_human_scene": None,
        "icon_pack": "food_pet",
        "hero_layout": "hero_clean_product",
        "benefits_layout": "left_cards_product_right",
        "specs_layout": "spec_table_clean",
        "usage_layout": "ingredient_focus",
        "trust_layout": "offer_bar",
        "product_scale": 0.82,
        "text_density": "low",
    },
    "general": {
        "keywords": [],
        "family": "general",
        "scene_style": "premium_minimal",
        "needs_lifestyle": False,
        "needs_human": False,
        "preferred_human_scene": None,
        "icon_pack": "generic",
        "hero_layout": "hero_center_large",
        "benefits_layout": "left_text_right_product",
        "specs_layout": "spec_table_clean",
        "usage_layout": "feature_chips",
        "trust_layout": "offer_bar",
        "product_scale": 0.85,
        "text_density": "medium",
    },
}


def _normalize_text(value: str) -> str:
    return str(value or "").strip().lower()


def resolve_category_profile(
    product_title: str,
    category: str,
    brand: str = "",
    purpose: str = "",
    compatibility: str = "",
) -> Dict[str, Any]:
    haystack = " ".join(
        [
            _normalize_text(product_title),
            _normalize_text(category),
            _normalize_text(brand),
            _normalize_text(purpose),
            _normalize_text(compatibility),
        ]
    )

    for code, rule in CATEGORY_RULES.items():
        if code == "general":
            continue
        for keyword in rule["keywords"]:
            if keyword in haystack:
                result = dict(rule)
                result["code"] = code
                return result

    result = dict(CATEGORY_RULES["general"])
    result["code"] = "general"
    return result


def _limit_bullets(items: List[str], max_count: int = 4) -> List[str]:
    result: List[str] = []
    for item in items or []:
        text = str(item or "").strip()
        if text:
            result.append(text)
        if len(result) >= max_count:
            break
    return result


def build_selling_slides(
    product_title: str,
    brand: str,
    category: str,
    marketplace: str,
    purpose: str = "",
    compatibility: str = "",
    language_mode: str = "ru",
) -> List[Dict[str, Any]]:
    profile = resolve_category_profile(
        product_title=product_title,
        category=category,
        brand=brand,
        purpose=purpose,
        compatibility=compatibility,
    )

    title = product_title or "Товар"
    brand_text = brand or ""
    category_text = category or ""
    purpose_text = purpose or "Полезный в повседневном использовании"
    compatibility_text = compatibility or "Подходит для популярных сценариев"

    if language_mode == "uz":
        slides = [
            {
                "type": "hero",
                "headline": title,
                "subheadline": brand_text or category_text or "Premium mahsulot",
                "badge": "TOP",
                "bullets": _limit_bullets(
                    [
                        purpose_text,
                        compatibility_text,
                        "Marketplace uchun tayyor dizayn",
                    ],
                    3,
                ),
            },
            {
                "type": "benefits",
                "headline": "Asosiy afzalliklar",
                "subheadline": "Nega aynan shu mahsulot",
                "bullets": _limit_bullets(
                    [
                        purpose_text,
                        compatibility_text,
                        "Qulay va ishonchli foydalanish",
                    ],
                    4,
                ),
            },
            {
                "type": "specs","headline": "Xususiyatlar",
                "subheadline": "Muhim parametrlar",
                "bullets": _limit_bullets(
                    [
                        f"Brend: {brand_text or '—'}",
                        f"Kategoriya: {category_text or '—'}",
                        compatibility_text,
                        "Sifatli materiallar",
                    ],
                    4,
                ),
            },
            {
                "type": "usage",
                "headline": "Qo‘llanilishi",
                "subheadline": "Qayerda va qanday ishlatiladi",
                "bullets": _limit_bullets(
                    [
                        purpose_text,
                        "Kundalik foydalanish uchun qulay",
                        "Sotuv uchun kuchli vizual",
                    ],
                    4,
                ),
            },
            {
                "type": "trust",
                "headline": "Ishonchli tanlov",
                "subheadline": "Sifat va foyda",
                "bullets": _limit_bullets(
                    [
                        "Tartibli taqdimot",
                        "Kuchli kompozitsiya",
                        "Nashrga tayyor",
                    ],
                    3,
                ),
            },
        ]
    else:
        slides = [
            {
                "type": "hero",
                "headline": title,
                "subheadline": brand_text or category_text or "Премиальный товар",
                "badge": "ХИТ",
                "bullets": _limit_bullets(
                    [
                        purpose_text,
                        compatibility_text,
                        "Готово для маркетплейса",
                    ],
                    3,
                ),
            },
            {
                "type": "benefits",
                "headline": "Преимущества",
                "subheadline": "Почему выбирают этот товар",
                "bullets": _limit_bullets(
                    [
                        purpose_text,
                        compatibility_text,
                        "Удобно и надёжно в использовании",
                        "Продуманная подача",
                    ],
                    4,
                ),
            },
            {
                "type": "specs",
                "headline": "Характеристики",
                "subheadline": "Основные параметры",
                "bullets": _limit_bullets(
                    [
                        f"Бренд: {brand_text or '—'}",
                        f"Категория: {category_text or '—'}",
                        compatibility_text,
                        "Качественные материалы",
                    ],
                    4,
                ),
            },
            {
                "type": "usage",
                "headline": "Применение",
                "subheadline": "Где и как используется",
                "bullets": _limit_bullets(
                    [
                        purpose_text,
                        "Подходит для повседневных задач",
                        "Сильная визуальная подача",
                    ],
                    4,
                ),
            },
            {
                "type": "trust",
                "headline": "Гарантия качества",
                "subheadline": "Надёжный выбор",
                "bullets": _limit_bullets(
                    [
                        "Стабильное качество",
                        "Аккуратная подача",
                        "Готово к публикации",
                    ],
                    3,
                ),
            },
        ]

    for slide in slides:
        slide["category_profile"] = profile["code"]
        slide["scene_style"] = profile["scene_style"]
        slide["icon_pack"] = profile["icon_pack"]
        slide["needs_lifestyle"] = profile["needs_lifestyle"]
        slide["needs_human"] = profile["needs_human"]
        slide["preferred_human_scene"] = profile["preferred_human_scene"]
        slide["text_density"] = profile["text_density"]

    return slides


def _direction_by_layout(layout_type: str) -> Dict[str, Any]:
    presets = {
        "hero_center_large": {
            "product_scale": 0.96,
            "product_position": {"x": 0.50, "y": 0.54},
            "text_position": {"x": 0.08, "y": 0.08},
            "content_width_ratio": 0.42,
        },
        "hero_wide_product": {
            "product_scale": 0.92,
            "product_position": {"x": 0.56, "y": 0.50},
            "text_position": {"x": 0.07, "y": 0.08},
            "content_width_ratio": 0.38,
        },
        "hero_large_right": {
    "product_scale": 0.92,
    "product_position": {"x": 0.60, "y": 0.52},
    "text_position": {"x": 0.08, "y": 0.08},
    "content_width_ratio": 0.36,
},
    }
    return presets.get(layout_type, presets["hero_center_large"])
def build_slide_direction(*args, **kwargs):
    return {
        "layout": "default",
        "style": "modern",
        "focus": "product"
    }