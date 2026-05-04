from __future__ import annotations

from pathlib import Path
from typing import Any
import re


_BAD_PATTERNS = [
    r"[A-Za-z]{3,}.*[А-Яа-я]{3,}",
    r"[А-Яа-я]{3,}.*[A-Za-z]{3,}",
]


def _has_bad_text(text: str) -> bool:
    t = (text or "").strip()
    if not t:
        return False
    return any(re.search(p, t) for p in _BAD_PATTERNS)


def check_text_quality(image_path: str) -> dict[str, Any]:
    img = Path(image_path).resolve()
    if not img.exists():
        return {"success": False, "reason": f"image not found: {img}", "needs_regeneration": False}

    try:
        from PIL import Image
        import pytesseract

        image = Image.open(str(img))
        raw = pytesseract.image_to_data(
            image,
            lang="rus+eng",
            output_type=pytesseract.Output.DICT
        )
    except Exception as e:
        return {
            "success": False,
            "provider": "tesseract",
            "reason": str(e),
            "needs_regeneration": False
        }

    texts = []

    for i in range(len(raw["text"])):
        text = (raw["text"][i] or "").strip()
        if not text:
            continue

        try:
            conf = float(raw["conf"][i])
        except Exception:
            conf = 0.0

        texts.append({
            "text": text,
            "confidence": conf / 100 if conf > 1 else conf,
            "bad_pattern": _has_bad_text(text),
        })

    low_conf = [x for x in texts if x["confidence"] < 0.55]
    bad = [x for x in texts if x["bad_pattern"]]

    return {
        "success": True,
        "provider": "tesseract_ru_eng",
        "text_count": len(texts),
        "texts": texts[:40],
        "low_conf_count": len(low_conf),
        "bad_pattern_count": len(bad),
        "needs_regeneration": len(low_conf) >= 3 or len(bad) > 0,
    }
