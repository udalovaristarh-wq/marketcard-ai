from __future__ import annotations
from typing import Any
from PIL import Image, ImageDraw, ImageFont

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def _load_font(path: str, size: int):
    return ImageFont.truetype(path, size=size)

def _to_px(box: dict[str, float], w: int, h: int) -> tuple[int, int, int, int]:
    x = int(box["x"] * w)
    y = int(box["y"] * h)
    bw = int(box["w"] * w)
    bh = int(box["h"] * h)
    return x, y, bw, bh

def _wrap_text(draw, text: str, font, max_width: int):
    words = str(text or "").split()
    if not words:
        return []
    lines = []
    current = words[0]
    for word in words[1:]:
        test = current + " " + word
        bbox = draw.textbbox((0, 0), test, font=font)
        if (bbox[2] - bbox[0]) <= max_width:
            current = test
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines

def _fit_text(draw, text: str, box_w: int, box_h: int, bold: bool = False, max_size: int = 72, min_size: int = 18):
    font_path = FONT_BOLD if bold else FONT_REG
    for size in range(max_size, min_size - 1, -2):
        font = _load_font(font_path, size)
        lines = _wrap_text(draw, text, font, int(box_w * 0.94))
        line_h = int(size * 1.18)
        total_h = len(lines) * line_h
        if total_h <= int(box_h * 0.92):
            return font, lines, line_h
    font = _load_font(font_path, min_size)
    lines = _wrap_text(draw, text, font, int(box_w * 0.94))
    return font, lines, int(min_size * 1.18)

def _avg_brightness(img: Image.Image, box: tuple[int, int, int, int]) -> float:
    x, y, w, h = box
    crop = img.crop((x, y, x + w, y + h)).convert("L")
    hist = crop.histogram()
    total = sum(i * v for i, v in enumerate(hist))
    count = max(1, sum(hist))
    return total / count

def _pick_text_style(img: Image.Image, box: tuple[int, int, int, int], role: str):
    bright = _avg_brightness(img, box)

    if bright > 150:
        text_fill = (20, 24, 34, 255)
        plate_fill = (255, 255, 255, 40)
        accent_fill = (31, 98, 255, 220)
    else:
        text_fill = (255, 255, 255, 255)
        plate_fill = (8, 12, 18, 42)
        accent_fill = (70, 130, 255, 220)

    if role == "badge":
        plate_fill = (accent_fill[0], accent_fill[1], accent_fill[2], 120)

    return text_fill, plate_fill, accent_fill

def _draw_soft_plate(draw, box: tuple[int, int, int, int], fill):
    x, y, w, h = box
    draw.rounded_rectangle(
        (x, y, x + w, y + h),
        radius=max(10, int(min(w, h) * 0.08)),
        fill=fill,
    )

def _draw_lines(draw, x: int, y: int, lines: list[str], font, line_h: int, fill):
    cy = y
    for line in lines:
        draw.text((x, cy), line, font=font, fill=fill)
        cy += line_h

def render_card_v3(
    *,
    image_path: str,
    scene_layout: dict[str, Any],
    copy_data: dict[str, Any],
) -> str:
    img = Image.open(image_path).convert("RGBA")
    draw = ImageDraw.Draw(img)
    w, h = img.size

    zones = scene_layout["zones"]

    headline = str(copy_data.get("headline", "")).strip()
    subheadline = str(copy_data.get("subheadline", "")).strip()
    bullets = [str(x).strip() for x in copy_data.get("bullets", []) if str(x).strip()][:4]
    badge = str(copy_data.get("badge", "")).strip()

    # headline
    if headline:
        box = _to_px(zones["headline"], w, h)
        text_fill, plate_fill, accent_fill = _pick_text_style(img, box, "headline")
        _draw_soft_plate(draw, box, plate_fill)
        font, lines, line_h = _fit_text(draw, headline, box[2], box[3], bold=True, max_size=76, min_size=24)
        _draw_lines(draw, box[0] + int(box[2] * 0.04), box[1] + int(box[3] * 0.10), lines, font, line_h, text_fill)

    # subheadline
    if subheadline:
        box = _to_px(zones["subheadline"], w, h)
        text_fill, plate_fill, accent_fill = _pick_text_style(img, box, "subheadline")
        _draw_soft_plate(draw, box, plate_fill)
        font, lines, line_h = _fit_text(draw, subheadline, box[2], box[3], bold=False, max_size=42, min_size=18)
        _draw_lines(draw, box[0] + int(box[2] * 0.04), box[1] + int(box[3] * 0.14), lines, font, line_h, text_fill)

    # bullets
    if bullets:
        box = _to_px(zones["bullets"], w, h)
        text_fill, plate_fill, accent_fill = _pick_text_style(img, box, "bullets")

        x, y, bw, bh = box
        bullet_h = max(52, int(bh / max(3, len(bullets))))
        cy = y

        for item in bullets:
            row_box = (x, cy, bw, bullet_h - 8)
            _draw_soft_plate(draw, row_box, plate_fill)
            draw.rounded_rectangle(
                (x + 12, cy + 12, x + 30, cy + 30),
                radius=9,
                fill=accent_fill,
            )
            font, lines, line_h = _fit_text(draw, item, int(bw * 0.82), int((bullet_h - 8) * 0.72), bold=True, max_size=34, min_size=16)
            _draw_lines(draw, x + 42, cy + 10, lines, font, line_h, text_fill)
            cy += bullet_h

    # badge
    if badge:
        box = _to_px(zones["badge"], w, h)
        text_fill, plate_fill, accent_fill = _pick_text_style(img, box, "badge")
        _draw_soft_plate(draw, box, plate_fill)
        font, lines, line_h = _fit_text(draw, badge, box[2], box[3], bold=True, max_size=26, min_size=14)
        _draw_lines(draw, box[0] + int(box[2] * 0.10), box[1] + int(box[3] * 0.16), lines, font, line_h, (255, 255, 255, 255))

    img.save(image_path, "PNG")
    return image_path
