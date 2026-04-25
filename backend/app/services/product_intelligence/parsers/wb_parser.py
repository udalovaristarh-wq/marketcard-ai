from __future__ import annotations

from typing import Any
from urllib.parse import quote_plus

import requests


def parse_wildberries(query: str, category: str | None = None, limit: int = 30) -> list[dict[str, Any]]:
    url = (
        "https://search.wb.ru/exactmatch/ru/common/v5/search"
        f"?ab_testing=false&appType=1&curr=rub&dest=-1257786"
        f"&query={quote_plus(query)}&resultset=catalog&sort=popular&spp=30"
    )

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "application/json,text/plain,*/*",
        "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
        "Origin": "https://www.wildberries.ru",
        "Referer": "https://www.wildberries.ru/",
    }

    response = requests.get(url, headers=headers, timeout=15)
    response.raise_for_status()

    data = response.json()
    products = data.get("data", {}).get("products", [])

    items: list[dict[str, Any]] = []

    for product in products[:limit]:
        price_u = product.get("salePriceU") or product.get("priceU") or 0
        price = int(price_u / 100) if price_u else 0

        items.append({
            "title": product.get("name") or "",
            "price": price,
            "seller": product.get("supplier") or "Wildberries seller",
            "rating": product.get("reviewRating"),
            "reviews": product.get("feedbacks"),
            "url": f"https://www.wildberries.ru/catalog/{product.get('id')}/detail.aspx" if product.get("id") else "",
            "marketplace": "wildberries",
            "category": category,
        })

    return items
