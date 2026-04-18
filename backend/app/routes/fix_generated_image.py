from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

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

    try:
        result = generate_card_image(
            product_image_path=str(image_path),
            prompt=fix_prompt,
            output_path=str(output_path),
            size="1024x1536",
            final_size=None,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"fix generation failed: {e}")

    return {
        "success": True,
        "fixed_image_url": f"/generated_cards/{source_folder.name}/{fixed_name}",
        "meta": result,
    }
