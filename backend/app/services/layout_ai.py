from __future__ import annotations

from typing import Any


def clamp(value: int, min_value: int, max_value: int) -> int:
    return max(min_value, min(value, max_value))


def build_layout(
    width: int,
    height: int,
    slide_type: str,
    profile: dict[str, Any],
) -> dict[str, Any]:
    scale = width / 1080.0

    shape = str(profile.get("shape", "compact"))
    visual_size = str(profile.get("visual_size", "medium"))
    position_bias = str(profile.get("position_bias", "centered"))
    category_type = str(profile.get("category_type", "general"))

    if slide_type == "hero":
        return hero_layout(width, height, scale, shape, visual_size, position_bias)

    if slide_type == "benefits":
        return benefits_layout(width, height, scale, shape, visual_size, category_type)

    if slide_type == "details":
        return details_layout(width, height, scale, shape, visual_size)

    if slide_type == "specs":
        return specs_layout(width, height, scale, shape)

    if slide_type in ("package", "trust"):
        return trust_layout(width, height, scale, shape)

    return default_layout(width, height, scale)


def hero_layout(
    width: int,
    height: int,
    scale: float,
    shape: str,
    visual_size: str,
    position_bias: str,
) -> dict[str, Any]:
    if shape == "vertical":
        product_w = int(width * 0.42)
        product_h = int(height * 0.60)

        if visual_size == "small":
            product_w = int(product_w * 1.12)
            product_h = int(product_h * 1.12)

        px = int(width * 0.50)
        py = int(height * 0.16)

        if position_bias == "left_bias":
            px = int(width * 0.54)
        elif position_bias == "right_bias":
            px = int(width * 0.47)

        return {
            "name": "hero_vertical_right",
            "product_xy": (px, py),
            "product_box": (product_w, product_h),
            "content_x": int(72 * scale),
            "content_top": int(86 * scale),
            "content_width": int(width * 0.38),
            "benefits_mode": "stack_left",
        }

    if shape == "horizontal":
        product_w = int(width * 0.56)
        product_h = int(height * 0.40)

        if visual_size == "small":
            product_w = int(product_w * 1.10)
            product_h = int(product_h * 1.10)

        return {
            "name": "hero_horizontal_center",
            "product_xy": (int(width * 0.22), int(height * 0.34)),
            "product_box": (product_w, product_h),
            "content_x": int(72 * scale),
            "content_top": int(76 * scale),
            "content_width": int(width * 0.56),
            "benefits_mode": "bottom_grid",
        }

    product_w = int(width * 0.48)
    product_h = int(height * 0.54)

    if visual_size == "small":
        product_w = int(product_w * 1.15)
        product_h = int(product_h * 1.15)

    return {
        "name": "hero_compact_center",
        "product_xy": (int(width * 0.38), int(height * 0.24)),
        "product_box": (product_w, product_h),
        "content_x": int(72 * scale),
        "content_top": int(82 * scale),
        "content_width": int(width * 0.46),
        "benefits_mode": "chips",
    }


def benefits_layout(
    width: int,
    height: int,
    scale: float,
    shape: str,
    visual_size: str,
    category_type: str,
) -> dict[str, Any]:
    if category_type == "electronics":
        return {
            "name": "benefits_electronics",
            "product_xy": (int(width * 0.47), int(height * 0.23)),
            "product_box": (int(width * 0.40), int(height * 0.54)),
            "content_x": int(72 * scale),
            "content_top": int(78 * scale),
            "content_width": int(width * 0.42),
            "benefits_mode": "accent_cards",
        }

    if shape == "horizontal":return {
            "name": "benefits_horizontal",
            "product_xy": (int(width * 0.24), int(height * 0.28)),
            "product_box": (int(width * 0.52), int(height * 0.36)),
            "content_x": int(72 * scale),
            "content_top": int(80 * scale),
            "content_width": int(width * 0.54),
            "benefits_mode": "bottom_grid",
        }

    product_w = int(width * 0.42)
    product_h = int(height * 0.56)

    if visual_size == "small":
        product_w = int(product_w * 1.08)
        product_h = int(product_h * 1.08)

    return {
        "name": "benefits_left_cards",
        "product_xy": (int(width * 0.50), int(height * 0.21)),
        "product_box": (product_w, product_h),
        "content_x": int(72 * scale),
        "content_top": int(80 * scale),
        "content_width": int(width * 0.38),
        "benefits_mode": "left_cards",
    }


def details_layout(
    width: int,
    height: int,
    scale: float,
    shape: str,
    visual_size: str,
) -> dict[str, Any]:
    zoom_factor = 1.18 if visual_size == "small" else 1.0

    if shape == "horizontal":
        return {
            "name": "details_horizontal_zoom",
            "product_xy": (int(width * 0.20), int(height * 0.26)),
            "product_box": (
                int(width * 0.62 * zoom_factor),
                int(height * 0.44 * zoom_factor),
            ),
            "content_x": int(72 * scale),
            "content_top": int(80 * scale),
            "content_width": int(width * 0.52),
            "benefits_mode": "chips",
        }

    return {
        "name": "details_zoom_focus",
        "product_xy": (int(width * 0.42), int(height * 0.18)),
        "product_box": (
            int(width * 0.48 * zoom_factor),
            int(height * 0.62 * zoom_factor),
        ),
        "content_x": int(72 * scale),
        "content_top": int(78 * scale),
        "content_width": int(width * 0.38),
        "benefits_mode": "chips",
    }


def specs_layout(
    width: int,
    height: int,
    scale: float,
    shape: str,
) -> dict[str, Any]:
    if shape == "horizontal":
        return {
            "name": "specs_horizontal",
            "product_xy": (int(width * 0.26), int(height * 0.24)),
            "product_box": (int(width * 0.48), int(height * 0.34)),
            "content_x": int(72 * scale),
            "content_top": int(80 * scale),
            "content_width": int(width * 0.54),
            "benefits_mode": "bottom_grid",
        }

    return {
        "name": "specs_standard",
        "product_xy": (int(width * 0.50), int(height * 0.21)),
        "product_box": (int(width * 0.38), int(height * 0.50)),
        "content_x": int(72 * scale),
        "content_top": int(82 * scale),
        "content_width": int(width * 0.40),
        "benefits_mode": "bottom_grid",
    }


def trust_layout(
    width: int,
    height: int,
    scale: float,
    shape: str,
) -> dict[str, Any]:
    if shape == "horizontal":
        return {
            "name": "trust_horizontal",
            "product_xy": (int(width * 0.24), int(height * 0.24)),
            "product_box": (int(width * 0.52), int(height * 0.36)),
            "content_x": int(72 * scale),
            "content_top": int(80 * scale),
            "content_width": int(width * 0.56),
            "benefits_mode": "accent_cards",
        }

    return {
        "name": "trust_standard",
        "product_xy": (int(width * 0.48), int(height * 0.20)),
        "product_box": (int(width * 0.42), int(height * 0.54)),
        "content_x": int(72 * scale),
        "content_top": int(82 * scale),
        "content_width": int(width * 0.42),
        "benefits_mode": "accent_cards",
    }


def default_layout(width: int, height: int, scale: float) -> dict[str, Any]:
    return {
        "name": "default","product_xy": (int(width * 0.42), int(height * 0.24)),
        "product_box": (int(width * 0.44), int(height * 0.54)),
        "content_x": int(72 * scale),
        "content_top": int(80 * scale),
        "content_width": int(width * 0.44),
        "benefits_mode": "chips",
    }