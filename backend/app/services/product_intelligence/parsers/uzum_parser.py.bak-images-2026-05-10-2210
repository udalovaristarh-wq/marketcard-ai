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
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled"
            ],
        )

        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080},
            locale="ru-RU"
        )

        page = context.new_page()

        page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            Object.defineProperty(navigator, 'platform', {get: () => 'Win32'});
            Object.defineProperty(navigator, 'languages', {get: () => ['ru-RU','ru','en-US','en']});
        """)

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
                    seen = {x.get("url") for x in result_items}
                    for item in items:
                        if item.get("url") not in seen:
                            result_items.append(item)
                            seen.add(item.get("url"))
                        if len(result_items) >= limit:
                            break

            except Exception:
                return

        page.on("response", on_response)
        page.goto(search_url, timeout=60000, wait_until="domcontentloaded")
        page.wait_for_timeout(3000)

        # DOM fallback если GraphQL пустой
        if not result_items:
            import re
            cards = page.locator('a[href*="/product/"]').all()[:limit * 3]
            seen = set()

            for card in cards:
                try:
                    href = card.get_attribute("href") or ""
                    raw_text = (card.inner_text() or "").strip()

                    if not href or "/product/" not in href:
                        continue

                    full_url = href if href.startswith("http") else f"https://uzum.uz{href}"

                    if full_url in seen:
                        continue

                    seen.add(full_url)

                    lines = [x.strip() for x in raw_text.splitlines() if x.strip()]
                    clean_title = lines[0][:300] if lines else "Товар Uzum"

                    price = 0
                    nums = re.findall(r'\d[\d\s]{2,}', raw_text.replace("\xa0", " "))
                    if nums:
                        try:
                            price = int(nums[0].replace(" ", ""))
                        except Exception:
                            price = 0

                    result_items.append({
                        "title": clean_title,
                        "price": price or 1,
                        "seller": "uzum",
                        "rating": None,
                        "reviews": None,
                        "url": full_url,
                        "marketplace": "uzum",
                        "category": category,
                    })

                    if len(result_items) >= limit:
                        break

                except Exception:
                    continue

        for _ in range(12):
            if len(result_items) >= limit:
                break
            page.mouse.wheel(0, 2500)
            page.wait_for_timeout(1200)

        page.wait_for_timeout(2500)
        browser.close()

    return result_items[:limit]
