from __future__ import annotations
import os


import hashlib
import json
import shutil
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request

from app.rate_limit import rate_limit
from PIL import Image, ImageDraw, ImageFont

from app.services.ai_pipeline.full_generate_service import full_generate

router = APIRouter(tags=["Demo Generate"])

TEMP_DIR = Path("temp/demo")
TEMP_DIR.mkdir(parents=True, exist_ok=True)

LIMIT_DIR = Path("/var/www/marketcard/generated_cards/demo_limits")
LIMIT_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _limit_path(ip: str) -> Path:
    ip_hash = hashlib.sha256(ip.encode("utf-8")).hexdigest()
    return LIMIT_DIR / f"{ip_hash}.json"


def _check_demo_limit(ip: str) -> None:
    path = _limit_path(ip)
    if path.exists():
        raise HTTPException(
            status_code=429,
            detail="Вы уже использовали бесплатное демо. Зарегистрируйтесь и активируйте тариф, чтобы пользоваться сервисом.",
        )


def _save_demo_usage(ip: str) -> None:
    ip_hash = hashlib.sha256(ip.encode("utf-8")).hexdigest()
    _limit_path(ip).write_text(
        json.dumps(
            {
                "ip_hash": ip_hash,
                "used_at": datetime.utcnow().isoformat(),
                "limit": "one_demo_forever",
            },
            ensure_ascii=False,
        )
    )


def _add_watermark(image_url: str) -> str:
    if not image_url.startswith("/generated_cards/"):
        raise RuntimeError("Bad generated image url")

    rel = image_url.replace("/generated_cards/", "", 1)
    path = (Path("/var/www/marketcard/generated_cards") / rel).resolve()

    if not path.exists():
        raise RuntimeError(f"Generated image not found: {path}")

    with Image.open(path).convert("RGBA") as img:
        w, h = img.size
        overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))

        watermark_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(watermark_layer)

        try:
            font_big = ImageFont.truetype(
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                max(70, w // 8),
            )
            font_small = ImageFont.truetype(
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                max(30, w // 28),
            )
        except Exception:
            font_big = ImageFont.load_default()
            font_small = ImageFont.load_default()

        text = "DEMO • MarketCard AI"
        bbox = draw.textbbox((0, 0), text, font=font_big)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]

        step_x = max(520, tw + 240)
        step_y = max(260, th + 160)

        for y in range(-h, h * 2, step_y):
            for x in range(-w, w * 2, step_x):
                draw.text((x, y), text, font=font_big, fill=(255, 255, 255, 95))

        watermark_layer = watermark_layer.rotate(-28, expand=False)
        overlay.alpha_composite(watermark_layer)

        draw2 = ImageDraw.Draw(overlay)
        bottom_h = max(150, h // 9)

        draw2.rectangle((0, h - bottom_h, w, h), fill=(2, 6, 23, 220))

        draw2.text(
            (40, h - bottom_h + 28),
            "ДЕМО-ПРЕВЬЮ • Без водяного знака доступно после регистрации и тарифа",
            font=font_small,
            fill=(255, 255, 255, 250),
        )

        result = Image.alpha_composite(img, overlay).convert("RGB")
        result.save(path, "PNG")

    return image_url


@router.post("/demo-generate")
async def demo_generate(
    request: Request,
    product_title: str = Form("Демо товар"),
    category: str = Form("Товар для маркетплейса"),
    brand: str = Form(""),
    marketplace: str = Form("uzum"),
    language_mode: str = Form("ru"),
    image: UploadFile = File(...),
):
    rate_limit(request, key_prefix="demo-generate", max_calls=5, window_seconds=3600)
    ip = _client_ip(request)
    _check_demo_limit(ip)

    if not image or not image.filename:
        raise HTTPException(status_code=400, detail="Фото товара обязательно")

    suffix = Path(image.filename).suffix.lower() or ".png"

    if suffix not in ALLOWED_IMAGE_SUFFIXES:
        raise HTTPException(status_code=400, detail="Разрешены только JPG, PNG, WEBP")

    marketplace = (marketplace or "uzum").strip().lower()

    if marketplace not in ("uzum", "wildberries", "ozon", "yandex"):
        marketplace = "uzum"

    temp_file = TEMP_DIR / f"demo_{uuid.uuid4().hex}{suffix}"

    try:

        os.makedirs(os.path.dirname(temp_file), exist_ok=True)
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        result = full_generate(
            {
                "product_title": product_title or "Демо товар",
                "brand": brand or "",
                "category": category or "Товар для маркетплейса",
                "purpose": "demo preview",
                "compatibility": "",
                "marketplace": marketplace,
                "language_mode": language_mode or "ru",
                "variant_count": 1,
                "extra_features": "Demo preview. Make a strong marketplace product card.",
                "product_image": str(temp_file),
            }
        )

        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=result.get("error") or "Demo generation failed",
            )

        slides = result.get("slides") or []

        if not slides:
            raise HTTPException(status_code=500, detail="Demo image not generated")

        image_url = slides[0].get("image_url") or slides[0].get("url")

        if not image_url:
            raise HTTPException(status_code=500, detail="Demo image url missing")

        demo_url = _add_watermark(image_url)

        _save_demo_usage(ip)

        return {
            "success": True,
            "demo_image_url": demo_url,
            "message": "Demo generated once with watermark",
        }

    finally:
        try:
            temp_file.unlink(missing_ok=True)
        except Exception:
            pass
