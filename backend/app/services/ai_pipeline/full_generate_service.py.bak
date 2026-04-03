from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List
import uuid

from app.services.ai_pipeline.series_planner import build_series_plan
from app.services.ai_pipeline.prompt_builder import build_series_prompts
from app.services.ai_pipeline.image_generator import generate_series_images
from app.services.ai_pipeline.visual_profile_builder import build_visual_profile
from app.services.ai_pipeline.seo_generator import generate_listing

BACKEND_DIR = Path(__file__).resolve().parents[3]
GENERATED_DIR = (BACKEND_DIR / "generated_cards").resolve()


def _clean_text(value: Any) -> str:
    return str(value or "").strip()


def _split_features(raw: str) -> List[str]:
    text = _clean_text(raw)
    if not text:
        return []

    for sep in ["\n", ";", "|"]:
        text = text.replace(sep, ",")

    items: List[str] = []
    for part in text.split(","):
        part = part.strip()
        if part:
            items.append(part)

    return items[:8]


def _resolve_output_size(marketplace_profile: dict[str, Any]) -> str:
    width = int(marketplace_profile.get("width", 1080))
    height = int(marketplace_profile.get("height", 1440))

    if width == height:
        return "1024x1024"
    if height > width:
        return "1024x1536"
    return "1536x1024"


def full_generate(payload: Dict[str, Any]) -> Dict[str, Any]:
    product_title = _clean_text(payload.get("product_title"))
    brand = _clean_text(payload.get("brand"))
    category = _clean_text(payload.get("category"))
    purpose = _clean_text(payload.get("purpose"))
    compatibility = _clean_text(payload.get("compatibility"))
    marketplace = _clean_text(payload.get("marketplace")) or "uzum"
    language_mode = _clean_text(payload.get("language_mode")) or "ru"
    product_image = _clean_text(payload.get("product_image"))

    extra_features = _split_features(
        ", ".join(
            [
                purpose,
                compatibility,
                _clean_text(payload.get("extra_features")),
            ]
        )
    )

    raw_variant_count = payload.get("variant_count", 5)
    try:
        variant_count = int(raw_variant_count)
    except (TypeError, ValueError):
        variant_count = 5

    if variant_count not in [1, 3, 5]:
        variant_count = 5

    if not product_image:
        return {"success": False, "error": "product_image is empty", "slides": []}

    product_image_path = Path(product_image).resolve()
    if not product_image_path.exists():
        return {
            "success": False,
            "error": f"product_image not found: {product_image_path}",
            "slides": [],
        }

    generation_id = uuid.uuid4().hex

    series_plan = build_series_plan(
        product_title=product_title,
        category=category,
        marketplace=marketplace,
        language_mode=language_mode,
        variant_count=variant_count,
    )

    visual_profile = build_visual_profile(
        product_title=product_title,
        brand=brand,
        category=category,
        marketplace=marketplace,
        language_mode=language_mode,
        generation_seed=generation_id,
    )

    prompts = build_series_prompts(
        product_title=product_title,
        brand=brand,
        category=category,
        category_type=series_plan["category_type"],
        marketplace=marketplace,
        marketplace_profile=series_plan["marketplace_profile"],
        language_mode=language_mode,
        slides=series_plan["slides"],
        scene_tags=series_plan.get("scene_tags", []),
        extra_features=extra_features,
        visual_profile=visual_profile,
    )

    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    output_dir = (GENERATED_DIR / generation_id).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    size = _resolve_output_size(series_plan["marketplace_profile"])

    image_results = generate_series_images(
        product_image_path=str(product_image_path),
        prompts=prompts,
        output_dir=str(output_dir),
        size=size,
    )
    listing = generate_listing(
        product_title=product_title,
        brand=brand,
        category=category,
        marketplace=marketplace,
        language=language_mode,
    )

    rendered_slides = [
        item for item in image_results
        if item.get("rendered") and item.get("image_url")
    ]
    failed_slides = [
        item for item in image_results
        if not item.get("rendered")
    ]

    if not rendered_slides:
        return {
            "success": False,
            "error": "All image generations failed",
            "generation_id": generation_id,
            "slides": [],
            "failed_slides": failed_slides,
            "prompts": prompts,
        }

    return {
        "success": True,
        "generation_id": generation_id,
        "slides": rendered_slides,
        "failed_slides": failed_slides,
        "prompts": prompts,
        "slides_count": len(rendered_slides),
        "marketplace": marketplace,
        "language_mode": language_mode,
        "product_title": product_title,
        "brand": brand,
        "category": category,
        "category_type": series_plan["category_type"],
        "marketplace_profile": series_plan["marketplace_profile"],
        "scene_tags": series_plan.get("scene_tags", []),
        "visual_profile": visual_profile,
        "listing": listing,
    }