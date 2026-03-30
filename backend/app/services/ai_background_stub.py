from __future__ import annotations

from typing import Tuple
from PIL import Image, ImageDraw, ImageFilter
import random


def _gradient(size: Tuple[int, int], top, bottom) -> Image.Image:
    w, h = size
    img = Image.new("RGBA", size, top)
    draw = ImageDraw.Draw(img)

    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(top[0] * (1 - t) + bottom[0] * t)
        g = int(top[1] * (1 - t) + bottom[1] * t)
        b = int(top[2] * (1 - t) + bottom[2] * t)
        draw.line((0, y, w, y), fill=(r, g, b, 255))

    return img


def _glow(img: Image.Image, x: int, y: int, radius: int, color):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(max(20, radius // 2)))
    img.alpha_composite(layer)


def _grid(img: Image.Image, step: int = 72, color=(255, 255, 255, 22)):
    draw = ImageDraw.Draw(img)
    w, h = img.size
    for x in range(0, w, step):
        draw.line((x, 0, x, h), fill=color, width=1)
    for y in range(0, h, step):
        draw.line((0, y, w, y), fill=color, width=1)


def _streaks(img: Image.Image, seed: int = 0):
    rnd = random.Random(seed)
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    w, h = img.size

    for _ in range(4):
        x1 = rnd.randint(-100, w)
        x2 = x1 + rnd.randint(180, 360)
        draw.line((x1, 0, x2, h), fill=(255, 255, 255, 60), width=3)

    layer = layer.filter(ImageFilter.GaussianBlur(8))
    img.alpha_composite(layer)


def generate_ai_background(
    size: Tuple[int, int],
    scene: str,
    palette,
    seed: int = 0,
) -> Image.Image:
    img = _gradient(size, palette.bg_top, palette.bg_bottom)
    w, h = size

    _glow(img, int(w * 0.82), int(h * 0.18), int(min(w, h) * 0.22), palette.accent)
    _glow(img, int(w * 0.18), int(h * 0.82), int(min(w, h) * 0.18), palette.accent3)

    if scene in {"tech", "neon", "dark"}:
        _streaks(img, seed=seed)

    if scene in {"tech", "clean", "minimal"}:
        _grid(img, step=max(56, w // 18))

    if scene in {"soft", "pastel", "premium"}:
        _glow(img, int(w * 0.5), int(h * 0.55), int(min(w, h) * 0.16), palette.accent2)

    return img