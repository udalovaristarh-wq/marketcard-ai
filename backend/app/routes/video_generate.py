from __future__ import annotations

import os
import shutil
import subprocess
import uuid
from pathlib import Path

import requests
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from app.models import User
from app.security import get_current_user

router = APIRouter(tags=["video-generate"])


def _default_video_dir() -> Path:
    if os.name == "nt":
        return Path(__file__).resolve().parents[2] / "generated_videos"
    return Path("/var/www/marketcard/generated_videos")


GENERATED_VIDEO_DIR = Path(
    os.getenv("MARKETCARD_GENERATED_VIDEO_DIR", str(_default_video_dir()))
).resolve()
TEMP_DIR = (Path(__file__).resolve().parents[2] / "temp" / "video").resolve()

GENERATED_VIDEO_DIR.mkdir(parents=True, exist_ok=True)
TEMP_DIR.mkdir(parents=True, exist_ok=True)

VIDEO_PROVIDER = os.getenv("MARKETCARD_VIDEO_PROVIDER", "local").strip().lower()
BUDGET_VIDEO_API_URL = os.getenv("BUDGET_VIDEO_API_URL", "").strip()
BUDGET_VIDEO_API_KEY = os.getenv("BUDGET_VIDEO_API_KEY", "").strip()
BUDGET_VIDEO_MODEL = os.getenv("BUDGET_VIDEO_MODEL", "image-to-video").strip()
BUDGET_VIDEO_STRICT = os.getenv("BUDGET_VIDEO_STRICT", "0") == "1"

MARKETPLACE_SIZES = {
    "uzum": (1080, 1920),
    "wildberries": (1080, 1920),
    "ozon": (1080, 1080),
    "yandex": (1920, 1080),
}

MARKETPLACE_LABELS = {
    "uzum": "UZUM",
    "wildberries": "WILDBERRIES",
    "ozon": "OZON",
    "yandex": "YANDEX MARKET",
}


def _safe_marketplace(value: str) -> str:
    mp = (value or "uzum").strip().lower()
    return mp if mp in MARKETPLACE_SIZES else "uzum"


def _font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        try:
            if Path(path).exists():
                return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def _cover_resize(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    width, height = size
    src_w, src_h = image.size
    scale = max(width / src_w, height / src_h)
    resized = image.resize((int(src_w * scale), int(src_h * scale)), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - width) // 2)
    top = max(0, (resized.height - height) // 2)
    return resized.crop((left, top, left + width, top + height))


def _contain_resize(image: Image.Image, max_size: tuple[int, int]) -> Image.Image:
    image = image.copy()
    image.thumbnail(max_size, Image.Resampling.LANCZOS)
    return image


def _gradient_background(width: int, height: int, frame_index: int) -> Image.Image:
    base = Image.new("RGB", (width, height), "#080a1f")
    draw = ImageDraw.Draw(base, "RGBA")

    shift = frame_index * 9
    draw.ellipse(
        (-width // 4 + shift, height // 12, width // 2 + shift, height // 2),
        fill=(34, 211, 238, 42),
    )
    draw.ellipse(
        (width // 2 - shift, -height // 8, width + width // 4 - shift, height // 2),
        fill=(168, 85, 247, 54),
    )
    draw.ellipse(
        (width // 8, height // 2, width, height + height // 4),
        fill=(236, 72, 153, 32),
    )

    for y in range(0, height, max(24, height // 32)):
        alpha = 14 if (y // 24) % 2 == 0 else 7
        draw.line((0, y, width, y), fill=(255, 255, 255, alpha), width=1)

    return base.filter(ImageFilter.GaussianBlur(radius=18))


def _compose_frame(
    source: Image.Image,
    width: int,
    height: int,
    title: str,
    marketplace: str,
    style: str,
    frame_index: int,
    total_frames: int,
) -> Image.Image:
    frame = _gradient_background(width, height, frame_index).convert("RGBA")
    draw = ImageDraw.Draw(frame, "RGBA")

    progress = frame_index / max(total_frames - 1, 1)
    zoom = 1 + progress * 0.08
    product_max = (int(width * 0.62 * zoom), int(height * 0.48 * zoom))
    product = _contain_resize(source.convert("RGBA"), product_max)

    x = (width - product.width) // 2 + int((progress - 0.5) * width * 0.05)
    y = int(height * 0.26) - product.height // 2
    if height < width:
        y = int(height * 0.47) - product.height // 2

    shadow = Image.new("RGBA", product.size, (0, 0, 0, 0))
    alpha = product.getchannel("A") if product.mode == "RGBA" else Image.new("L", product.size, 255)
    shadow.putalpha(alpha.filter(ImageFilter.GaussianBlur(radius=22)))
    frame.alpha_composite(shadow, (x + 18, y + 28))
    frame.alpha_composite(product, (x, y))

    label_font = _font(max(24, width // 36))
    title_font = _font(max(38, width // 22))
    small_font = _font(max(22, width // 44))

    pad = max(34, width // 28)
    label = MARKETPLACE_LABELS.get(marketplace, "MARKETCARD")
    badge = f"{label} / {style.upper()}"

    draw.rounded_rectangle(
        (pad, pad, pad + int(width * 0.34), pad + max(58, height // 24)),
        radius=max(22, width // 54),
        fill=(15, 23, 42, 190),
        outline=(103, 232, 249, 120),
        width=2,
    )
    draw.text((pad + 22, pad + 16), badge, font=label_font, fill=(103, 232, 249, 255))

    headline = (title or "Premium product").strip()[:46]
    bottom_h = max(190, int(height * 0.16))
    draw.rounded_rectangle(
        (pad, height - bottom_h - pad, width - pad, height - pad),
        radius=max(28, width // 42),
        fill=(2, 6, 23, 205),
        outline=(255, 255, 255, 36),
        width=2,
    )
    draw.text(
        (pad + 30, height - bottom_h - pad + 30),
        headline,
        font=title_font,
        fill=(255, 255, 255, 255),
    )
    draw.text(
        (pad + 32, height - bottom_h - pad + 92),
        "AI video brief / MarketCard AI",
        font=small_font,
        fill=(203, 213, 225, 230),
    )

    bar_y = height - pad - 34
    bar_w = width - pad * 2
    draw.rounded_rectangle((pad + 30, bar_y, pad + 30 + bar_w - 60, bar_y + 10), radius=999, fill=(255, 255, 255, 32))
    draw.rounded_rectangle((pad + 30, bar_y, pad + 30 + int((bar_w - 60) * progress), bar_y + 10), radius=999, fill=(103, 232, 249, 230))

    return frame.convert("RGB")


def _save_mp4_with_ffmpeg(frames_dir: Path, output_path: Path, fps: int) -> bool:
    try:
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-framerate",
                str(fps),
                "-i",
                str(frames_dir / "frame_%04d.jpg"),
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                str(output_path),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return output_path.exists() and output_path.stat().st_size > 0
    except Exception:
        return False


def _try_external_video_provider(
    *,
    source_path: Path,
    product_title: str,
    marketplace: str,
    scenario: str,
    style: str,
) -> dict | None:
    if VIDEO_PROVIDER in {"local", "pil", "ffmpeg"}:
        return None
    if not BUDGET_VIDEO_API_URL or not BUDGET_VIDEO_API_KEY:
        if BUDGET_VIDEO_STRICT:
            raise HTTPException(status_code=503, detail="Video provider env is not configured")
        return None

    headers = {"Authorization": f"Bearer {BUDGET_VIDEO_API_KEY}"}
    data = {
        "model": BUDGET_VIDEO_MODEL,
        "prompt": scenario,
        "title": product_title,
        "marketplace": marketplace,
        "style": style,
    }

    try:
        with open(source_path, "rb") as image_file:
            response = requests.post(
                BUDGET_VIDEO_API_URL,
                headers=headers,
                data=data,
                files={"image": (source_path.name, image_file, "image/png")},
                timeout=180,
            )
        response.raise_for_status()
        payload = response.json()
    except Exception as exc:
        if BUDGET_VIDEO_STRICT:
            raise HTTPException(status_code=502, detail=f"Video provider failed: {exc}") from exc
        return None

    video_url = payload.get("video_url") or payload.get("asset_url") or payload.get("url")
    if not video_url:
        if BUDGET_VIDEO_STRICT:
            raise HTTPException(status_code=502, detail="Video provider response has no video URL")
        return None

    return {
        "success": True,
        "asset_type": "video",
        "video_url": video_url,
        "marketplace": marketplace,
        "provider": VIDEO_PROVIDER,
        "model": BUDGET_VIDEO_MODEL,
        "raw": payload,
    }


@router.post("/video/generate")
async def generate_video(
    product_title: str = Form(""),
    marketplace: str = Form("uzum"),
    scenario: str = Form(""),
    style: str = Form("cinematic"),
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="image file is required")

    suffix = Path(image.filename or "product.png").suffix.lower() or ".png"
    if suffix not in {".png", ".jpg", ".jpeg", ".webp"}:
        raise HTTPException(status_code=400, detail="unsupported image format")

    generation_id = uuid.uuid4().hex[:12]
    work_dir = TEMP_DIR / generation_id
    frames_dir = work_dir / "frames"
    frames_dir.mkdir(parents=True, exist_ok=True)

    source_path = work_dir / f"source{suffix}"
    with open(source_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    marketplace_key = _safe_marketplace(marketplace)
    width, height = MARKETPLACE_SIZES[marketplace_key]
    fps = 12
    total_frames = 42

    try:
        source = Image.open(source_path).convert("RGBA")
    except Exception:
        raise HTTPException(status_code=400, detail="could not read image")

    external_result = _try_external_video_provider(
        source_path=source_path,
        product_title=product_title,
        marketplace=marketplace_key,
        scenario=scenario,
        style=style or "cinematic",
    )
    if external_result:
        shutil.rmtree(work_dir, ignore_errors=True)
        return external_result

    frames: list[Image.Image] = []
    for idx in range(total_frames):
        frame = _compose_frame(
            source=source,
            width=width,
            height=height,
            title=product_title,
            marketplace=marketplace_key,
            style=style or "cinematic",
            frame_index=idx,
            total_frames=total_frames,
        )
        frame_path = frames_dir / f"frame_{idx + 1:04d}.jpg"
        frame.save(frame_path, "JPEG", quality=90)
        frames.append(frame)

    mp4_name = f"mc_video_{current_user.id}_{generation_id}.mp4"
    mp4_path = GENERATED_VIDEO_DIR / mp4_name
    if _save_mp4_with_ffmpeg(frames_dir, mp4_path, fps):
        shutil.rmtree(work_dir, ignore_errors=True)
        return {
            "success": True,
            "asset_type": "video",
            "video_url": f"/generated_videos/{mp4_name}",
            "marketplace": marketplace_key,
            "format": f"{width}x{height}",
            "provider": "local_ffmpeg_motion",
        }

    gif_name = f"mc_video_{current_user.id}_{generation_id}.gif"
    gif_path = GENERATED_VIDEO_DIR / gif_name
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=int(1000 / fps),
        loop=0,
        optimize=True,
    )
    shutil.rmtree(work_dir, ignore_errors=True)

    return {
        "success": True,
        "asset_type": "gif",
        "video_url": f"/generated_videos/{gif_name}",
        "marketplace": marketplace_key,
        "format": f"{width}x{height}",
        "provider": "local_pil_motion",
        "note": "ffmpeg not available; generated animated gif fallback",
    }
