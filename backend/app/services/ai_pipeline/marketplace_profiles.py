from __future__ import annotations

from typing import Dict, Any, List


# =========================================================
# MARKETPLACE PROFILE CORE
# =========================================================
# Этот файл хранит:
# - размеры площадок
# - safe zones
# - стиль карточек
# - лимиты текста
# - правила композиции
# - правила по типам слайдов
# - вспомогательные функции доступа
# =========================================================


DEFAULT_MARKETPLACE = "uzum"


MARKETPLACE_PROFILES: Dict[str, Dict[str, Any]] = {
    "uzum": {
        "name": "Uzum",
        "code": "uzum",

        # Размеры
        "width": 1080,
        "height": 1440,
        "ratio": "3:4",

        # Безопасные отступы
        "safe_margin": 60,
        "safe_top": 60,
        "safe_right": 60,
        "safe_bottom": 70,
        "safe_left": 60,

        # Общий стиль площадки
        "style_bias": "bold_marketplace",
        "design_tone": "commercial_bright",
        "visual_priority": "sales_first",
        "background_intensity": "medium_high",
        "text_density": "medium",
        "accent_strength": "high",

        # Языки
        "supported_languages": ["ru", "uz", "both"],
        "default_language": "ru",

        # Ограничения текста
        "headline_max_chars": 46,
        "subheadline_max_chars": 80,
        "bullet_max_chars": 42,
        "bullet_max_count": 4,
        "keywords_max_count": 12,

        # Правила типографики
        "font_profile": {
            "headline": "bold_commercial",
            "subheadline": "clean_sans",
            "badge": "bold_caps",
            "bullets": "strong_ui",
            "specs": "compact_ui",
        },

        # Поведение композиции
        "product_focus": "high",
        "product_min_coverage": 0.28,
        "product_max_coverage": 0.58,
        "allow_large_hero_object": True,
        "allow_dense_specs": True,

        # Правила по типам слайдов
        "slide_rules": {
            "hero": {
                "preferred_layouts": [
                    "hero_center_large",
                    "hero_right_large",
                    "hero_left_large",
                ],
                "max_bullets": 3,
                "headline_priority": "very_high",
                "product_priority": "very_high",
                "background_priority": "medium",
            },
            "benefits": {
                "preferred_layouts": [
                    "left_text_right_product",
                    "right_text_left_product",
                    "benefit_cards_with_product",
                ],
                "max_bullets": 4,
                "headline_priority": "high",
                "product_priority": "high",
                "background_priority": "medium",
            },
            "compatibility": {
                "preferred_layouts": [
                    "top_product_bottom_specs",
                    "compatibility_grid",
                    "chips_with_product",
                ],
                "max_bullets": 4,
                "headline_priority": "medium",
                "product_priority": "medium",
                "background_priority": "low",
            },
            "specs": {
                "preferred_layouts": [
                    "top_product_bottom_specs",
                    "specs_panel",
                    "split_specs_product",
                ],
                "max_bullets": 4,
                "headline_priority": "medium",
                "product_priority": "medium",
                "background_priority": "low",
            },
            "usage": {
                "preferred_layouts": [
                    "left_product_right_text",
                    "product_with_usage_cards",
                    "product_scene_usage",
                ],"max_bullets": 4,
                "headline_priority": "high",
                "product_priority": "high",
                "background_priority": "medium",
            },
            "trust": {
                "preferred_layouts": [
                    "premium_focus",
                    "trust_cards",
                    "bottom_feature_panel",
                ],
                "max_bullets": 4,
                "headline_priority": "high",
                "product_priority": "medium",
                "background_priority": "medium",
            },
        },

        # Категорийные смещения
        "category_bias": {
            "auto": {
                "style": "technical_commercial",
                "background": "industrial_dynamic",
                "accent_palette": "blue_cyan_orange",
            },
            "electronics": {
                "style": "tech_premium",
                "background": "neon_clean",
                "accent_palette": "blue_cyan_white",
            },
            "fashion": {
                "style": "premium_soft",
                "background": "light_luxury",
                "accent_palette": "beige_gold_black",
            },
            "general": {
                "style": "commercial_universal",
                "background": "clean_dynamic",
                "accent_palette": "brand_flexible",
            },
        },
    },

    "wildberries": {
        "name": "Wildberries",
        "code": "wildberries",

        "width": 900,
        "height": 1200,
        "ratio": "3:4",

        "safe_margin": 50,
        "safe_top": 50,
        "safe_right": 50,
        "safe_bottom": 60,
        "safe_left": 50,

        "style_bias": "clean_commercial",
        "design_tone": "clean_sales",
        "visual_priority": "clarity_first",
        "background_intensity": "medium",
        "text_density": "medium",
        "accent_strength": "medium",

        "supported_languages": ["ru", "uz", "both"],
        "default_language": "ru",

        "headline_max_chars": 42,
        "subheadline_max_chars": 72,
        "bullet_max_chars": 38,
        "bullet_max_count": 4,
        "keywords_max_count": 12,

        "font_profile": {
            "headline": "bold_clean",
            "subheadline": "neutral_sans",
            "badge": "compact_caps",
            "bullets": "ui_medium",
            "specs": "compact_ui",
        },

        "product_focus": "high",
        "product_min_coverage": 0.25,
        "product_max_coverage": 0.52,
        "allow_large_hero_object": True,
        "allow_dense_specs": True,

        "slide_rules": {
            "hero": {
                "preferred_layouts": [
                    "hero_center_large",
                    "hero_right_large",
                ],
                "max_bullets": 3,
                "headline_priority": "very_high",
                "product_priority": "very_high",
                "background_priority": "low_medium",
            },
            "benefits": {
                "preferred_layouts": [
                    "left_text_right_product",
                    "benefit_cards_with_product",
                ],
                "max_bullets": 4,
                "headline_priority": "high",
                "product_priority": "high",
                "background_priority": "low_medium",
            },
            "compatibility": {
                "preferred_layouts": [
                    "compatibility_grid",
                    "chips_with_product",
                ],
                "max_bullets": 4,
                "headline_priority": "medium",
                "product_priority": "medium",
                "background_priority": "low",
            },
            "specs": {
                "preferred_layouts": [
                    "specs_panel","split_specs_product",
                ],
                "max_bullets": 4,
                "headline_priority": "medium",
                "product_priority": "medium",
                "background_priority": "low",
            },
            "usage": {
                "preferred_layouts": [
                    "left_product_right_text",
                    "product_scene_usage",
                ],
                "max_bullets": 4,
                "headline_priority": "high",
                "product_priority": "high",
                "background_priority": "low_medium",
            },
            "trust": {
                "preferred_layouts": [
                    "trust_cards",
                    "premium_focus",
                ],
                "max_bullets": 4,
                "headline_priority": "high",
                "product_priority": "medium",
                "background_priority": "low_medium",
            },
        },

        "category_bias": {
            "auto": {
                "style": "technical_clean",
                "background": "industrial_soft",
                "accent_palette": "violet_blue_white",
            },
            "electronics": {
                "style": "tech_clean",
                "background": "minimal_glow",
                "accent_palette": "violet_blue_cyan",
            },
            "fashion": {
                "style": "catalog_premium",
                "background": "soft_clean",
                "accent_palette": "white_beige_black",
            },
            "general": {
                "style": "clean_universal",
                "background": "studio_catalog",
                "accent_palette": "neutral_brand",
            },
        },
    },

    "ozon": {
        "name": "Ozon",
        "code": "ozon",

        "width": 1200,
        "height": 1600,
        "ratio": "3:4",

        "safe_margin": 70,
        "safe_top": 70,
        "safe_right": 70,
        "safe_bottom": 80,
        "safe_left": 70,

        "style_bias": "tech_clean",
        "design_tone": "tech_structured",
        "visual_priority": "clarity_and_premium",
        "background_intensity": "medium_low",
        "text_density": "medium",
        "accent_strength": "medium_high",

        "supported_languages": ["ru", "uz", "both"],
        "default_language": "ru",

        "headline_max_chars": 48,
        "subheadline_max_chars": 78,
        "bullet_max_chars": 40,
        "bullet_max_count": 4,
        "keywords_max_count": 12,

        "font_profile": {
            "headline": "tech_bold",
            "subheadline": "tech_sans",
            "badge": "bold_caps",
            "bullets": "clean_ui",
            "specs": "compact_ui",
        },

        "product_focus": "high",
        "product_min_coverage": 0.24,
        "product_max_coverage": 0.50,
        "allow_large_hero_object": True,
        "allow_dense_specs": True,

        "slide_rules": {
            "hero": {
                "preferred_layouts": [
                    "hero_right_large",
                    "hero_center_large",
                    "hero_left_large",
                ],
                "max_bullets": 3,
                "headline_priority": "very_high",
                "product_priority": "very_high",
                "background_priority": "medium",
            },
            "benefits": {
                "preferred_layouts": [
                    "benefit_cards_with_product",
                    "left_text_right_product",
                ],
                "max_bullets": 4,
                "headline_priority": "high",
                "product_priority": "high",
                "background_priority": "medium",
            },
            "compatibility": {
                "preferred_layouts": [
                    "compatibility_grid","chips_with_product",
                ],
                "max_bullets": 4,
                "headline_priority": "medium",
                "product_priority": "medium",
                "background_priority": "low",
            },
            "specs": {
                "preferred_layouts": [
                    "specs_panel",
                    "top_product_bottom_specs",
                    "split_specs_product",
                ],
                "max_bullets": 4,
                "headline_priority": "medium",
                "product_priority": "medium",
                "background_priority": "low",
            },
            "usage": {
                "preferred_layouts": [
                    "product_scene_usage",
                    "left_product_right_text",
                ],
                "max_bullets": 4,
                "headline_priority": "high",
                "product_priority": "high",
                "background_priority": "medium",
            },
            "trust": {
                "preferred_layouts": [
                    "premium_focus",
                    "trust_cards",
                ],
                "max_bullets": 4,
                "headline_priority": "high",
                "product_priority": "medium",
                "background_priority": "medium",
            },
        },

        "category_bias": {
            "auto": {
                "style": "technical_premium",
                "background": "industrial_clean",
                "accent_palette": "blue_white_orange",
            },
            "electronics": {
                "style": "future_tech",
                "background": "tech_gradient",
                "accent_palette": "blue_cyan_white",
            },
            "fashion": {
                "style": "minimal_premium",
                "background": "soft_editorial",
                "accent_palette": "black_white_gold",
            },
            "general": {
                "style": "structured_universal",
                "background": "clean_modern",
                "accent_palette": "brand_balanced",
            },
        },
    },

    "yandex": {
        "name": "Yandex Market",
        "code": "yandex",

        "width": 1000,
        "height": 1000,
        "ratio": "1:1",

        "safe_margin": 50,
        "safe_top": 50,
        "safe_right": 50,
        "safe_bottom": 50,
        "safe_left": 50,

        "style_bias": "minimal_market",
        "design_tone": "minimal_clean",
        "visual_priority": "clarity_first",
        "background_intensity": "low",
        "text_density": "low_medium",
        "accent_strength": "medium",

        "supported_languages": ["ru", "uz", "both"],
        "default_language": "ru",

        "headline_max_chars": 36,
        "subheadline_max_chars": 60,
        "bullet_max_chars": 34,
        "bullet_max_count": 3,
        "keywords_max_count": 10,

        "font_profile": {
            "headline": "minimal_bold",
            "subheadline": "minimal_sans",
            "badge": "compact_caps",
            "bullets": "compact_ui",
            "specs": "compact_ui",
        },

        "product_focus": "very_high",
        "product_min_coverage": 0.30,
        "product_max_coverage": 0.60,
        "allow_large_hero_object": True,
        "allow_dense_specs": False,

        "slide_rules": {
            "hero": {
                "preferred_layouts": [
                    "hero_center_large",
                    "hero_square_focus",
                ],
                "max_bullets": 2,
                "headline_priority": "high",
                "product_priority": "very_high",
                "background_priority": "low",
            },
            "benefits": {
                "preferred_layouts": [
                    "square_left_text_right_product","benefit_cards_with_product",
                ],
                "max_bullets": 3,
                "headline_priority": "high",
                "product_priority": "high",
                "background_priority": "low",
            },
            "compatibility": {
                "preferred_layouts": [
                    "compatibility_grid_square",
                    "chips_with_product",
                ],
                "max_bullets": 3,
                "headline_priority": "medium",
                "product_priority": "medium",
                "background_priority": "low",
            },
            "specs": {
                "preferred_layouts": [
                    "specs_panel_square",
                    "split_specs_product_square",
                ],
                "max_bullets": 3,
                "headline_priority": "medium",
                "product_priority": "medium",
                "background_priority": "low",
            },
            "usage": {
                "preferred_layouts": [
                    "left_product_right_text_square",
                    "product_scene_usage_square",
                ],
                "max_bullets": 3,
                "headline_priority": "medium",
                "product_priority": "high",
                "background_priority": "low",
            },
            "trust": {
                "preferred_layouts": [
                    "trust_cards_square",
                    "minimal_focus",
                ],
                "max_bullets": 3,
                "headline_priority": "medium",
                "product_priority": "medium",
                "background_priority": "low",
            },
        },

        "category_bias": {
            "auto": {
                "style": "technical_minimal",
                "background": "clean_light_industrial",
                "accent_palette": "yellow_black_white",
            },
            "electronics": {
                "style": "minimal_tech",
                "background": "clean_tech",
                "accent_palette": "yellow_white_black",
            },
            "fashion": {
                "style": "editorial_clean",
                "background": "bright_minimal",
                "accent_palette": "white_black_beige",
            },
            "general": {
                "style": "minimal_universal",
                "background": "catalog_clean",
                "accent_palette": "brand_neutral",
            },
        },
    },
}


# =========================================================
# BASIC ACCESS
# =========================================================

def get_marketplace_profile(marketplace: str) -> Dict[str, Any]:
    key = (marketplace or DEFAULT_MARKETPLACE).strip().lower()
    return MARKETPLACE_PROFILES.get(key, MARKETPLACE_PROFILES[DEFAULT_MARKETPLACE])


def get_canvas_size(marketplace: str) -> tuple[int, int]:
    profile = get_marketplace_profile(marketplace)
    return profile["width"], profile["height"]


def get_ratio(marketplace: str) -> str:
    profile = get_marketplace_profile(marketplace)
    return profile["ratio"]


def get_supported_languages(marketplace: str) -> List[str]:
    profile = get_marketplace_profile(marketplace)
    return profile.get("supported_languages", ["ru"])


def get_default_language(marketplace: str) -> str:
    profile = get_marketplace_profile(marketplace)
    return profile.get("default_language", "ru")


# =========================================================
# SAFE ZONES
# =========================================================

def get_safe_zone(marketplace: str) -> Dict[str, int]:
    profile = get_marketplace_profile(marketplace)
    return {
        "top": profile.get("safe_top", profile.get("safe_margin", 50)),
        "right": profile.get("safe_right", profile.get("safe_margin", 50)),
        "bottom": profile.get("safe_bottom", profile.get("safe_margin", 50)),
        "left": profile.get("safe_left", profile.get("safe_margin", 50)),
    }
def get_content_box(marketplace: str) -> Dict[str, int]:
    profile = get_marketplace_profile(marketplace)
    width = profile["width"]
    height = profile["height"]
    safe = get_safe_zone(marketplace)

    return {
        "x": safe["left"],
        "y": safe["top"],
        "width": width - safe["left"] - safe["right"],
        "height": height - safe["top"] - safe["bottom"],
    }


# =========================================================
# TEXT LIMITS
# =========================================================

def get_text_limits(marketplace: str) -> Dict[str, int]:
    profile = get_marketplace_profile(marketplace)
    return {
        "headline_max_chars": profile.get("headline_max_chars", 40),
        "subheadline_max_chars": profile.get("subheadline_max_chars", 70),
        "bullet_max_chars": profile.get("bullet_max_chars", 40),
        "bullet_max_count": profile.get("bullet_max_count", 4),
        "keywords_max_count": profile.get("keywords_max_count", 12),
    }


def clamp_text_for_marketplace(
    text: str,
    marketplace: str,
    field_name: str,
) -> str:
    text = (text or "").strip()
    limits = get_text_limits(marketplace)

    field_map = {
        "headline": limits["headline_max_chars"],
        "subheadline": limits["subheadline_max_chars"],
        "bullet": limits["bullet_max_chars"],
    }

    max_len = field_map.get(field_name, 9999)
    if len(text) <= max_len:
        return text

    if max_len <= 3:
        return text[:max_len]

    return text[: max_len - 3].rstrip() + "..."


def clamp_bullets_for_marketplace(
    bullets: List[str],
    marketplace: str,
) -> List[str]:
    limits = get_text_limits(marketplace)
    max_count = limits["bullet_max_count"]
    max_chars = limits["bullet_max_chars"]

    result: List[str] = []
    for item in bullets[:max_count]:
        cleaned = clamp_text_for_marketplace(str(item), marketplace, "bullet")
        if cleaned:
            result.append(cleaned)

    return result


# =========================================================
# TYPOGRAPHY
# =========================================================

def get_font_profile(marketplace: str) -> Dict[str, str]:
    profile = get_marketplace_profile(marketplace)
    return profile.get("font_profile", {
        "headline": "bold_commercial",
        "subheadline": "clean_sans",
        "badge": "bold_caps",
        "bullets": "strong_ui",
        "specs": "compact_ui",
    })


# =========================================================
# COMPOSITION RULES
# =========================================================

def get_composition_rules(marketplace: str) -> Dict[str, Any]:
    profile = get_marketplace_profile(marketplace)
    return {
        "product_focus": profile.get("product_focus", "high"),
        "product_min_coverage": profile.get("product_min_coverage", 0.25),
        "product_max_coverage": profile.get("product_max_coverage", 0.55),
        "allow_large_hero_object": profile.get("allow_large_hero_object", True),
        "allow_dense_specs": profile.get("allow_dense_specs", True),
        "background_intensity": profile.get("background_intensity", "medium"),
        "text_density": profile.get("text_density", "medium"),
        "accent_strength": profile.get("accent_strength", "medium"),
    }


def get_slide_rule(marketplace: str, slide_type: str) -> Dict[str, Any]:
    profile = get_marketplace_profile(marketplace)
    slide_rules = profile.get("slide_rules", {})
    return slide_rules.get(slide_type, {
        "preferred_layouts": ["hero_center_large"],
        "max_bullets": 3,
        "headline_priority": "high",
        "product_priority": "high",
        "background_priority": "medium",
    })


def get_preferred_layouts(marketplace: str, slide_type: str) -> List[str]:
    rule = get_slide_rule(marketplace, slide_type)
    return rule.get("preferred_layouts", ["hero_center_large"])


def get_max_bullets_for_slide(marketplace: str, slide_type: str) -> int:
    rule = get_slide_rule(marketplace, slide_type)
    return int(rule.get("max_bullets", 3))# =========================================================
# CATEGORY BIAS
# =========================================================

def get_category_bias(marketplace: str, category_type: str) -> Dict[str, str]:
    profile = get_marketplace_profile(marketplace)
    category_bias = profile.get("category_bias", {})
    return category_bias.get(category_type, category_bias.get("general", {
        "style": "commercial_universal",
        "background": "clean_dynamic",
        "accent_palette": "brand_flexible",
    }))


def resolve_visual_strategy(
    marketplace: str,
    category_type: str,
    slide_type: str,
) -> Dict[str, Any]:
    profile = get_marketplace_profile(marketplace)
    slide_rule = get_slide_rule(marketplace, slide_type)
    category_bias = get_category_bias(marketplace, category_type)
    composition = get_composition_rules(marketplace)

    return {
        "marketplace": profile["code"],
        "style_bias": profile["style_bias"],
        "design_tone": profile["design_tone"],
        "visual_priority": profile["visual_priority"],
        "category_style": category_bias.get("style", "commercial_universal"),
        "category_background": category_bias.get("background", "clean_dynamic"),
        "accent_palette": category_bias.get("accent_palette", "brand_flexible"),
        "preferred_layouts": slide_rule.get("preferred_layouts", ["hero_center_large"]),
        "max_bullets": slide_rule.get("max_bullets", 3),
        "product_focus": composition.get("product_focus", "high"),
        "product_min_coverage": composition.get("product_min_coverage", 0.25),
        "product_max_coverage": composition.get("product_max_coverage", 0.55),
        "background_intensity": composition.get("background_intensity", "medium"),
        "text_density": composition.get("text_density", "medium"),
        "accent_strength": composition.get("accent_strength", "medium"),
    }


# =========================================================
# VALIDATION / NORMALIZATION
# =========================================================

def normalize_marketplace(marketplace: str) -> str:
    key = (marketplace or DEFAULT_MARKETPLACE).strip().lower()
    if key in MARKETPLACE_PROFILES:
        return key
    return DEFAULT_MARKETPLACE


def normalize_language_for_marketplace(marketplace: str, language_mode: str) -> str:
    profile = get_marketplace_profile(marketplace)
    supported = profile.get("supported_languages", ["ru"])
    lang = (language_mode or profile.get("default_language", "ru")).strip().lower()

    if lang not in supported:
        return profile.get("default_language", "ru")

    return lang


def validate_slide_type(marketplace: str, slide_type: str) -> str:
    profile = get_marketplace_profile(marketplace)
    slide_rules = profile.get("slide_rules", {})
    if slide_type in slide_rules:
        return slide_type
    return "hero"


# =========================================================
# RUNTIME HELPERS
# =========================================================

def prepare_slide_payload_for_marketplace(
    marketplace: str,
    slide_type: str,
    headline: str,
    subheadline: str,
    bullets: List[str],
) -> Dict[str, Any]:
    slide_type = validate_slide_type(marketplace, slide_type)

    return {
        "type": slide_type,
        "headline": clamp_text_for_marketplace(headline, marketplace, "headline"),
        "subheadline": clamp_text_for_marketplace(subheadline, marketplace, "subheadline"),
        "bullets": clamp_bullets_for_marketplace(
            bullets[:get_max_bullets_for_slide(marketplace, slide_type)],
            marketplace,
        ),
    }


def build_runtime_profile(
    marketplace: str,
    category_type: str,
    slide_type: str,
    language_mode: str,
) -> Dict[str, Any]:
    marketplace = normalize_marketplace(marketplace)
    language_mode = normalize_language_for_marketplace(marketplace, language_mode)
    slide_type = validate_slide_type (marketplace, slide_type) 
    base_profile = get_marketplace_profile(marketplace)
    safe_zone = get_safe_zone(marketplace)
    text_limits = get_text_limits(marketplace)
    font_profile = get_font_profile(marketplace)
    visual_strategy = resolve_visual_strategy(
        marketplace=marketplace,
        category_type=category_type,
        slide_type=slide_type,
    )

    return {
        "marketplace": marketplace,
        "language_mode": language_mode,
        "width": base_profile["width"],
        "height": base_profile["height"],
        "ratio": base_profile["ratio"],
        "safe_zone": safe_zone,
        "text_limits": text_limits,
        "font_profile": font_profile,
        "visual_strategy": visual_strategy,
        "content_box": get_content_box(marketplace),
    }


# =========================================================
# DEBUG / EXPORT HELPERS
# =========================================================

def list_available_marketplaces() -> List[str]:
    return list(MARKETPLACE_PROFILES.keys())


def export_profile_summary(marketplace: str) -> Dict[str, Any]:
    profile = get_marketplace_profile(marketplace)
    return {
        "name": profile["name"],
        "code": profile["code"],
        "size": {
            "width": profile["width"],
            "height": profile["height"],
            "ratio": profile["ratio"],
        },
        "safe_zone": get_safe_zone(marketplace),
        "supported_languages": profile.get("supported_languages", ["ru"]),
        "style_bias": profile.get("style_bias", "bold_marketplace"),
        "design_tone": profile.get("design_tone", "commercial"),
        "text_limits": get_text_limits(marketplace),
    }