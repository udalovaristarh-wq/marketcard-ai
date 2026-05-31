from __future__ import annotations

import os
import re
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, func, select
from PIL import Image, ImageOps

from app.db import engine
from app.models.user import User
from app.security import get_current_user
from app.services.ai_pipeline.image_generator import generate_card_image

router = APIRouter(tags=["fix-image"])

GENERATED_ROOT = Path(
    os.getenv("GENERATED_CARDS_DIR", "/var/www/marketcard/generated_cards")
).resolve()


class FixImageRequest(BaseModel):
    image_url: str
    fix_prompt: str


def _resolve_local_generated_path(image_url: str) -> Path:
    if not image_url.startswith("/generated_cards/"):
        raise HTTPException(status_code=400, detail="image_url must start with /generated_cards/")

    rel = image_url.replace("/generated_cards/", "", 1)
    if ".." in rel.split("/"):
        raise HTTPException(status_code=400, detail="Invalid image path")

    path = (GENERATED_ROOT / rel).resolve()

    try:
        path.relative_to(GENERATED_ROOT)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid image path") from exc

    if not path.exists():
        raise HTTPException(status_code=404, detail="image file not found")

    return path


@router.post("/fix-generated-image")
def fix_generated_image(
    payload: FixImageRequest,
    current_user: User = Depends(get_current_user),
):
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

    try:
        result = generate_card_image(
            product_image_path=str(image_path),
            prompt=fix_prompt,
            output_path=str(output_path),
            size=openai_size,
            final_size=(original_width, original_height),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"fix generation failed: {e}") from e

    with Image.open(output_path) as fixed_img:
        fixed_width, fixed_height = fixed_img.size

    with Image.open(output_path) as img:
        img = ImageOps.fit(img, (original_width, original_height))
        img.save(output_path)

    try:
        root_stem = re.sub(r"_fixed_[0-9a-fA-F]{8}.*$", "", image_path.stem)
        counter_file = source_folder / f"{root_stem}_fixcount.txt"

        if counter_file.exists():
            fix_count = int(counter_file.read_text().strip() or "0")
        else:
            fix_count = 0

        fix_count += 1
        counter_file.write_text(str(fix_count))

        if fix_count > 3:
            with Session(engine) as session:
                user = session.get(User, current_user.id)
                if user:
                    user.tariff_generations_used = int(user.tariff_generations_used or 0) + 1
                    user.tariff_generations_left = max(
                        0,
                        int(user.tariff_generations_total or 0) - user.tariff_generations_used,
                    )
                    session.add(user)
                    session.commit()

    except Exception as e:
        print("FIX IMAGE USAGE ERROR:", e)

    return {
        "success": True,
        "fixed_image_url": f"/generated_cards/{source_folder.name}/{fixed_name}",
        "original_width": original_width,
        "original_height": original_height,
        "fixed_width": fixed_width,
        "fixed_height": fixed_height,
        "meta": result,
    }
