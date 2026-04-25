from __future__ import annotations

import re
from typing import Any
from urllib.parse import quote_plus

import requests


def _clean_text(value: str) -> str:
    value = re.sub(r"\\u[0-9a-fA-F]{4}", " ", value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def parse_yandex_market(query: str, category: str | None = None, limit: int = 30) -> list[dict[str, Any]]:
    search_url = f"https://market.yandex.ru/search?text={quote_plus(query)}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
        "Referer": "https://market.yandex.ru/",
    }

    response = requests.get(search_url, headers=headers, timeout=20)
    response.raise_for_status()

    html = response.text

    titles = re.findall(r'"name"\s*:\s*"([^"]{3,160})"', html)
    prices = re.findall(r'"price"\s*:\s*"?(\d[\d\s]*)', html)

    items: list[dict[str, Any]] = []

    for index, title in enumerate(titles[:limit]):
        raw_price = prices[index] if index < len(prices) else ""
        price_digits = "".join(ch for ch in raw_price if ch.isdigit())
        price = int(price_digits) if price_digits else 0

        items.append({
            "title": _clean_text(title),
            "price": price,
            "seller": "Yandex Market seller",
            "rating": None,
            "reviews": None,
            "url": search_url,
            "marketplace": "yandex",
            "category": category,
        })

    return items[:limit]
