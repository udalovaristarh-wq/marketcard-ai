from typing import Any
import requests
from urllib.parse import quote_plus

def parse_yandex(query: str, category: str | None = None, limit: int = 30) -> list[dict[str, Any]]:
    url = f"https://market.yandex.ru/api/search?text={quote_plus(query)}"

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
    }

    try:
        r = requests.get(url, headers=headers, timeout=15)
        if r.status_code != 200:
            return []
        data = r.json()
    except:
        return []

    items = []

    try:
        products = data.get("items", [])
    except:
        products = []

    for p in products[:limit]:
        try:
            price = int(p.get("price", {}).get("value", 0))
        except:
            price = 0

        items.append({
            "title": p.get("name", ""),
            "price": price,
            "seller": p.get("shop", {}).get("name", "Yandex seller"),
            "rating": p.get("rating"),
            "reviews": p.get("reviews"),
            "url": p.get("link", ""),
            "marketplace": "yandex",
            "category": category,
        })

    return items
