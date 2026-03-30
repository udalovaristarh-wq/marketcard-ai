from __future__ import annotations

from PIL import ImageDraw


def draw_info_badge(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    text: str,
    font,
    bg_fill,
    text_fill=(255, 255, 255),
    radius: int = 18,
    pad_x: int = 18,
    pad_y: int = 10,
):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]

    draw.rounded_rectangle(
        (x, y, x + w + pad_x * 2, y + h + pad_y * 2),
        radius=radius,
        fill=bg_fill,
    )
    draw.text((x + pad_x, y + pad_y - 1), text, font=font, fill=text_fill)
    return x + w + pad_x * 2, y + h + pad_y * 2


def draw_icon_point(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    size: int,
    accent_fill,
    inner_fill=(255, 255, 255),
):
    draw.ellipse((x, y, x + size, y + size), fill=accent_fill)
    inner = max(6, size // 3)
    offset = (size - inner) // 2
    draw.ellipse(
        (x + offset, y + offset, x + offset + inner, y + offset + inner),
        fill=inner_fill,
    )


def draw_feature_card(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int,
    h: int,
    title: str,
    title_font,
    subtext: str | None,
    sub_font,
    accent_fill,
    panel_fill=(255, 255, 255, 230),
    panel_outline=(255, 255, 255, 40),
    text_fill=(22, 28, 40),
    sub_fill=(90, 100, 120),
    radius: int = 22,
):
    draw.rounded_rectangle(
        (x, y, x + w, y + h),
        radius=radius,
        fill=panel_fill,
        outline=panel_outline,
        width=1,
    )

    icon_size = min(32, max(20, h // 3))
    icon_x = x + 14
    icon_y = y + (h - icon_size) // 2
    draw_icon_point(draw, icon_x, icon_y, icon_size, accent_fill)

    text_x = icon_x + icon_size + 14
    text_y = y + 12

    draw.text((text_x, text_y), title, font=title_font, fill=text_fill)

    if subtext:
        draw.text((text_x, text_y + 24), subtext, font=sub_font, fill=sub_fill)


def draw_metric_block(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    w: int,
    h: int,
    value: str,
    label: str,
    value_font,
    label_font,
    bg_fill,
    accent_fill,
    value_fill=(255, 255, 255),
    label_fill=(220, 230, 245),
    radius: int = 24,
):
    draw.rounded_rectangle(
        (x, y, x + w, y + h),
        radius=radius,
        fill=bg_fill,
        outline=(255, 255, 255, 40),
        width=1,
    )

    draw.rectangle(
        (x, y + h - 6, x + w, y + h),
        fill=accent_fill,
    )

    draw.text((x + 20, y + 14), value, font=value_font, fill=value_fill)
    draw.text((x + 20, y + 52), label, font=label_font, fill=label_fill)


def draw_specs_grid(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    col_w: int,
    row_h: int,
    items: list[str],
    title_font,
    accent_fill,
    dark_fill,
):
    positions = [
        (x, y),
        (x + col_w + 14, y),
        (x, y + row_h + 14),
        (x + col_w + 14, y + row_h + 14),
    ]

    for idx, item in enumerate(items[:4]):
        px, py = positions[idx]
        draw.rounded_rectangle(
            (px, py, px + col_w, py + row_h),
            radius=18,
            fill=dark_fill,
            outline=(255, 255, 255, 28),
            width=1,
        )
        draw_icon_point(draw, px + 12, py + 12, 22, accent_fill)
        draw.text((px + 44, py + 11), item, font=title_font, fill=(255, 255, 255))


def draw_bottom_feature_panel(
    draw: ImageDraw.ImageDraw,
    panel_box,
    items: list[str],
    title: str,
    title_font,
    item_font,
    accent_fill,
):
    x1, y1, x2, y2 = panel_box

    draw.rounded_rectangle(
        panel_box,
        radius=26,
        fill=(255, 255, 255, 18),
        outline=(255, 255, 255, 34),
        width=1,
    )

    draw.text((x1 + 20, y1 + 18), title, font=title_font, fill=(255, 255, 255))

    panel_w = x2 - x1
    col_w = int((panel_w - 54) / 2)
    row_h = 52
    grid_y = y1 + 54

    positions = [
        (x1 + 20, grid_y),
        (x1 + 20 + col_w + 10, grid_y),
        (x1 + 20, grid_y + row_h + 14),
        (x1 + 20 + col_w + 10, grid_y + row_h + 14),
    ]
    for idx, item in enumerate(items[:4]):
        px, py = positions[idx]
        draw.rounded_rectangle(
            (px, py, px + col_w, py + row_h),
            radius=18,
            fill=(255, 255, 255, 230),
            outline=(255, 255, 255, 24),
            width=1,
        )
        draw_icon_point(draw, px + 12, py + 10, 28, accent_fill)
        draw.text((px + 50, py + 11), item, font=item_font, fill=(18, 24, 39))