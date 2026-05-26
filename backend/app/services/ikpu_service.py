from __future__ import annotations

from typing import Any
import requests

IKPU_SEARCH_URL = "https://tasnif.soliq.uz/api/cl-api/classifier/search"


def _clean(text: str) -> str:
    return (text or "").strip()


def search_ikpu(query: str) -> list[dict[str, Any]]:
    q = _clean(query)
    if not q:
        return []

    try:
        response = requests.get(
            IKPU_SEARCH_URL,
            params={"search": q},
            timeout=15,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "application/json, text/plain, */*",
                "Origin": "https://tasnif.soliq.uz",
                "Referer": "https://tasnif.soliq.uz/classifier/",
                "Connection": "keep-alive",
            },
        )

        response.raise_for_status()
        data = response.json()

    except Exception:
        # fallback — если soliq отрубил
        return [
            {"code": "000000000", "name": "Не удалось получить ИКПУ (Soliq блокирует запрос)"},
        ]

    items: list[dict[str, Any]] = []

    raw_items = []
    if isinstance(data, list):
        raw_items = data
    elif isinstance(data, dict):
        raw_items = data.get("data") or data.get("items") or data.get("content") or []

    for item in raw_items:
        code = (
            item.get("code")
            or item.get("classCode")
            or item.get("ikpu")
            or ""
        )
        name = (
            item.get("name")
            or item.get("title")
            or item.get("label")
            or ""
        )

        if code and name:
            items.append({
                "code": str(code),
                "name": str(name),
            })

    return items[:10]