from __future__ import annotations

import base64
import os
from io import BytesIO
from pathlib import Path
from typing import Optional

import requests
from PIL import Image, ImageChops, ImageFilter


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_IMAGE_EDIT_URL = "https://api.openai.com/v1/images/edits"


def _guess_mime_type(path: Path) -> str:
    ext = path.suffix.lower()
    if ext == ".png":
        return "image/png"
    if ext in {".jpg", ".jpeg"}:
        return "image/jpeg"
    if ext == ".webp":
        return "image/webp"
    return "application/octet-stream"


def _crop_transparent_bounds(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if bbox:
        return img.crop(bbox)
    return img


def _trim_solid_background(img: Image.Image, tolerance: int = 18) -> Image.Image:
    """
    Пытается убрать однотонный фон по цвету углов.
    Это fallback, если OpenAI не сработал.
    """
    img = img.convert("RGBA")
    w, h = img.size
    if w < 4 or h < 4:
        return img

    corners = [
        img.getpixel((0, 0)),
        img.getpixel((w - 1, 0)),
        img.getpixel((0, h - 1)),
        img.getpixel((w - 1, h - 1)),
    ]

    # Берем средний цвет углов
    avg = (
        sum(c[0] for c in corners) // 4,
        sum(c[1] for c in corners) // 4,
        sum(c[2] for c in corners) // 4,
        255,
    )

    bg = Image.new("RGBA", img.size, avg)
    diff = ImageChops.difference(img, bg).convert("L")

    # Усиливаем различия
    diff = diff.point(lambda p: 255 if p > tolerance else 0)
    diff = diff.filter(ImageFilter.MedianFilter(size=3))
    diff = diff.filter(ImageFilter.GaussianBlur(1))

    r, g, b, _ = img.split()
    out = Image.merge("RGBA", (r, g, b, diff))
    return out


def _refine_alpha(img: Image.Image) -> Image.Image:
    """
    Подчищает альфу, чтобы было меньше грязных краев.
    """
    img = img.convert("RGBA")
    r, g, b, a = img.split()

    a = a.filter(ImageFilter.MedianFilter(size=3))
    a = a.filter(ImageFilter.GaussianBlur(0.6))
    a = a.point(lambda p: 0 if p < 12 else (255 if p > 245 else p))

    return Image.merge("RGBA", (r, g, b, a))


def _local_fallback_cutout(product_image_path: str) -> Image.Image:
    """
    Локальный fallback:
    - открывает изображение
    - пытается убрать однотонный фон
    - чистит края
    """
    img = Image.open(product_image_path).convert("RGBA")
    img = _trim_solid_background(img)
    img = _refine_alpha(img)
    img = _crop_transparent_bounds(img)
    return img


def _decode_openai_image(payload: dict) -> Image.Image:
    data = payload.get("data") or []
    if not data:
        raise RuntimeError("OpenAI returned empty data")

    first = data[0]
    b64 = first.get("b64_json")
    if not b64:
        raise RuntimeError("OpenAI response has no b64_json")

    image_bytes = base64.b64decode(b64)
    return Image.open(BytesIO(image_bytes)).convert("RGBA")


def _openai_cutout(product_image_path: str) -> Image.Image:
    image_path = Path(product_image_path)
    mime_type = _guess_mime_type(image_path)

    with open(image_path, "rb") as f:
        files = {
            "image": (image_path.name, f, mime_type),
        }
        data = {
            "model": "gpt-image-1",
            "prompt": (
                "Remove the background from this product photo. "
                "Keep only the main product. "
                "Preserve exact shape, proportions, edges, details, reflections, texture, and natural product shadows where possible. "
                "Return a clean PNG with transparent background. "
                "Do not add text. Do not stylize. Do not add frame. Do not change the product. "
                "Do not crop the product too tightly."
            ),
            "background": "transparent",
            "output_format": "png",
            "size": "1024x1024",
        }
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
        }
        response = requests.post(
            OPENAI_IMAGE_EDIT_URL,
            headers=headers,
            files=files,
            data=data,
            timeout=180,
        )

    if response.status_code != 200:
        raise RuntimeError(
            f"OpenAI cutout error {response.status_code}: {response.text[:800]}"
        )

    payload = response.json()
    img = _decode_openai_image(payload)
    img = _refine_alpha(img)
    img = _crop_transparent_bounds(img)
    return img


def ai_cutout_product(product_image_path: str, output_path: Optional[str] = None) -> Image.Image:
    """
    Финальный пайплайн:
    1. Проверяем файл
    2. Если есть OPENAI_API_KEY -> пробуем OpenAI вырезку
    3. Если OpenAI не сработал -> fallback локально
    4. Сохраняем PNG, если нужен output_path
    """
    image_path = Path(product_image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {product_image_path}")

    if OPENAI_API_KEY:
        try:
            img = _openai_cutout(str(image_path))
        except Exception as e:
            print("CUTOUT FALLBACK:", repr(e))
            img = _local_fallback_cutout(str(image_path))
    else:
        img = _local_fallback_cutout(str(image_path))

    if output_path:
        out_path = Path(output_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(out_path, "PNG")

    return img