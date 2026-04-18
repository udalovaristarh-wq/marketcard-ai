from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from PIL import Image, ImageOps

from app.services.ai_pipeline.image_generator import generate_card_image

router = APIRouter(tags=["fix-image"])


class FixImageRequest(BaseModel):
    image_url: str
    fix_prompt: str


def _resolve_local_generated_path(image_url: str) -> Path:
    if not image_url.startswith("/generated_cards/"):
        raise HTTPException(status_code=400, detail="image_url must start with /generated_cards/")

    rel = image_url.replace("/generated_cards/", "", 1)
    path = (Path("/var/www/marketcard/generated_cards") / rel).resolve()

    if not path.exists():
        raise HTTPException(status_code=404, detail=f"image file not found: {path}")

    return path


@router.post("/fix-generated-image")
def fix_generated_image(payload: FixImageRequest):
    image_path = _resolve_local_generated_path(payload.image_url)

    user_fix = (payload.fix_prompt or "").strip()
    if not user_fix:
        raise HTTPException(status_code=400, detail="fix_prompt is empty")

    fix_prompt = f"""
You are editing an already generated marketplace infographic image.

Keep the same product, same design idea, and same composition unless the user's request requires a change.

Apply only the user's requested fixes:
{user_fix}

Important:
- do not replace the product with another object
- do not redesign from scratch unless necessary
- preserve the original style as much as possible
- improve only what the user asked
""".strip()

    source_folder = image_path.parent
    fixed_name = f"{image_path.stem}_fixed_{uuid4().hex[:8]}.png"
    output_path = source_folder / fixed_name

    with Image.open(image_path) as img:
        original_width, original_height = img.size

    if original_width == original_height:
        openai_size = "1024x1024"
    elif original_height > original_width:
        openai_size = "1024x1536"
    else:
        openai_size = "1536x1024"

    with Image.open(image_path) as original_img:
        original_width, original_height = original_img.size

    if original_width == original_height:
        openai_size = "1024x1024"
    elif original_height > original_width:
        openai_size = "1024x1536"
    else:
        openai_size = "1536x1024"

    try:
        result = generate_card_image(
            product_image_path=str(image_path),
            prompt=fix_prompt,
            output_path=str(output_path),
            size=openai_size,
            final_size=(original_width, original_height),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"fix generation failed: {e}")

    with Image.open(output_path) as fixed_img:
        fixed_width, fixed_height = fixed_img.size

    # ЖЁСТКО приводим к исходному размеру
    with Image.open(output_path) as img:
        img = ImageOps.fit(img, (original_width, original_height))
        img.save(output_path)

    
    return {
        "success": True,
        "fixed_image_url": f"/generated_cards/{source_folder.name}/{fixed_name}",
        "original_width": original_width,
        "original_height": original_height,
        "fixed_width": fixed_width,
        "fixed_height": fixed_height,
        "meta": result,
    }
