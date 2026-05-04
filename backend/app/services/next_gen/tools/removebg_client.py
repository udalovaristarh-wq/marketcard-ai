from __future__ import annotations

import os


def process_with_removebg(image_path: str, output_path: str) -> dict:
    api_key = os.getenv("REMOVEBG_API_KEY")
    if not api_key:
        return {"success": False, "skipped": True, "reason": "REMOVEBG_API_KEY is not set"}

    # TODO: подключим реальный вызов remove.bg после добавления API key
    return {"success": False, "skipped": True, "reason": "RemoveBG API call not implemented yet"}
