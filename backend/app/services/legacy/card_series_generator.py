from __future__ import annotations

from pathlib import Path
from typing import Any

from PIL import Image

from app.services.product_analyzer import analyze_product
from app.services.render_engine import render_card
from app.services.listing_generator import generate_ai_content


def build_fallback_copy(
    title: str,
    brand: str,
    category_type: str,
) -> dict[str, Any]:
    if category_type == "auto":
        return {
            "headline": title,
            "subheadline": brand,
            "benefits": [
                "Надёжная конструкция",
                "Точная посадка",
                "Долгий срок службы",
                "Стабильная работа",
            ],
            "specs": [
                f"Бренд: {brand}",
                "Тип: автозапчасть",
                "Состояние: новый",
                "Качественные материалы",
            ],
        }

    if category_type == "electronics":
        return {
            "headline": title,
            "subheadline": brand,
            "benefits": [
                "Современные технологии",
                "Высокое качество",
                "Комфортное использование",
                "Стабильная работа",
            ],
            "specs": [
                f"Бренд: {brand}",
                "Тип: электроника",
                "Удобный формат",
                "Надёжная сборка",
            ],
        }

    return {
        "headline": title,
        "subheadline": brand,
        "benefits": [
            "Высокое качество",
            "Продуманная конструкция",
            "Удобное использование",
            "Долгий срок службы",
        ],
        "specs": [
            f"Бренд: {brand}",
            "Новый товар",
            "Качественные материалы",
            "Надёжное исполнение",
        ],
    }


def normalize_slide_type(slide_type: str) -> str:
    value = str(slide_type).strip().lower()
    mapping = {
        "hero": "hero",
        "benefits": "benefits",
        "specs": "specs",
        "usage": "usage",
        "trust": "trust",
        "details": "specs",
        "package": "trust",
    }
    return mapping.get(value, "hero")


def fallback_slide_plan() -> list[dict[str, Any]]:
    return [
        {"type": "hero", "headline": "Главный слайд", "subheadline": "", "bullets": []},
        {"type": "benefits", "headline": "Преимущества", "subheadline": "", "bullets": []},
        {"type": "specs", "headline": "Характеристики", "subheadline": "", "bullets": []},
        {"type": "usage", "headline": "Функции", "subheadline": "", "bullets": []},
        {"type": "trust", "headline": "Качество и доверие", "subheadline": "", "bullets": []},
    ]


def pick_slide_count(slides: list[dict[str, Any]], variant_count: int) -> list[dict[str, Any]]:
    if variant_count <= 1:
        return slides[:1]
    if variant_count <= 3:
        return slides[:3]
    return slides[:5]


def generate_card_series(
    product_image: str,
    output_dir: str,
    title: str,
    brand: str,
    category: str,
    marketplace: str = "uzum",
    language_mode: str = "ru",
    style_mode: str = "premium",
    variant_count: int = 5,
) -> list[str]:
    image_path = Path(product_image)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    img = Image.open(image_path)
    profile = analyze_product(
        title=title,
        category=category,
        image_width=img.width,
        image_height=img.height,
    )
    category_type = profile["category_type"]

    ai_listing = generate_ai_content(
        title=title,
        brand=brand,
        category=category,
        marketplace=marketplace,
    )

    fallback = build_fallback_copy(
        title=title,
        brand=brand,
        category_type=category_type,
    )

    ai_slides = []
    if ai_listing and isinstance(ai_listing.get("slides"), list):
        ai_slides = ai_listing["slides"]

    if not ai_slides:
        ai_slides = fallback_slide_plan()

    selected_slides = pick_slide_count(ai_slides, variant_count)

    generated_files: list[str] = []
    for index, slide in enumerate(selected_slides, start=1):
        slide_type = normalize_slide_type(slide.get("type", "hero"))

        bullets = slide.get("bullets") if isinstance(slide.get("bullets"), list) else []
        bullets = [str(x).strip() for x in bullets if str(x).strip()][:5]

        if slide_type == "specs" and not bullets:
            bullets = fallback["specs"][:4]

        if slide_type != "specs" and not bullets:
            bullets = fallback["benefits"][:4]

        slide_copy = {
            "headline": str(slide.get("headline") or title).strip(),
            "subheadline": str(slide.get("subheadline") or brand).strip(),
            "benefits": bullets,
            "specs": fallback["specs"][:4],
            "badge": brand or "Premium",
            "language_mode": language_mode,
            "slide_type": slide_type,
            "category_type": category_type,
            "shape": profile.get("shape", "compact"),
            "complexity": profile.get("complexity", "medium"),
            "text_density": profile.get("text_density", "medium"),
            "marketplace": marketplace,
            "style_mode": style_mode,
            "ai_listing": ai_listing or {},
        }

        output_file = output_path / f"slide_{index}_{slide_type}.png"

        render_card(
            product_image=str(image_path),
            output_path=str(output_file),
            copy_data=slide_copy,
            brand=brand,
            marketplace=marketplace,
            style_name=style_mode,
            variant_index=index - 1,
        )

        generated_files.append(str(output_file))

    return generated_files