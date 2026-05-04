from __future__ import annotations

import os
from pathlib import Path


def process_with_photoroom(image_path: str, output_path: str) -> dict:
    api_key = os.getenv("PHOTOROOM_API_KEY")
    if not api_key:
        return {"success": False, "skipped": True, "reason": "PHOTOROOM_API_KEY is not set"}

    # TODO: подключим реальный вызов PhotoRoom после добавления API key
    return {"success": False, "skipped": True, "reason": "PhotoRoom API call not implemented yet"}
