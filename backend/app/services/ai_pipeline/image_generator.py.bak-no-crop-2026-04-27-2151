from __future__ import annotations

import base64
import os
from io import BytesIO
from pathlib import Path
from typing import Any

import requests
from PIL import Image, ImageOps


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


def _decode_response_image(payload: dict[str, Any]) -> Image.Image:
    data = payload.get("data") or []
    if not data:
        raise RuntimeError("Image API returned empty data")

    first = data[0]
    b64 = first.get("b64_json")
    if not b64:
        raise RuntimeError("Image API response has no b64_json")

    image_bytes = base64.b64decode(b64)
    return Image.open(BytesIO(image_bytes)).convert("RGBA")


def generate_card_image(
    *,
    product_image_path: str,
    prompt: str,
    output_path: str,
    size: str = "1024x1536",
    final_size: tuple[int, int] | None = None,
) -> dict[str, Any]:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not set")

    image_path = Path(product_image_path).resolve()
    if not image_path.exists():
        raise FileNotFoundError(f"Product image not found: {image_path}")

    output_file = Path(output_path).resolve()
    output_file.parent.mkdir(parents=True, exist_ok=True)

    mime_type = _guess_mime_type(image_path)

    with open(image_path, "rb") as f:
        files = {
            "image": (image_path.name, f, mime_type),
        }
        data = {
            "model": "gpt-image-1",
            "prompt": prompt,
            "size": size,
            "output_format": "png",
        }
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
        }

        response = requests.post(
            OPENAI_IMAGE_EDIT_URL,
            headers=headers,
            files=files,
            data=data,
            timeout=300,
        )

    if response.status_code != 200:
        print("OPENAI STATUS:", response.status_code)
        print("OPENAI RESPONSE:", response.text)
        raise RuntimeError(
            f"Image generation error {response.status_code}: {response.text[:1000]}"
        )

    payload = response.json()
    img = _decode_response_image(payload)
    if final_size:
        img = ImageOps.fit(img, final_size, method=Image.LANCZOS)
    img.save(output_file, "PNG")

    if not output_file.exists():
        raise RuntimeError(f"PNG was not saved: {output_file}")

    return {
    "success": True,
    "output_path": str(output_file),
    "filename": output_file.name,
    "width": img.width,
    "height": img.height,
    "_openai_meta": {
        "provider": "openai",
        "model": "gpt-image-1",
        "response_id": payload.get("id"),
        "usage": payload.get("usage", {}),
    },
}


def generate_series_images(
    *,
    product_image_path: str,
    prompts: list[dict[str, Any]],
    output_dir: str,
    size: str = "1024x1536",
    final_size: tuple[int, int] | None = None,
) -> list[dict[str, Any]]:
    out_dir = Path(output_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    generation_folder = out_dir.name
    results: list[dict[str, Any]] = []

    for item in prompts:
        index = int(item.get("index", 1))
        slide_key = str(item.get("slide_key", f"slide_{index}"))
        prompt = str(item.get("prompt", "")).strip()

        filename = f"slide_{index}_{slide_key}.png"
        output_path = out_dir / filename
        image_url = f"/generated_cards/{generation_folder}/{filename}"

        try:
            result = generate_card_image(
                product_image_path=product_image_path,
                prompt=prompt,
                output_path=str(output_path),
                size=size,
                final_size=final_size,
            )

            results.append(
                {
                    "index": index,
                    "slide_key": slide_key,
                    "prompt": prompt,
                    "image_url": image_url,
                    "download_url": image_url,
                    "output_path": str(output_path),"rendered": True,
                    "render_error": None,
                    **result,
                }
            )
        except Exception as e:
            results.append(
                {
                    "index": index,
                    "slide_key": slide_key,
                    "prompt": prompt,
                    "image_url": None,
                    "download_url": None,
                    "output_path": str(output_path),
                    "rendered": False,
                    "render_error": repr(e),
                }
            )

    return results
