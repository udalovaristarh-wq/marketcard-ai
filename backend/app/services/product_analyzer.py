from __future__ import annotations

from typing import Any
from PIL import Image


def detect_category_type(category: str, title: str) -> str:
    text = f"{category} {title}".lower()

    auto_keys = [
        "auto", "авто", "запчаст", "амортиз", "насос", "датчик",
        "тормоз", "фильтр", "подшип", "стойка", "ремень",
        "spark", "cobalt", "malibu", "tracker", "nexia", "matiz",
        "lacetti", "captiva", "damas", "gentra", "ravon",
        "chevrolet", "daewoo",
    ]

    electronics_keys = [
        "науш", "bluetooth", "usb", "speaker", "headphone",
        "earbuds", "microphone", "monitor", "laptop", "adapter",
        "ssd", "мыш", "клав", "телефон", "смарт",
    ]

    beauty_keys = [
        "beauty", "космет", "крем", "сыворот", "маска", "уход",
        "парфюм", "шампун", "hair", "skin",
    ]

    home_keys = [
        "home", "дом", "кухн", "посуда", "органайзер",
        "коврик", "подушка", "полка", "контейнер",
    ]

    tools_keys = [
        "tool", "инструм", "дрель", "шурупов", "ключ",
        "отверт", "молоток", "ремонт", "строит",
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


def detect_shape(obj_w: int, obj_h: int) -> str:
    if obj_h <= 0:
        return "compact"

    ratio = obj_w / obj_h

    if ratio < 0.72:
        return "vertical"
    if ratio > 1.28:
        return "horizontal"
    return "compact"


def detect_visual_size(fill_ratio: float) -> str:
    if fill_ratio < 0.12:
        return "small"
    if fill_ratio < 0.32:
        return "medium"
    return "large"


def detect_complexity(obj_w: int, obj_h: int, fill_ratio: float) -> str:
    area = obj_w * obj_h

    if area < 120_000 or fill_ratio < 0.10:
        return "low"
    if area < 420_000 or fill_ratio < 0.28:
        return "medium"
    return "high"


def detect_text_density(category_type: str) -> str:
    if category_type == "auto":
        return "medium"
    if category_type == "electronics":
        return "medium"
    if category_type == "tools":
        return "medium"
    return "low"


def get_object_bbox(img: Image.Image) -> tuple[int, int, int, int]:
    bbox = img.getbbox()
    if bbox:
        return bbox
    return (0, 0, img.width, img.height)


def get_object_center(bbox: tuple[int, int, int, int]) -> tuple[int, int]:
    left, top, right, bottom = bbox
    cx = left + (right - left) // 2
    cy = top + (bottom - top) // 2
    return cx, cy


def detect_position_bias(
    img_w: int,
    img_h: int,
    center_x: int,
    center_y: int,
) -> str:
    x_ratio = center_x / max(1, img_w)
    y_ratio = center_y / max(1, img_h)

    if x_ratio < 0.38:
        return "left_bias"
    if x_ratio > 0.62:
        return "right_bias"
    if y_ratio < 0.38:
        return "top_bias"
    if y_ratio > 0.68:
        return "bottom_bias"

    return "centered"


def extract_dominant_color(img: Image.Image) -> tuple[int, int, int]:
    work = img.convert("RGBA").copy()
    work.thumbnail((120, 120))

    pixels = list(work.getdata())

    rgb_pixels = []
    for p in pixels:
        if len(p) == 4:
            r, g, b, a = p
            if a < 25:
                continue
            rgb_pixels.append((r, g, b))
        else:
            rgb_pixels.append(p[:3])

    if not rgb_pixels:
        return (80, 120, 180)

    buckets: dict[tuple[int, int, int], int] = {}
    for r, g, b in rgb_pixels:
        key = (r // 32 * 32, g // 32 * 32, b // 32 * 32)
        buckets[key] = buckets.get(key, 0) + 1

    dominant = max(buckets.items(), key=lambda x: x[1])[0]
    return dominant


def classify_brightness(color: tuple[int, int, int]) -> str:
    r, g, b = color

    brightness = (r * 299 + g * 587 + b * 114) / 1000
    if brightness < 70:
        return "dark"
    if brightness > 190:
        return "light"
    return "medium"


def suggest_palette(
    category_type: str,
    dominant_color: tuple[int, int, int],
    brightness: str,
) -> str:
    r, g, b = dominant_color

    if category_type == "auto":
        if b >= r and b >= g:
            return "tech_blue"
        if r > 150 and g > 100:
            return "sunset_orange"
        return "emerald_dark"

    if category_type == "electronics":
        if brightness == "dark":
            return "tech_blue"
        return "sunset_orange"

    if brightness == "light":
        return "emerald_dark"

    return "tech_blue"


def analyze_product(
    title: str,
    category: str,
    image_width: int,
    image_height: int,
    image_path: str | None = None,
) -> dict[str, Any]:
    category_type = detect_category_type(category, title)

    bbox = (0, 0, image_width, image_height)
    dominant_color = (80, 120, 180)

    if image_path:
        try:
            img = Image.open(image_path).convert("RGBA")
            bbox = get_object_bbox(img)
            dominant_color = extract_dominant_color(img)
        except Exception:
            bbox = (0, 0, image_width, image_height)

    left, top, right, bottom = bbox
    obj_w = max(1, right - left)
    obj_h = max(1, bottom - top)
    obj_area = obj_w * obj_h
    full_area = max(1, image_width * image_height)
    fill_ratio = obj_area / full_area

    center_x, center_y = get_object_center(bbox)

    shape = detect_shape(obj_w, obj_h)
    visual_size = detect_visual_size(fill_ratio)
    complexity = detect_complexity(obj_w, obj_h, fill_ratio)
    text_density = detect_text_density(category_type)
    position_bias = detect_position_bias(image_width, image_height, center_x, center_y)
    brightness = classify_brightness(dominant_color)
    suggested_style = suggest_palette(category_type, dominant_color, brightness)

    return {
        "category_type": category_type,
        "shape": shape,
        "visual_size": visual_size,
        "complexity": complexity,
        "text_density": text_density,
        "image_width": image_width,
        "image_height": image_height,
        "bbox": {
            "left": left,
            "top": top,
            "right": right,
            "bottom": bottom,
            "width": obj_w,
            "height": obj_h,
        },
        "center": {
            "x": center_x,
            "y": center_y,
        },
        "fill_ratio": round(fill_ratio, 4),
        "position_bias": position_bias,
        "dominant_color": {
            "r": dominant_color[0],
            "g": dominant_color[1],
            "b": dominant_color[2],
        },
        "brightness": brightness,
        "suggested_style": suggested_style,
        "recommended_zoom": (
            1.22 if visual_size == "small"
            else 1.08 if visual_size == "medium"
            else 1.0
        ),
    }