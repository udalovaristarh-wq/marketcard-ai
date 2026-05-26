from __future__ import annotations

from pathlib import Path
from typing import Dict, Tuple, List

from PIL import Image, ImageDraw, ImageFont, ImageFilter

from app.services.ai_background_provider import generate_ai_background
from app.services.ai_cutout_provider import ai_cutout_product
from app.services.layout_ai import build_layout
from app.services.asset_registry import build_design_pack
from app.services.infographics_ai import (
    draw_info_badge,
    draw_bottom_feature_panel,
    draw_feature_card,
    draw_specs_grid,
)


MARKETPLACE_SIZES = {
    "uzum": (1080, 1440),
    "wildberries": (900, 1200),
    "ozon": (1200, 1600),
    "yandex": (1000, 1000),
}


BAD_BADGES = {"APL", "TOP", "INFO", "QUALITY", "КАЧЕСТВО", "ПРИМЕНЕНИЕ"}
BAD_LINES = {
    "надёжный выбор • сильный визуал • готово к публикации",
    "удобно использовать • понятное управление • готово к продажам",
    "готово к публикации",
    "сильный визуал",
    "аккуратная подача",
    "премиальная подача",
}


def get_canvas_size(marketplace: str) -> Tuple[int, int]:
    return MARKETPLACE_SIZES.get(str(marketplace).lower(), (1080, 1440))


def get_font(size: int, bold: bool = False):
    candidates = []
    if bold:
        candidates += [
            "C:/Windows/Fonts/arialbd.ttf",
            "C:/Windows/Fonts/segoeuib.ttf",
            "arialbd.ttf",
        ]
    else:
        candidates += [
            "C:/Windows/Fonts/arial.ttf",
            "C:/Windows/Fonts/segoeui.ttf",
            "arial.ttf",
        ]

    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue

    return ImageFont.load_default()


def rounded_panel(
    draw: ImageDraw.ImageDraw,
    box,
    fill,
    outline=None,
    radius: int = 24,
    width: int = 1,
):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def crop_transparent_bounds(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if bbox:
        return img.crop(bbox)
    return img


def fit_product(product_img: Image.Image, max_w: int, max_h: int) -> Image.Image:
    img = product_img.copy()
    img.thumbnail((max_w, max_h), Image.LANCZOS)
    return img


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font, max_width: int) -> List[str]:
    words = str(text or "").split()
    if not words:
        return [""]

    lines: List[str] = []
    current = words[0]

    for word in words[1:]:
        trial = f"{current} {word}"
        bbox = draw.textbbox((0, 0), trial, font=font)
        width = bbox[2] - bbox[0]

        if width <= max_width:
            current = trial
        else:
            lines.append(current)
            current = word

    lines.append(current)
    return lines


def draw_text_block(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    text: str,
    font,
    fill,
    max_width: int,
    line_gap: int = 8,
    max_lines: int | None = None,
    shadow: bool = False,
) -> int:
    lines = wrap_text(draw, text, font, max_width)
    if max_lines is not None:
        lines = lines[:max_lines]

    current_y = y
    for line in lines:
        if shadow:
            draw.text((x + 2, current_y + 2), line, fill=(0, 0, 0, 150), font=font)
        draw.text((x, current_y), line, fill=fill, font=font)
        bbox = draw.textbbox((x, current_y), line, font=font)
        line_h = bbox[3] - bbox[1]
        current_y += line_h + line_gap

    return current_y


def fit_multiline_font(
    draw: ImageDraw.ImageDraw,
    text: str,
    max_width: int,
    start_size: int,
    min_size: int,
    bold: bool = False,
    max_lines: int = 3,
):
    for size in range(start_size, min_size - 1, -2):
        font = get_font(size, bold=bold)
        lines = wrap_text(draw, text, font, max_width)
        if len(lines) <= max_lines:
            return font, lines
    font = get_font(min_size, bold=bold)
    return font, wrap_text(draw, text, font, max_width)[:max_lines]
def safe_list(items, max_count=4) -> List[str]:
    if not isinstance(items, list):
        return []
    result = []
    for item in items:
        value = str(item).strip()
        if not value:
            continue
        if value.lower() in BAD_LINES:
            continue
        result.append(value)
        if len(result) >= max_count:
            break
    return result


def add_glow_circle(img: Image.Image, center, radius, color, blur=90):
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    x, y = center
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)
    glow = glow.filter(ImageFilter.GaussianBlur(blur))
    img.alpha_composite(glow)


def add_light_streak(img: Image.Image, y: int, color, thickness: int = 4, blur: int = 18):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle(
        (80, y, img.size[0] - 80, y + thickness),
        radius=max(2, thickness // 2),
        fill=color,
    )
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    img.alpha_composite(layer)


def add_corner_vignette(img: Image.Image, opacity: int = 120):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    w, h = img.size

    draw.ellipse((-w * 0.35, -h * 0.25, w * 0.45, h * 0.55), fill=(0, 0, 0, opacity))
    draw.ellipse((w * 0.55, -h * 0.25, w * 1.35, h * 0.55), fill=(0, 0, 0, opacity))
    draw.ellipse((-w * 0.35, h * 0.45, w * 0.45, h * 1.25), fill=(0, 0, 0, opacity))
    draw.ellipse((w * 0.55, h * 0.45, w * 1.35, h * 1.25), fill=(0, 0, 0, opacity))
    overlay = overlay.filter(ImageFilter.GaussianBlur(140))
    img.alpha_composite(overlay)


def add_product_shadow(
    image_rgba: Image.Image,
    blur: int = 32,
    offset=(18, 28),
    opacity: int = 150,
) -> Image.Image:
    pad = 140
    result = Image.new(
        "RGBA",
        (image_rgba.width + pad, image_rgba.height + pad),
        (0, 0, 0, 0),
    )

    alpha = image_rgba.split()[-1]
    shadow_mask = Image.new("L", image_rgba.size, 0)
    shadow_mask.paste(alpha, (0, 0))
    shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(blur))

    shadow_layer = Image.new("RGBA", result.size, (0, 0, 0, 0))
    shadow_layer.paste(
        (0, 0, 0, opacity),
        (60 + offset[0], 60 + offset[1]),
        shadow_mask,
    )

    result.alpha_composite(shadow_layer)
    result.alpha_composite(image_rgba, (60, 60))
    return result


def add_product_glow(product_img: Image.Image, color=(0, 190, 255, 120), blur=28) -> Image.Image:
    glow = Image.new("RGBA", product_img.size, (0, 0, 0, 0))
    alpha = product_img.split()[-1]
    glow.paste(color, (0, 0), alpha)
    glow = glow.filter(ImageFilter.GaussianBlur(blur))

    out = Image.new("RGBA", product_img.size, (0, 0, 0, 0))
    out.alpha_composite(glow)
    out.alpha_composite(product_img)
    return out


def style_config(style_name: str):
    presets = {
        "tech_blue": {
            "accent": (0, 210, 255, 255),
            "accent2": (82, 140, 255, 255),
            "accent3": (255, 180, 30, 255),
            "headline": (255, 255, 255),
            "subheadline": (220, 235, 255),
            "panel": (255, 255, 255, 22),
            "panel_outline": (255, 255, 255, 46),
            "chip_dark": (8, 18, 32, 190),
            "badge_fill": (0, 180, 255, 255),
        },
        "sunset_orange": {
            "accent": (255, 145, 0, 255),
            "accent2": (255, 210, 0, 255),
            "accent3": (0, 200, 255, 255),
            "headline": (255, 255, 255),
            "subheadline": (255, 233, 215),
            "panel": (255, 255, 255, 20),
            "panel_outline": (255, 255, 255, 44),
            "chip_dark": (30, 16, 8, 185),"badge_fill": (255, 140, 0, 255),
        },
        "emerald_dark": {
            "accent": (35, 220, 120, 255),
            "accent2": (0, 210, 255, 255),
            "accent3": (255, 220, 0, 255),
            "headline": (255, 255, 255),
            "subheadline": (222, 255, 235),
            "panel": (255, 255, 255, 20),
            "panel_outline": (255, 255, 255, 44),
            "chip_dark": (8, 24, 18, 190),
            "badge_fill": (35, 220, 120, 255),
        },
    }
    return presets.get(style_name, presets["tech_blue"])


def choose_style_name(copy_data: Dict, variant_index: int) -> str:
    category_type = str(copy_data.get("category_type", "general"))
    scene_style = str(copy_data.get("scene_style", "")).lower()

    if "sport" in scene_style:
        styles = ["tech_blue", "sunset_orange", "tech_blue"]
    elif "home" in scene_style or "cozy" in scene_style:
        styles = ["emerald_dark", "sunset_orange", "tech_blue"]
    elif category_type == "electronics":
        styles = ["tech_blue", "sunset_orange", "emerald_dark"]
    elif category_type == "auto":
        styles = ["sunset_orange", "tech_blue", "emerald_dark"]
    else:
        styles = ["tech_blue", "emerald_dark", "sunset_orange"]

    return styles[variant_index % len(styles)]


def draw_big_badge(draw, x, y, text, font, fill_bg, fill_text=(255, 255, 255)):
    if not text or text.upper() in BAD_BADGES:
        return None
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    box = (x, y, x + w + 34, y + h + 24)
    rounded_panel(draw, box, fill=fill_bg, radius=22)
    draw.text((x + 17, y + 10), text, font=font, fill=fill_text)
    return box


def draw_side_feature_stack(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    width: int,
    items: List[str],
    title_font,
    sub_font,
    accent_fill,
    panel_fill,
    panel_outline,
    scale: float,
):
    card_h = int(126 * scale)
    gap = int(18 * scale)

    for idx, item in enumerate(items[:3]):
        cy = y + idx * (card_h + gap)
        rounded_panel(
            draw,
            (x, cy, x + width, cy + card_h),
            fill=panel_fill,
            outline=panel_outline,
            radius=int(24 * scale),
            width=1,
        )

        icon_box = (
            x + int(20 * scale),
            cy + int(24 * scale),
            x + int(74 * scale),
            cy + int(78 * scale),
        )
        draw.ellipse(icon_box, fill=accent_fill)

        draw_text_block(
            draw,
            x + int(95 * scale),
            cy + int(18 * scale),
            item,
            title_font,
            (255, 255, 255),
            max_width=width - int(115 * scale),
            line_gap=int(4 * scale),
            max_lines=2,
            shadow=True,
        )

        draw.text(
            (x + int(95 * scale), cy + int(78 * scale)),
            "Ключевая функция",
            fill=(210, 224, 245),
            font=sub_font,
        )


def draw_bottom_offer_bar(
    draw: ImageDraw.ImageDraw,
    width: int,
    height: int,
    text: str,
    font,
    accent_fill,
    scale: float,
):
    if not text or text.lower() in BAD_LINES:
        return

    box_h = int(112 * scale)
    x1 = int(58 * scale)
    y1 = height - box_h - int(40 * scale)
    x2 = width - int(58 * scale)
    y2 = height - int(28 * scale)

    rounded_panel(
        draw,
        (x1, y1, x2, y2),
        fill=(8, 14, 24, 150),
        outline=(255, 255, 255, 45),
        radius=int(28 * scale),
        width=1,
    )

    draw_text_block(
        draw,
        x1 + int(28 * scale),
        y1 + int(20 * scale),
        text,
        font,
        (255, 255, 255),
        max_width=(x2 - x1) - int(56 * scale),
        line_gap=int(2 * scale),
        max_lines=2,
        shadow=True,
    )

    draw.rectangle(
        (x1, y2 - int(8 * scale), x2, y2),
        fill=accent_fill,
    )


def scene_overlays(bg: Image.Image, cfg: Dict, slide_type: str, scene_style: str, scale: float):
    w, h = bg.size
    add_glow_circle(bg, (int(w * 0.82), int(h * 0.20)), int(260 * scale), cfg["accent"], blur=int(120 * scale))
    add_glow_circle(bg, (int(w * 0.18), int(h * 0.78)), int(240 * scale), cfg["accent3"], blur=int(110 * scale))
    add_glow_circle(bg, (int(w * 0.52), int(h * 0.48)), int(170 * scale), cfg["accent2"], blur=int(85 * scale))

    if "sport" in scene_style or slide_type == "hero":
        add_light_streak(bg, int(h * 0.19), cfg["accent"], thickness=max(3, int(4 * scale)), blur=int(18 * scale))
        add_light_streak(bg, int(h * 0.86), cfg["accent2"], thickness=max(3, int(4 * scale)), blur=int(20 * scale))

    add_corner_vignette(bg, opacity=105)


def render_card(
    product_image: str,
    output_path: str,
    copy_data: Dict,
    brand: str,
    marketplace: str,
    style_name: str,
    variant_index: int,
):
    width, height = get_canvas_size(marketplace)
    scale = width / 1080.0

    effective_style = choose_style_name(copy_data, variant_index)
    base_cfg = style_config(effective_style)

    design = build_design_pack(
        title=str(copy_data.get("headline", "")),
        category=str(copy_data.get("category_type", "")),
        slide_type=str(copy_data.get("slide_type", "hero")),
        seed=variant_index,
    )

    palette = design["palette"]
    cfg = {
        "accent": getattr(palette, "accent", base_cfg["accent"]),
        "accent2": getattr(palette, "accent2", base_cfg["accent2"]),
        "accent3": getattr(palette, "accent3", base_cfg["accent3"]),
        "headline": getattr(palette, "headline", base_cfg["headline"]),
        "subheadline": getattr(palette, "subheadline", base_cfg["subheadline"]),
        "panel": getattr(palette, "panel", base_cfg["panel"]),
        "panel_outline": getattr(palette, "panel_outline", base_cfg["panel_outline"]),
        "chip_dark": getattr(palette, "chip_dark", base_cfg["chip_dark"]),
        "badge_fill": base_cfg["badge_fill"],
    }

    profile = {
        "shape": str(copy_data.get("shape", "compact")),
        "visual_size": str(copy_data.get("visual_size", "medium")),
        "position_bias": str(copy_data.get("position_bias", "centered")),
        "category_type": str(copy_data.get("category_type", "general")),
    }

    slide_type = str(copy_data.get("slide_type", "hero"))
    scene_style = str(copy_data.get("scene_style", ""))

    layout = build_layout(
        width=width,
        height=height,
        slide_type=slide_type,
        profile=profile,
    )

    headline = str(copy_data.get("headline", "")).strip()
    subheadline = str(copy_data.get("subheadline", "")).strip()
    badge = str(copy_data.get("badge", "")).strip()
    benefits = safe_list(copy_data.get("benefits", []), max_count=4)
    specs = safe_list(copy_data.get("specs", []), max_count=4)

    if not benefits:
        benefits = [
            "Высокое качество",
            "Продуманная конструкция",
            "Удобное использование",
        ]

    if not specs:
        specs = [
            f"Бренд: {brand}" if brand else "Бренд: Premium",
            "Новый товар",
            "Качественные материалы",
        ]

    bg = generate_ai_background(
        size=(width, height),
        title=headline,
        category=copy_data.get("category_type", ""),
        scene=design["scene"],
        seed=variant_index,
    )

    if bg.mode != "RGBA":
        bg = bg.convert("RGBA")

    scene_overlays(bg, cfg, slide_type, scene_style, scale)
    draw = ImageDraw.Draw(bg)

    outer_pad = int(26 * scale)
    rounded_panel(
        draw,
        (outer_pad, outer_pad, width - outer_pad, height - outer_pad),
        fill=cfg["panel"],
        outline=cfg["panel_outline"],
        radius=int(32 * scale),
        width=max(1, int(2 * scale)),
    )

    content_x = layout.get("content_x", int(72 * scale))
    content_top = layout.get("content_top", int(72 * scale))
    content_width = layout.get("content_width", int(width * 0.40))
    headline_font, headline_lines = fit_multiline_font(
        draw,
        headline,
        max_width=content_width,
        start_size=max(34, int(76 * scale)),
        min_size=max(20, int(42 * scale)),
        bold=True,
        max_lines=3,
    )
    subheadline_font, _ = fit_multiline_font(
        draw,
        subheadline,
        max_width=content_width,
        start_size=max(18, int(30 * scale)),
        min_size=max(12, int(18 * scale)),
        bold=False,
        max_lines=2,
    )

    badge_font = get_font(max(14, int(22 * scale)), bold=True)
    feature_font = get_font(max(17, int(27 * scale)), bold=True)
    small_font = get_font(max(12, int(15 * scale)), bold=False)
    offer_font = get_font(max(18, int(32 * scale)), bold=True)
    chip_font = get_font(max(13, int(20 * scale)), bold=True)

    draw_big_badge(
        draw,
        width - int(250 * scale),
        int(62 * scale),
        badge,
        badge_font,
        cfg["badge_fill"],
    )

    headline_end_y = draw_text_block(
        draw,
        content_x,
        content_top,
        " ".join(headline_lines),
        headline_font,
        cfg["headline"],
        max_width=content_width,
        line_gap=int(4 * scale),
        max_lines=3,
        shadow=True,
    )

    sub_end_y = headline_end_y
    if subheadline:
        sub_end_y = draw_text_block(
            draw,
            content_x,
            headline_end_y + int(8 * scale),
            subheadline,
            subheadline_font,
            cfg["subheadline"],
            max_width=content_width,
            line_gap=int(4 * scale),
            max_lines=2,
            shadow=True,
        )

    try:
        product = ai_cutout_product(product_image)
        if isinstance(product, str):
            product = Image.open(product).convert("RGBA")
        elif isinstance(product, Image.Image):
            product = product.convert("RGBA")
        else:
            product = Image.open(product_image).convert("RGBA")
    except Exception:
        product = Image.open(product_image).convert("RGBA")

    product = crop_transparent_bounds(product)

    if slide_type == "hero":
        default_box = (int(width * 0.58), int(height * 0.58))
    elif slide_type in {"benefits", "usage"}:
        default_box = (int(width * 0.50), int(height * 0.50))
    else:
        default_box = (int(width * 0.42), int(height * 0.40))

    product_box = layout.get("product_box", default_box)
    if isinstance(product_box, (list, tuple)) and len(product_box) >= 2:
        max_product_w = int(product_box[0])
        max_product_h = int(product_box[1])
    else:
        max_product_w, max_product_h = default_box

    product = fit_product(product, max_product_w, max_product_h)
    product = add_product_glow(product, color=cfg["accent"], blur=int(18 * scale))
    product_with_shadow = add_product_shadow(product, blur=int(28 * scale))

    shadow_w, shadow_h = product_with_shadow.size

    product_position = layout.get("product_position")
    if isinstance(product_position, (list, tuple)) and len(product_position) >= 2:
        px = int(product_position[0])
        py = int(product_position[1])
    else:
        if slide_type == "hero":
            px = int(width * 0.34)
            py = int(height * 0.18)
        elif slide_type == "benefits":
            px = int(width * 0.48)
            py = int(height * 0.26)
        elif slide_type == "usage":
            px = int(width * 0.10)
            py = int(height * 0.28)
        else:
            px = int(width * 0.48)
            py = int(height * 0.22)

    px = max(0, min(px, width - shadow_w))
    py = max(0, min(py, height - shadow_h))
    bg.alpha_composite(product_with_shadow, (px, py))

    if slide_type == "hero":
        panel_box = (
            int(58 * scale),int(height * 0.73),
            width - int(58 * scale),
            int(height * 0.92),
        )
        draw_bottom_feature_panel(
            draw,
            panel_box=panel_box,
            items=benefits[:3],
            title="Преимущества",
            title_font=chip_font,
            item_font=chip_font,
            accent_fill=cfg["accent"],
        )

    elif slide_type == "benefits":
        side_x = int(54 * scale)
        side_y = max(sub_end_y + int(18 * scale), int(height * 0.28))
        side_w = int(width * 0.38)
        draw_side_feature_stack(
            draw=draw,
            x=side_x,
            y=side_y,
            width=side_w,
            items=benefits,
            title_font=feature_font,
            sub_font=small_font,
            accent_fill=cfg["accent"],
            panel_fill=(255, 255, 255, 20),
            panel_outline=(255, 255, 255, 44),
            scale=scale,
        )

    elif slide_type == "specs":
        panel_y = int(height * 0.72)
        panel_h = int(198 * scale)
        rounded_panel(
            draw,
            (int(56 * scale), panel_y, width - int(56 * scale), panel_y + panel_h),
            fill=(8, 16, 26, 150),
            outline=(255, 255, 255, 46),
            radius=int(26 * scale),
            width=1,
        )

        grid_x = int(84 * scale)
        grid_y = panel_y + int(26 * scale)
        col_w = int((width - 2 * 84 * scale - 18 * scale) / 2)
        row_h = int(56 * scale)

        draw_specs_grid(
            draw,
            x=grid_x,
            y=grid_y,
            col_w=col_w,
            row_h=row_h,
            items=specs,
            title_font=chip_font,
            accent_fill=cfg["accent"],
            dark_fill=cfg["chip_dark"],
        )

    elif slide_type == "usage":
        chip_x = int(width * 0.54)
        chip_y = max(int(height * 0.22), sub_end_y + int(20 * scale))
        for feature in benefits[:3]:
            draw_info_badge(
                draw,
                chip_x,
                chip_y,
                feature,
                chip_font,
                cfg["chip_dark"],
                text_fill=(255, 255, 255),
                radius=int(18 * scale),
                pad_x=int(15 * scale),
                pad_y=int(9 * scale),
            )
            chip_y += int(58 * scale)

    elif slide_type == "compatibility":
        side_x = int(58 * scale)
        side_y = int(height * 0.67)
        side_w = width - int(116 * scale)

        rounded_panel(
            draw,
            (side_x, side_y, side_x + side_w, side_y + int(180 * scale)),
            fill=(12, 18, 28, 150),
            outline=(255, 255, 255, 50),
            radius=int(24 * scale),
            width=1,
        )

        draw_specs_grid(
            draw,
            x=side_x + int(24 * scale),
            y=side_y + int(26 * scale),
            col_w=int((side_w - int(60 * scale)) / 2),
            row_h=int(56 * scale),
            items=benefits[:4],
            title_font=chip_font,
            accent_fill=cfg["accent"],
            dark_fill=cfg["chip_dark"],
        )

    elif slide_type == "trust":
        draw_bottom_offer_bar(
            draw,
            width,
            height,
            "Стабильное качество • Надёжная подача • Аккуратный визуал",
            offer_font,
            cfg["accent2"],
            scale,
        )

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    bg.save(output_path, "PNG")