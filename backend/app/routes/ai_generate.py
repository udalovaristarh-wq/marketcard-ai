from pathlib import Path
import shutil
import uuid

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.services.background_remover import remove_background
from app.services.legacy.card_series_generator import generate_card_series

router = APIRouter(prefix="/ai", tags=["AI Generator"])

TEMP_DIR = Path("temp")
OUTPUT_DIR = Path("generated_cards")

TEMP_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)


def validate_image_filename(filename: str | None) -> None:
    if not filename:
        return

    allowed_ext = {".png", ".jpg", ".jpeg", ".webp"}
    suffix = Path(filename.lower()).suffix

    if suffix and suffix not in allowed_ext:
        raise HTTPException(
            status_code=400,
            detail="Поддерживаются только PNG, JPG, JPEG и WEBP",
        )


@router.post("/generate")
async def generate(
    title: str = Form(...),
    brand: str = Form(...),
    category: str = Form(...),
    marketplace: str = Form("uzum"),
    language_mode: str = Form("ru"),
    style_mode: str = Form("premium"),
    variants_count: int = Form(5),
    image: UploadFile = File(...),
):
    validate_image_filename(image.filename)

    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Нужен файл изображения")

    variants_count = max(1, min(10, variants_count))

    unique = uuid.uuid4().hex
    source_path = TEMP_DIR / f"{unique}.png"
    cutout_path = TEMP_DIR / f"{unique}_cut.png"
    series_output_dir = OUTPUT_DIR / unique
    series_output_dir.mkdir(parents=True, exist_ok=True)

    try:
        with open(source_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        try:
            remove_background(str(source_path), str(cutout_path))
        except Exception:
            shutil.copy(str(source_path), str(cutout_path))

        files = generate_card_series(
            product_image=str(cutout_path),
            output_dir=str(series_output_dir),
            title=title,
            brand=brand,
            category=category,
            marketplace=marketplace,
            language_mode=language_mode,
            style_mode=style_mode,
        )

        files = files[:variants_count]

        variants = [
            f"http://127.0.0.1:8000/generated_cards/{unique}/{Path(file_path).name}"
            for file_path in files
        ]

        return {
            "success": True,
            "title": title,
            "brand": brand,
            "category": category,
            "marketplace": marketplace,
            "language_mode": language_mode,
            "style_mode": style_mode,
            "variants_count": len(variants),
            "variants": variants,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка генерации карточки: {str(e)}",
        )
    finally:
        try:
            image.file.close()
        except Exception:
            pass