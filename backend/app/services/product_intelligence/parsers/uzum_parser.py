from __future__ import annotations

from typing import Any
from urllib.parse import quote_plus
from playwright.sync_api import sync_playwright


def _price(card: dict[str, Any]) -> int:
    for key in ("minSellPrice", "minFullPrice"):
        v = card.get(key)
        if isinstance(v, (int, float)) and v > 0:
            return int(v)

    for opt in card.get("buyingOptions") or []:
        pb = opt.get("priceBlock") or {}
        for pkey in ("finalPrice", "sellPrice", "fullPrice", "sellerPrice"):
            amount = (pb.get(pkey) or {}).get("amount")
            if isinstance(amount, (int, float)) and amount > 0:
                return int(amount)

    return 0


def parse_uzum(query: str, category: str | None = None, limit: int = 30) -> list[dict[str, Any]]:
    result_items: list[dict[str, Any]] = []
    search_url = f"https://uzum.uz/ru/search?query={quote_plus(query)}"

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        page = browser.new_page()

        def on_response(resp):
            nonlocal result_items
            if "graphql.uzum.uz" not in resp.url:
                return

            try:
                req_data = resp.request.post_data or ""
                if "MakeSearch_ItemsAndFilters" not in req_data:
                    return

                data = resp.json()
                rows = (((data.get("data") or {}).get("makeSearch") or {}).get("items") or [])

                items: list[dict[str, Any]] = []
                for row in rows:
                    card = row.get("catalogCard") or {}
                    title = (card.get("title") or "").strip()
                    price = _price(card)

                    if not title or price <= 0:
                        continue

                    product_id = card.get("productId") or card.get("id")
                    items.append({
                        "title": title,
                        "price": price,
                        "seller": "uzum",
                        "rating": card.get("rating"),
                        "reviews": card.get("feedbackQuantity"),
                        "url": f"https://uzum.uz/ru/product/{product_id}" if product_id else "",
                        "marketplace": "uzum",
                        "category": category,
                    })

                if items:
                    result_items = items[:limit]

            except Exception:
                return

        page.on("response", on_response)
        page.goto(search_url, timeout=60000, wait_until="domcontentloaded")
        page.wait_for_timeout(12000)
        browser.close()

    return result_items[:limit]
