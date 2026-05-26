from __future__ import annotations

from typing import Tuple
import random

from PIL import Image, ImageDraw, ImageFilter


RGBA = Tuple[int, int, int, int]
RGB = Tuple[int, int, int]


SCENE_PRESETS = {
    "tech_energy": {
        "top": (8, 18, 46),
        "bottom": (15, 48, 118),
        "accent": (0, 210, 255, 255),
        "accent2": (90, 140, 255, 255),
        "accent3": (255, 180, 35, 255),
        "mode": "tech",
    },
    "tech_premium": {
        "top": (10, 16, 36),
        "bottom": (20, 32, 72),
        "accent": (0, 220, 255, 255),
        "accent2": (125, 155, 255, 255),
        "accent3": (255, 210, 60, 255),
        "mode": "tech",
    },
    "tech_clean": {
        "top": (20, 28, 60),
        "bottom": (110, 130, 210),
        "accent": (0, 195, 255, 255),
        "accent2": (80, 140, 255, 255),
        "accent3": (255, 255, 255, 180),
        "mode": "clean_tech",
    },
    "sport_dynamic": {
        "top": (10, 20, 70),
        "bottom": (40, 80, 180),
        "accent": (0, 180, 255, 255),
        "accent2": (255, 255, 255, 180),
        "accent3": (255, 170, 20, 255),
        "mode": "sport",
    },
    "auto_performance": {
        "top": (12, 12, 18),
        "bottom": (45, 52, 66),
        "accent": (255, 140, 0, 255),
        "accent2": (255, 210, 0, 255),
        "accent3": (0, 180, 255, 255),
        "mode": "industrial",
    },
    "auto_modern": {
        "top": (14, 20, 28),
        "bottom": (32, 46, 66),
        "accent": (0, 210, 255, 255),
        "accent2": (255, 145, 0, 255),
        "accent3": (255, 255, 255, 150),
        "mode": "industrial",
    },
    "clean_premium_home": {
        "top": (28, 36, 56),
        "bottom": (95, 110, 150),
        "accent": (255, 210, 130, 255),
        "accent2": (255, 255, 255, 180),
        "accent3": (0, 190, 255, 180),
        "mode": "home",
    },
    "cozy_home": {
        "top": (46, 38, 50),
        "bottom": (120, 95, 125),
        "accent": (255, 215, 160, 255),
        "accent2": (255, 255, 255, 170),
        "accent3": (210, 180, 255, 180),
        "mode": "home",
    },
    "kitchen_modern": {
        "top": (58, 64, 78),
        "bottom": (160, 168, 188),
        "accent": (255, 190, 60, 255),
        "accent2": (255, 255, 255, 170),
        "accent3": (80, 180, 255, 180),
        "mode": "home",
    },
    "decor_ambient": {
        "top": (22, 26, 42),
        "bottom": (72, 82, 120),
        "accent": (255, 220, 160, 255),
        "accent2": (255, 255, 255, 180),
        "accent3": (140, 200, 255, 180),
        "mode": "ambient",
    },
    "beauty_clean": {
        "top": (180, 190, 210),
        "bottom": (245, 248, 255),
        "accent": (255, 120, 180, 255),
        "accent2": (255, 255, 255, 180),
        "accent3": (180, 210, 255, 180),
        "mode": "beauty",
    },
    "editorial_book": {
        "top": (56, 42, 34),
        "bottom": (140, 108, 78),
        "accent": (255, 230, 190, 255),
        "accent2": (255, 255, 255, 150),
        "accent3": (210, 180, 120, 180),
        "mode": "editorial",
    },
    "fashion_editorial": {
        "top": (24, 24, 28),
        "bottom": (90, 96, 118),
        "accent": (255, 255, 255, 180),
        "accent2": (0, 210, 255, 190),
        "accent3": (255, 170, 170, 180),
        "mode": "editorial",
    },
    "kids_bright": {
        "top": (40, 80, 180),
        "bottom": (120, 200, 255),
        "accent": (255, 210, 40, 255),
        "accent2": (255, 90, 160, 220),
        "accent3": (255, 255, 255, 180),
        "mode": "kids",
    },
    "industrial_clean": {
        "top": (30, 34, 40),
        "bottom": (80, 86, 96),
        "accent": (255, 200, 50, 255),
        "accent2": (0, 180, 255, 180),
        "accent3": (255, 255, 255, 150),
        "mode": "industrial",
    },
    "clean_packshot": {"top": (120, 140, 170),
        "bottom": (235, 240, 248),
        "accent": (0, 180, 255, 180),
        "accent2": (255, 255, 255, 180),
        "accent3": (255, 200, 70, 180),
        "mode": "clean",
    },
    "premium_minimal": {
        "top": (18, 24, 42),
        "bottom": (72, 92, 140),
        "accent": (0, 200, 255, 255),
        "accent2": (255, 255, 255, 170),
        "accent3": (255, 180, 30, 255),
        "mode": "tech",
    },
}


CATEGORY_SCENE_MAP = {
    "electronics": "tech_energy",
    "auto": "auto_performance",
    "fashion": "fashion_editorial",
    "beauty": "beauty_clean",
    "home": "cozy_home",
    "books": "editorial_book",
    "kids": "kids_bright",
    "tools": "industrial_clean",
    "sports": "sport_dynamic",
    "general": "premium_minimal",
}


def _clamp(v: int) -> int:
    return max(0, min(255, int(v)))


def _rgba(color, alpha: int | None = None) -> RGBA:
    if len(color) == 4:
        if alpha is None:
            return color
        return (color[0], color[1], color[2], alpha)
    if len(color) == 3:
        return (color[0], color[1], color[2], 255 if alpha is None else alpha)
    raise ValueError("Unsupported color format")


def _vertical_gradient(size: Tuple[int, int], top: RGB, bottom: RGB) -> Image.Image:
    w, h = size
    img = Image.new("RGBA", size, (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)

    for y in range(h):
        ratio = y / max(1, h - 1)
        r = _clamp(top[0] * (1 - ratio) + bottom[0] * ratio)
        g = _clamp(top[1] * (1 - ratio) + bottom[1] * ratio)
        b = _clamp(top[2] * (1 - ratio) + bottom[2] * ratio)
        draw.line((0, y, w, y), fill=(r, g, b, 255))

    return img


def _add_soft_glow(img: Image.Image, center, radius: int, color: RGBA, blur: int):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x, y = center
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    img.alpha_composite(layer)


def _add_particles(img: Image.Image, rng: random.Random, count: int, color: RGBA):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    w, h = img.size

    for _ in range(count):
        x = rng.randint(0, w)
        y = rng.randint(0, h)
        r = rng.randint(1, 4)
        a = rng.randint(25, color[3])
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(color[0], color[1], color[2], a))

    layer = layer.filter(ImageFilter.GaussianBlur(1))
    img.alpha_composite(layer)


def _add_diagonal_motion(img: Image.Image, rng: random.Random, color: RGBA, lines: int = 12):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    w, h = img.size

    for _ in range(lines):
        x1 = rng.randint(-w // 4, w)
        y1 = rng.randint(0, h)
        length = rng.randint(w // 4, w)
        x2 = x1 + length
        y2 = y1 - rng.randint(80, 260)
        width = rng.randint(2, 6)
        a = rng.randint(50, 110)
        draw.line((x1, y1, x2, y2), fill=(color[0], color[1], color[2], a), width=width)

    layer = layer.filter(ImageFilter.GaussianBlur(6))
    img.alpha_composite(layer)


def _add_horizontal_light_bands(img: Image.Image, rng: random.Random, color: RGBA, count: int = 4):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    w, h = img.size

    for _ in range(count):
        y = rng.randint(int(h * 0.15), int(h * 0.85))
        thickness = rng.randint(3, 8)
        a = rng.randint(35, 80)
        draw.rounded_rectangle(
            (rng.randint(20, 90), y, w - rng.randint(20, 90), y + thickness),
            radius=max(2, thickness // 2),
            fill=(color[0], color[1], color[2], a),
        )

    layer = layer.filter(ImageFilter.GaussianBlur(14))
    img.alpha_composite(layer)
def _add_grid(img: Image.Image, color: RGBA, step: int = 70, alpha: int = 26):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    w, h = img.size
    c = (color[0], color[1], color[2], alpha)

    for x in range(0, w, step):
        draw.line((x, 0, x, h), fill=c, width=1)
    for y in range(0, h, step):
        draw.line((0, y, w, y), fill=c, width=1)

    layer = layer.filter(ImageFilter.GaussianBlur(0))
    img.alpha_composite(layer)


def _add_tech_rings(img: Image.Image, color: RGBA, center=None):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    w, h = img.size
    cx, cy = center or (w // 2, int(h * 0.65))

    for r in [120, 220, 320]:
        draw.ellipse(
            (cx - r, cy - r, cx + r, cy + r),
            outline=(color[0], color[1], color[2], 65),
            width=3,
        )

    layer = layer.filter(ImageFilter.GaussianBlur(2))
    img.alpha_composite(layer)


def _add_soft_room_glow(img: Image.Image, cfg: dict):
    w, h = img.size
    _add_soft_glow(img, (int(w * 0.2), int(h * 0.25)), int(min(w, h) * 0.20), _rgba(cfg["accent2"], 90), 60)
    _add_soft_glow(img, (int(w * 0.82), int(h * 0.22)), int(min(w, h) * 0.22), _rgba(cfg["accent3"], 80), 70)
    _add_soft_glow(img, (int(w * 0.55), int(h * 0.75)), int(min(w, h) * 0.25), _rgba(cfg["accent"], 65), 85)


def _add_industrial_panels(img: Image.Image, cfg: dict, rng: random.Random):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    w, h = img.size

    for _ in range(5):
        x1 = rng.randint(-100, w - 150)
        y1 = rng.randint(40, h - 240)
        x2 = x1 + rng.randint(180, 380)
        y2 = y1 + rng.randint(100, 240)
        draw.rounded_rectangle(
            (x1, y1, x2, y2),
            radius=22,
            fill=(255, 255, 255, 10),
            outline=(255, 255, 255, 24),
            width=2,
        )

    layer = layer.filter(ImageFilter.GaussianBlur(2))
    img.alpha_composite(layer)


def _add_beauty_bokeh(img: Image.Image, cfg: dict, rng: random.Random):
    w, h = img.size
    for _ in range(12):
        x = rng.randint(0, w)
        y = rng.randint(0, h)
        r = rng.randint(40, 140)
        color = rng.choice([
            _rgba(cfg["accent"], 60),
            _rgba(cfg["accent2"], 50),
            _rgba(cfg["accent3"], 45),
        ])
        _add_soft_glow(img, (x, y), r, color, blur=r // 2)


def _add_editorial_vignette(img: Image.Image):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    w, h = img.size
    draw.ellipse((-w * 0.2, -h * 0.1, w * 1.2, h * 1.05), fill=(0, 0, 0, 70))
    layer = layer.filter(ImageFilter.GaussianBlur(120))
    img.alpha_composite(layer)


def _add_floor_glow(img: Image.Image, cfg: dict):
    w, h = img.size
    _add_soft_glow(img, (w // 2, int(h * 0.84)), int(w * 0.26), _rgba(cfg["accent"], 80), 65)
    _add_soft_glow(img, (w // 2, int(h * 0.86)), int(w * 0.12), _rgba(cfg["accent2"], 95), 40)


def _add_kids_shapes(img: Image.Image, cfg: dict, rng: random.Random):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    w, h = img.size
    palette = [
        _rgba(cfg["accent"], 65),
        _rgba(cfg["accent2"], 55),
        _rgba(cfg["accent3"], 55),
    ]

    for _ in range(18):
        x = rng.randint(0, w)
        y = rng.randint(0, h)
        s = rng.randint(24, 90)
        color = rng.choice(palette)
        shape_type = rng.choice(["circle", "square"])

        if shape_type == "circle":
            draw.ellipse((x, y, x + s, y + s), fill=color)
        else:
            draw.rounded_rectangle((x, y, x + s, y + s), radius=s // 5, fill=color)

    layer = layer.filter(ImageFilter.GaussianBlur(8))
    img.alpha_composite(layer)


def _resolve_scene(scene: str | None, category: str | None) -> dict:
    if scene and scene in SCENE_PRESETS:
        return SCENE_PRESETS[scene]
    mapped = CATEGORY_SCENE_MAP.get(str(category or "").lower(), "premium_minimal")
    return SCENE_PRESETS[mapped]
def generate_ai_background(
    size: Tuple[int, int],
    title: str = "",
    category: str = "",
    scene: str = "",
    seed: int = 0,
) -> Image.Image:
    cfg = _resolve_scene(scene, category)
    rng = random.Random(f"{title}|{category}|{scene}|{seed}")

    top = cfg["top"]
    bottom = cfg["bottom"]

    bg = _vertical_gradient(size, top, bottom)
    w, h = size

    _add_soft_glow(bg, (int(w * 0.18), int(h * 0.20)), int(min(w, h) * 0.20), _rgba(cfg["accent"], 70), 70)
    _add_soft_glow(bg, (int(w * 0.80), int(h * 0.22)), int(min(w, h) * 0.18), _rgba(cfg["accent2"], 60), 75)
    _add_soft_glow(bg, (int(w * 0.50), int(h * 0.75)), int(min(w, h) * 0.22), _rgba(cfg["accent3"], 55), 90)

    mode = cfg["mode"]

    if mode == "tech":
        _add_diagonal_motion(bg, rng, _rgba(cfg["accent"], 110), lines=15)
        _add_horizontal_light_bands(bg, rng, _rgba(cfg["accent2"], 85), count=5)
        _add_grid(bg, _rgba(cfg["accent2"], 40), step=max(60, w // 16), alpha=18)
        _add_tech_rings(bg, _rgba(cfg["accent"], 70))
        _add_particles(bg, rng, max(70, (w * h) // 22000), _rgba(cfg["accent3"], 90))
        _add_floor_glow(bg, cfg)

    elif mode == "clean_tech":
        _add_horizontal_light_bands(bg, rng, _rgba(cfg["accent"], 55), count=4)
        _add_grid(bg, _rgba(cfg["accent2"], 34), step=max(70, w // 15), alpha=16)
        _add_particles(bg, rng, max(50, (w * h) // 26000), _rgba(cfg["accent"], 70))
        _add_floor_glow(bg, cfg)

    elif mode == "sport":
        _add_diagonal_motion(bg, rng, _rgba(cfg["accent"], 120), lines=18)
        _add_diagonal_motion(bg, rng, _rgba(cfg["accent3"], 90), lines=10)
        _add_particles(bg, rng, max(100, (w * h) // 18000), _rgba(cfg["accent2"], 95))
        _add_tech_rings(bg, _rgba(cfg["accent"], 80), center=(w // 2, int(h * 0.75)))
        _add_floor_glow(bg, cfg)

    elif mode == "industrial":
        _add_industrial_panels(bg, cfg, rng)
        _add_grid(bg, _rgba(cfg["accent2"], 32), step=max(90, w // 14), alpha=14)
        _add_particles(bg, rng, max(55, (w * h) // 26000), _rgba(cfg["accent3"], 70))
        _add_floor_glow(bg, cfg)

    elif mode == "home":
        _add_soft_room_glow(bg, cfg)
        _add_horizontal_light_bands(bg, rng, _rgba(cfg["accent2"], 40), count=3)
        _add_particles(bg, rng, max(40, (w * h) // 32000), _rgba(cfg["accent3"], 50))

    elif mode == "ambient":
        _add_soft_room_glow(bg, cfg)
        _add_particles(bg, rng, max(60, (w * h) // 26000), _rgba(cfg["accent2"], 65))
        _add_editorial_vignette(bg)

    elif mode == "beauty":
        _add_beauty_bokeh(bg, cfg, rng)
        _add_particles(bg, rng, max(40, (w * h) // 30000), _rgba(cfg["accent"], 55))

    elif mode == "editorial":
        _add_editorial_vignette(bg)
        _add_particles(bg, rng, max(35, (w * h) // 34000), _rgba(cfg["accent2"], 55))
        _add_horizontal_light_bands(bg, rng, _rgba(cfg["accent3"], 30), count=2)

    elif mode == "kids":
        _add_kids_shapes(bg, cfg, rng)
        _add_particles(bg, rng, max(60, (w * h) // 26000), _rgba(cfg["accent2"], 70))

    elif mode == "clean":
        _add_soft_glow(bg, (w // 2, int(h * 0.45)), int(min(w, h) * 0.18), _rgba(cfg["accent2"], 60), 80)
        _add_particles(bg, rng, max(28, (w * h) // 38000), _rgba(cfg["accent"], 45))

    else:
        _add_particles(bg, rng, max(45, (w * h) // 30000), _rgba(cfg["accent2"], 60))
        _add_floor_glow(bg, cfg)

    final_overlay = Image.new("RGBA", size, (0, 0, 0, 0))
    final_draw = ImageDraw.Draw(final_overlay)
    final_draw.rounded_rectangle(
        (0, 0, w - 1, h - 1),
        radius=0,
        outline=(255, 255, 255, 12),
        width=1,
    )
    final_overlay = final_overlay.filter(ImageFilter.GaussianBlur(1))
    bg.alpha_composite(final_overlay)

    return bg