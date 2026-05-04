from __future__ import annotations

from fastapi import APIRouter, UploadFile, File, Form
from pathlib import Path
import shutil
import uuid

from app.services.next_gen.full_generate_service_v2 import run_full_generation_v2

router = APIRouter(prefix="/test-next-gen", tags=["test-next-gen"])

TEMP_DIR = Path("/root/marketcard-ai/backend/temp_test_nextgen")
TEMP_DIR.mkdir(parents=True, exist_ok=True)


@router.post("")
async def test_next_gen(
    product_image: UploadFile = File(...),
    product_title: str = Form(...),
    category: str = Form(""),
    brand: str = Form(""),
    marketplace: str = Form("uzum"),
):
    ext = Path(product_image.filename).suffix or ".png"
    temp_name = f"{uuid.uuid4().hex}{ext}"
    temp_path = TEMP_DIR / temp_name

    with open(temp_path, "wb") as f:
        shutil.copyfileobj(product_image.file, f)

    result = run_full_generation_v2(
        product_image_path=str(temp_path),
        product_title=product_title,
        category=category,
        brand=brand,
        marketplace=marketplace,
        language="ru",
        variant_count=1,
    )

    return {
        "success": True,
        "mode": "next_gen_v2_test",
        "result": result,
    }
