from typing import Any
from playwright.sync_api import sync_playwright
import json

def parse_ozon(query: str, category: str | None = None, limit: int = 30) -> list[dict[str, Any]]:
    items = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        page = browser.new_page()

        url = f"https://www.ozon.ru/search/?text={query}"
        page.goto(url, timeout=60000)
        page.wait_for_timeout(7000)
        page.wait_for_timeout(5000)

        content = page.content()

        # ищем встроенный JSON
        start = content.find("window.INITIAL_STATE")
        if start == -1:
            browser.close()
            return []

        json_start = content.find("{", start)
        json_end = content.find("</script>", json_start)

        raw = content[json_start:json_end]

        try:
            data = json.loads(raw)
        except:
            browser.close()
            return []

        try:
            products = data["search"]["items"]
        except:
            browser.close()
            return []

        for p in products[:limit]:
            try:
                price = int(p["price"]["price"])
            except:
                price = 0

            items.append({
                "title": p.get("title", ""),
                "price": price,
                "seller": "Ozon seller",
                "rating": None,
                "reviews": None,
                "url": f"https://www.ozon.ru{p.get('action', {}).get('link', '')}",
                "marketplace": "ozon",
                "category": category,
            })

        browser.close()

    return items
