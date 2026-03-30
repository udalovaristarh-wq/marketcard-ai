from __future__ import annotations

from typing import Any
import random


def _clean(value: Any) -> str:
    return str(value or "").strip().lower()


def _normalize_category(category: str) -> str:
    value = _clean(category)

    mapping = {
        "electronics": [
            "элект", "гаджет", "смарт", "watch", "smart", "науш", "телефон",
            "планш", "ноут", "монитор", "bluetooth", "power bank", "колон",
            "часы",
        ],
        "auto": [
            "авто", "запчаст", "колод", "фильтр", "масло", "свеч", "аморт",
            "аккум", "грм", "подвес", "радиатор",
        ],
        "fashion": [
            "одеж", "обув", "кросс", "футбол", "худи", "джинс", "плать",
            "рубаш", "сумк", "рюкзак", "аксесс",
        ],
        "beauty": [
            "космет", "крем", "сывор", "шампун", "парфюм", "маска", "лосьон",
            "помад", "туш", "beauty",
        ],
        "home": [
            "дом", "кух", "подуш", "одеял", "плед", "чаш", "тарел", "утюг",
            "пылесос", "чайник", "кофевар", "блендер", "светиль",
        ],
        "books": [
            "книг", "тетрад", "канц", "ручк", "карандаш", "ежеднев",
        ],
        "kids": [
            "дет", "игруш", "lego", "конструкт", "кукл", "коляск",
        ],
        "sports": [
            "спорт", "туризм", "гантел", "йога", "эспанд", "бег", "велосип",
        ],
        "tools": [
            "инстру", "дрель", "шурупов", "ключ", "ремонт", "строй",
        ],
        "food": [
            "еда", "чай", "кофе", "сладост", "бакале", "зоотовар", "корм",
        ],
    }

    for key, words in mapping.items():
        if any(word in value for word in words):
            return key

    return "general"


def _palette_pool(category_type: str) -> list[dict[str, Any]]:
    common = [
        {
            "name": "dark_tech_blue",
            "base": "graphite black",
            "accent": "electric blue",
            "support": "silver white",
            "background": "dark premium gradient with glow",
            "lighting": "high contrast cinematic light",
        },
        {
            "name": "silver_clean",
            "base": "silver white",
            "accent": "royal blue",
            "support": "graphite gray",
            "background": "clean premium light gradient",
            "lighting": "clean commercial bright light",
        },
        {
            "name": "neon_purple",
            "base": "deep graphite",
            "accent": "violet neon",
            "support": "cool white",
            "background": "dark purple premium glow background",
            "lighting": "premium neon contrast light",
        },
        {
            "name": "emerald_modern",
            "base": "deep graphite",
            "accent": "emerald green",
            "support": "soft white",
            "background": "dark emerald cinematic gradient",
            "lighting": "fresh premium contrast light",
        },
        {
            "name": "sunset_orange",
            "base": "dark graphite",
            "accent": "warm orange",
            "support": "gold white",
            "background": "sunset premium gradient with energy",
            "lighting": "dramatic warm contrast",
        },
        {
            "name": "premium_red",
            "base": "charcoal black",
            "accent": "deep red",
            "support": "white silver",
            "background": "dark red luxury gradient",
            "lighting": "strong dramatic premium light",
        },
    ]

    by_category = {
        "electronics": common,
        "auto": [
            common[0],
            common[4],
            common[5],
            common[1],
        ],
        "fashion": [
            common[1],
            common[2],
            common[5],
            common[4],],
        "beauty": [
            common[1],
            common[2],
            common[3],
        ],
        "home": [
            common[1],
            common[4],
            common[3],
        ],
        "sports": [
            common[0],
            common[4],
            common[5],
            common[3],
        ],
        "general": common,
    }

    return by_category.get(category_type, common)


def _style_family_for_category(category_type: str) -> str:
    mapping = {
        "electronics": "premium tech",
        "auto": "industrial premium",
        "fashion": "editorial commercial",
        "beauty": "clean luxury",
        "home": "cozy premium",
        "books": "editorial minimal",
        "kids": "playful premium",
        "sports": "dynamic sport",
        "tools": "bold utility premium",
        "food": "fresh commercial",
        "general": "premium marketplace",
    }
    return mapping.get(category_type, "premium marketplace")


def _background_direction(category_type: str) -> str:
    mapping = {
        "electronics": "premium tech background with depth, glow, reflections, and modern marketplace energy",
        "auto": "industrial performance background with texture, energy, and strong contrast",
        "fashion": "editorial premium background with clean luxury atmosphere",
        "beauty": "polished luxury beauty background with refined glow and clean light",
        "home": "warm premium interior-inspired background with comfort atmosphere",
        "books": "clean editorial backdrop with elegant minimal depth",
        "kids": "bright playful commercial background with premium energy",
        "sports": "dynamic motion background with speed and impact",
        "tools": "industrial practical background with bold technical energy",
        "food": "fresh commercial background with appetizing premium color contrast",
        "general": "premium marketplace background with depth and product-first composition",
    }
    return mapping.get(category_type, mapping["general"])


def _graphic_accent_style(category_type: str) -> str:
    mapping = {
        "electronics": "glow lines, neon accents, subtle particles, premium tech highlights",
        "auto": "metallic lines, technical accents, motion energy, performance highlights",
        "fashion": "clean editorial accents, subtle luxury lines, premium typography",
        "beauty": "soft glow, elegant highlights, luxury minimal accents",
        "home": "soft ambient accents, comfort-driven premium graphics",
        "books": "editorial lines, clean structure, elegant minimal accents",
        "kids": "friendly colorful accents, energetic shapes",
        "sports": "motion trails, speed arcs, dynamic energy accents",
        "tools": "technical marks, bold lines, industrial accents",
        "food": "fresh highlights, appetizing color pops, commercial accents",
        "general": "clean premium infographic accents with modern balance",
    }
    return mapping.get(category_type, mapping["general"])


def build_visual_profile(
    *,
    product_title: str,
    brand: str,
    category: str,
    marketplace: str,
    language_mode: str,
    generation_seed: str | None = None,
) -> dict[str, Any]:
    category_type = _normalize_category(category)

    pool = _palette_pool(category_type)

    rnd = random.Random()
    if generation_seed:
        rnd.seed(generation_seed)

    palette = rnd.choice(pool)

    marketplace = _clean(marketplace) or "uzum"
    language_mode = _clean(language_mode) or "ru"

    return {
        "category_type": category_type,
        "style_family": _style_family_for_category(category_type),
        "background_direction": _background_direction(category_type),
        "graphic_accent_style": _graphic_accent_style(category_type),"palette": palette,
        "marketplace": marketplace,
        "language_mode": language_mode,
        "series_consistency_rule": (
            "All 5 cards in the series must keep one consistent visual DNA: "
            "same palette family, same lighting logic, same style family, "
            "same premium mood, but different compositions, different angles, and different infographic focus."
        ),
        "variation_rule": (
            "Each new generation must be allowed to choose a different palette and different background direction, "
            "even for the same product, while keeping the product itself recognizable."
        ),
    }