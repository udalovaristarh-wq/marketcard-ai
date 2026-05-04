from future import annotations

import os


def process_with_clipdrop(image_path: str, output_path: str, prompt: str = "") -> dict:
    api_key = os.getenv("CLIPDROP_API_KEY")
    if not api_key:
        return {"success": False, "skipped": True, "reason": "CLIPDROP_API_KEY is not set"}

    # TODO: подключим реальный вызов Clipdrop после добавления API key
    return {"success": False, "skipped": True, "reason": "Clipdrop API call not implemented yet"}
