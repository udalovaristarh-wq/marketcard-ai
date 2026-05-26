from __future__ import annotations

import os


def process_with_claid(image_path: str, output_path: str) -> dict:
    api_key = os.getenv("CLAID_API_KEY")
    if not api_key:
        return {"success": False, "skipped": True, "reason": "CLAID_API_KEY is not set"}

    # TODO: подключим реальный вызов Claid после добавления API key
    return {"success": False, "skipped": True, "reason": "Claid API call not implemented yet"}
