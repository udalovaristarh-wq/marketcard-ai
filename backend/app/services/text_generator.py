from __future__ import annotations

import re
from typing import Literal

LanguageMode = Literal["ru", "uz", "ru_uz", "both"]
CategoryType = Literal[
    "auto",
    "electronics",
    "home",
    "beauty",
    "tools",
    "fashion",
    "kids",
    "general",
]


def normalize_text(value: str) -> str:
    return " ".join(str(value).strip().split())


def normalize_title(title: str) -> str:
    cleaned = normalize_text(title)
    return cleaned[:140] if len(cleaned) > 140 else cleaned


def normalize_brand(brand: str) -> str:
    cleaned = normalize_text(brand)
    return cleaned[:60] if len(cleaned) > 60 else cleaned


def detect_category_type(category: str, title: str) -> CategoryType:
    text = f"{category} {title}".lower()

    auto_keys = [
        "auto", "авто", "запчаст", "запчасть", "амортиз", "насос", "датчик",
        "тормоз", "фильтр", "подшип", "рычаг", "стойка", "ремень", "сцеплен",
        "gur", "grm", "радиатор", "ступиц", "втулка", "шрус", "опора",
        "spark", "cobalt", "malibu", "tracker", "nexia", "matiz", "lacetti",
        "captiva", "damas", "gentra", "ravon", "chevrolet", "daewoo",
        "масл", "рул", "подвес", "свеч", "колодк", "диск", "ступица",
    ]

    electronics_keys = [
        "elect", "элект", "тех", "науш", "bluetooth", "usb", "заряд",
        "кабель", "колонка", "смарт", "мыш", "клав", "телефон", "гарнитур",
        "powerbank", "speaker", "headphone", "earbuds", "microphone",
        "монитор", "ноут", "laptop", "adapter", "ssd", "hdd", "wifi",
        "роутер", "часы", "watch", "keyboard", "mouse",
    ]

    home_keys = [
        "home", "дом", "кухн", "ванн", "посуда", "контейнер", "органайзер",
        "уборк", "хранен", "полка", "коврик", "подушка", "одеяло", "штора",
        "сушилка", "держатель", "быт", "хозтовар", "щетка", "ведро",
        "корзин", "плед", "наволоч", "простын",
    ]

    beauty_keys = [
        "beauty", "космет", "парфюм", "шампун", "крем", "сыворот", "маска",
        "уход", "макияж", "духи", "hair", "skin", "nail", "бальзам",
        "лосьон", "пенка", "гель", "масло", "помада",
    ]

    tools_keys = [
        "tool", "инструм", "дрель", "шурупов", "ключ", "отверт", "молоток",
        "нож", "плоскогуб", "набор", "ремонт", "строит", "рулетка",
        "пила", "лобзик", "болгарка", "перфоратор",
    ]

    fashion_keys = [
        "fashion", "одежд", "обув", "сумк", "рюкзак", "кошелек", "ремень",
        "футболк", "куртк", "брюк", "плать", "кроссов", "кепк", "шапка",
        "толстов", "джинс", "рубашк",
    ]

    kids_keys = [
        "kids", "дет", "игруш", "ребен", "школ", "коляск", "подгуз",
        "baby", "newborn", "развивающ", "погремуш", "конструктор",
    ]

    if any(key in text for key in auto_keys):
        return "auto"
    if any(key in text for key in electronics_keys):
        return "electronics"
    if any(key in text for key in home_keys):
        return "home"
    if any(key in text for key in beauty_keys):
        return "beauty"
    if any(key in text for key in tools_keys):
        return "tools"
    if any(key in text for key in fashion_keys):
        return "fashion"
    if any(key in text for key in kids_keys):
        return "kids"

    return "general"


def clean_feature_list(items: list[str], max_items: int = 4) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []

    for item in items:
        normalized = normalize_text(item)
        key = normalized.lower()
        if not normalized or key in seen:
            continue
        seen.add(key)
        result.append(normalized)
        if len(result) >= max_items:
            break

    return result


def ru_features(category_type: CategoryType) -> list[str]:
    presets = {
        "auto": [
            "Надёжное качество",
            "Точная совместимость","Простая установка",
            "Долгий срок службы",
        ],
        "electronics": [
            "Стабильная работа",
            "Чистый сигнал и звук",
            "Современный формат",
            "Комфортно использовать каждый день",
        ],
        "home": [
            "Практично в использовании",
            "Удобно для дома",
            "Продуманная форма",
            "Качественные материалы",
        ],
        "beauty": [
            "Комфортное применение",
            "Аккуратный результат",
            "Современный подход",
            "Подходит для регулярного использования",
        ],
        "tools": [
            "Прочный материал",
            "Удобно в работе",
            "Для постоянного использования",
            "Надёжная конструкция",
        ],
        "fashion": [
            "Стильный внешний вид",
            "Комфорт в носке",
            "Качественная отделка",
            "Актуальный дизайн",
        ],
        "kids": [
            "Удобно каждый день",
            "Безопасно и практично",
            "Подходит для регулярного использования",
            "Продуманная конструкция",
        ],
        "general": [
            "Качественные материалы",
            "Современный дизайн",
            "Удобно использовать",
            "Подходит для ежедневного применения",
        ],
    }
    return presets.get(category_type, presets["general"])


def uz_features(category_type: CategoryType) -> list[str]:
    presets = {
        "auto": [
            "Ishonchli sifat",
            "Aniq moslik",
            "Qulay o‘rnatish",
            "Uzoq xizmat muddati",
        ],
        "electronics": [
            "Barqaror ishlash",
            "Toza signal va ovoz",
            "Zamonaviy format",
            "Har kuni qulay foydalanish",
        ],
        "home": [
            "Amalda qulay",
            "Uy uchun mos",
            "O‘ylangan shakl",
            "Sifatli materiallar",
        ],
        "beauty": [
            "Qulay qo‘llash",
            "Chiroyli natija",
            "Zamonaviy yondashuv",
            "Muntazam foydalanish uchun mos",
        ],
        "tools": [
            "Mustahkam material",
            "Ishlashda qulay",
            "Doimiy foydalanish uchun mos",
            "Ishonchli konstruktsiya",
        ],
        "fashion": [
            "Zamonaviy ko‘rinish",
            "Kiyishda qulay",
            "Sifatli ishlov",
            "Dolzarb dizayn",
        ],
        "kids": [
            "Har kuni qulay",
            "Xavfsiz va amaliy",
            "Muntazam ishlatish uchun mos",
            "O‘ylangan konstruktsiya",
        ],
        "general": [
            "Sifatli materiallar",
            "Zamonaviy dizayn",
            "Qulay foydalanish",
            "Har kunlik ishlatish uchun mos",
        ],
    }
    return presets.get(category_type, presets["general"])


def ru_badges(category_type: CategoryType) -> list[str]:
    presets = {
        "auto": ["Надёжный выбор", "Проверенное качество", "Точная совместимость"],
        "electronics": ["Хит продаж", "Технологичный выбор", "Новый уровень комфорта"],
        "home": ["Удобно каждый день", "Практичный выбор", "Для комфортного дома"],
        "beauty": ["Популярный выбор", "Комфортный уход", "Современный подход"],
        "tools": ["Надёжный инструмент", "Для серьёзной работы", "Практичный выбор"],
        "fashion": ["Стильный выбор", "Актуальный дизайн", "Комфорт и стиль"],
        "kids": ["Забота каждый день", "Удобный выбор", "Для пользы и комфорта"],
        "general": ["Новинка", "Популярный выбор", "Премиальное качество"],
    }
    return presets.get(category_type, presets["general"])


def uz_badges(category_type: CategoryType) -> list[str]:
    presets = {
        "auto": ["Ishonchli tanlov", "Sinalgan sifat", "Aniq moslik"],"electronics": ["Xit savdo", "Texnologik tanlov", "Yangi qulaylik darajasi"],
        "home": ["Har kun qulay", "Amaliy tanlov", "Qulay uy uchun"],
        "beauty": ["Ommabop tanlov", "Qulay parvarish", "Zamonaviy yondashuv"],
        "tools": ["Ishonchli asbob", "Jiddiy ish uchun", "Amaliy tanlov"],
        "fashion": ["Zamonaviy tanlov", "Dolzarb dizayn", "Qulaylik va uslub"],
        "kids": ["Har kun g‘amxo‘rlik", "Qulay tanlov", "Foyda va qulaylik uchun"],
        "general": ["Yangi", "Ommabop tanlov", "Premium sifat"],
    }
    return presets.get(category_type, presets["general"])


def choose_badge(title: str, brand: str, badges: list[str]) -> str:
    text = f"{title} {brand}".lower()

    if any(word in text for word in ["premium", "pro", "max", "plus", "ultra"]):
        return badges[-1]

    if any(word in text for word in ["new", "нов", "yangi"]):
        return badges[0]

    return badges[1] if len(badges) > 1 else badges[0]


def build_bilingual_lines(ru_list: list[str], uz_list: list[str]) -> list[str]:
    result: list[str] = []
    for ru, uz in zip(ru_list, uz_list):
        result.append(f"{ru} / {uz}")
    return result


def short_brand_line_ru(brand: str, marketplace: str) -> str:
    mp = marketplace.lower()

    if mp == "ozon":
        return f"{brand} · Удобный выбор"
    if mp == "wildberries":
        return f"{brand} · Качественный выбор"
    if mp == "yandex":
        return f"{brand} · Современное решение"
    return f"{brand} · Надёжное качество"


def short_brand_line_uz(brand: str, marketplace: str) -> str:
    mp = marketplace.lower()

    if mp == "ozon":
        return f"{brand} · Qulay tanlov"
    if mp == "wildberries":
        return f"{brand} · Sifatli tanlov"
    if mp == "yandex":
        return f"{brand} · Zamonaviy yechim"
    return f"{brand} · Ishonchli sifat"


def clean_headline_for_card(title: str) -> str:
    title = normalize_title(title)
    title = re.sub(r"\s+", " ", title)
    return title[:80] if len(title) > 80 else title


def build_visual_keywords_ru(category_type: CategoryType) -> list[str]:
    presets = {
        "auto": ["Совместимость", "Надёжность", "Ресурс", "Установка"],
        "electronics": ["Комфорт", "Технологии", "Стабильность", "Качество"],
        "home": ["Практичность", "Удобство", "Функциональность", "Комфорт"],
        "beauty": ["Уход", "Комфорт", "Результат", "Стиль"],
        "tools": ["Прочность", "Точность", "Удобство", "Надёжность"],
        "fashion": ["Стиль", "Комфорт", "Актуальность", "Качество"],
        "kids": ["Комфорт", "Безопасность", "Практичность", "Забота"],
        "general": ["Качество", "Удобство", "Стиль", "Практичность"],
    }
    return presets.get(category_type, presets["general"])


def build_visual_keywords_uz(category_type: CategoryType) -> list[str]:
    presets = {
        "auto": ["Moslik", "Ishonchlilik", "Resurs", "O‘rnatish"],
        "electronics": ["Qulaylik", "Texnologiya", "Barqarorlik", "Sifat"],
        "home": ["Amaliylik", "Qulaylik", "Funktsionallik", "Komfort"],
        "beauty": ["Parvarish", "Qulaylik", "Natija", "Uslub"],
        "tools": ["Mustahkamlik", "Aniqlik", "Qulaylik", "Ishonchlilik"],
        "fashion": ["Uslub", "Qulaylik", "Dolzarblik", "Sifat"],
        "kids": ["Qulaylik", "Xavfsizlik", "Amaliylik", "G‘amxo‘rlik"],
        "general": ["Sifat", "Qulaylik", "Uslub", "Amaliylik"],
    }
    return presets.get(category_type, presets["general"])


def generate_copy(
    title: str,
    brand: str,
    category: str,
    marketplace: str = "uzum",
    language_mode: str = "ru",
) -> dict:
    clean_title = clean_headline_for_card(title)
    clean_brand = normalize_brand(brand)
    category_type = detect_category_type(category, clean_title)

    ru_list = clean_feature_list(ru_features(category_type), max_items=4)
    uz_list = clean_feature_list(uz_features(category_type), max_items=4)

    ru_badge = choose_badge(clean_title, clean_brand, ru_badges(category_type))
    uz_badge = choose_badge(clean_title, clean_brand, uz_badges(category_type))
    ru_sub = short_brand_line_ru(clean_brand, marketplace)
    uz_sub = short_brand_line_uz(clean_brand, marketplace)

    ru_keywords = build_visual_keywords_ru(category_type)
    uz_keywords = build_visual_keywords_uz(category_type)

    mode = language_mode.lower().strip()

    if mode == "uz":
        return {
            "headline": clean_title,
            "subheadline": uz_sub,
            "benefits": uz_list,
            "badge": uz_badge,
            "language_mode": "uz",
            "marketplace": marketplace,
            "category_type": category_type,
            "visual_keywords": uz_keywords,
            "brand": clean_brand,
        }

    if mode in ("ru_uz", "both"):
        return {
            "headline": clean_title,
            "subheadline": f"{ru_sub} / {uz_sub}",
            "benefits": build_bilingual_lines(ru_list, uz_list),
            "badge": f"{ru_badge} / {uz_badge}",
            "language_mode": "ru_uz",
            "marketplace": marketplace,
            "category_type": category_type,
            "visual_keywords": [
                f"{ru_keywords[0]} / {uz_keywords[0]}",
                f"{ru_keywords[1]} / {uz_keywords[1]}",
                f"{ru_keywords[2]} / {uz_keywords[2]}",
                f"{ru_keywords[3]} / {uz_keywords[3]}",
            ],
            "brand": clean_brand,
        }

    return {
        "headline": clean_title,
        "subheadline": ru_sub,
        "benefits": ru_list,
        "badge": ru_badge,
        "language_mode": "ru",
        "marketplace": marketplace,
        "category_type": category_type,
        "visual_keywords": ru_keywords,
        "brand": clean_brand,
    }