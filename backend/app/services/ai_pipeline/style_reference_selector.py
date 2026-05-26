from future import annotations

from pathlib import Path
from typing import Any
import random

BASE_DIR = Path(file).resolve().parents[2] / "style_references"

STYLE_MAP = {
    "electronics": ["tech_dark", "premium_minimal"],
    "auto": ["tech_dark", "marketplace_bold"],
    "fashion": ["luxury_black_gold", "premium_minimal"],
    "beauty": ["luxury_black_gold", "clean_white"],
    "home": ["clean_white", "premium_minimal"],
    "tools": ["tech_dark", "marketplace_bold"],
    "sports": ["marketplace_bold", "tech_dark"],
    "food": ["clean_white", "premium_minimal"],
    "general": ["marketplace_bold"],
}

def pick_style_reference(*, category_type: str, visual_profile: dict[str, Any] | None = None) -> dict[str, Any]:
    category_type = (category_type or "general").strip().lower()
    styles = STYLE_MAP.get(category_type, STYLE_MAP["general"])
    style_key = random.choice(styles)

    style_dir = BASE_DIR / style_key
    refs: list[Path] = []

    if style_dir.exists():
        for ext in ("*.png", "*.jpg", "*.jpeg", "*.webp"):
            refs.extend(style_dir.glob(ext))

    refs = sorted(refs)[:3]

    return {
        "style_key": style_key,
        "reference_images": [str(x) for x in refs],
    }
