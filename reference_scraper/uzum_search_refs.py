from pathlib import Path
import time
import hashlib
import requests
from urllib.parse import quote
from playwright.sync_api import sync_playwright

BASE = Path("/root/marketcard-ai/backend/app/style_references/uzum_search")
LIMIT = 20

QUERIES = {
    "electronics": "смартфон",
    "home": "подушка",
    "furniture": "кресло",
    "beauty": "крем",
    "clothes": "футболка",
    "shoes": "кроссовки",
    "auto": "автозапчасти",
    "sport": "гантели",
    "kids": "детская игрушка",
    "construction": "дрель",
    "appliances": "пылесос",
    "food": "кофе",
    "chemistry": "стиральный порошок",
    "stationery": "ручка",
    "zoo": "корм для кошек",
    "books": "книга",
}

def save_image(url: str, out_dir: Path, idx: int) -> bool:
    try:
        r = requests.get(url, timeout=25, headers={"User-Agent": "Mozilla/5.0"})
        if r.status_code != 200 or len(r.content) < 10000:
            return False
        h = hashlib.md5(r.content).hexdigest()[:10]
        (out_dir / f"ref_{idx:03d}_{h}.jpg").write_bytes(r.content)
        return True
    except Exception:
        return False

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 2400})

    for cat, query in QUERIES.items():
        out_dir = BASE / cat
        out_dir.mkdir(parents=True, exist_ok=True)

        url = f"https://uzum.uz/ru/search?query={quote(query)}"
        print("\nSEARCH:", cat, query, url)

        try:
            page.goto(url, wait_until="domcontentloaded", timeout=120000)
        except Exception as e:
            print("OPEN ERROR:", e)
            continue

        time.sleep(8)

        for _ in range(15):
            page.mouse.wheel(0, 5000)
            time.sleep(1)

        image_urls = []
        seen = set()

        for img in page.locator("img").all():
            for attr in ["src", "data-src", "data-original", "srcset"]:
                try:
                    value = img.get_attribute(attr) or ""
                except Exception:
                    value = ""

                for part in value.replace(",", " ").split():
                    if not part.startswith("http"):
                        continue

                    low = part.lower()
                    if any(bad in low for bad in ["logo", "icon", "avatar", "favicon", "svg"]):
                        continue

                    if part in seen:
                        continue

                    seen.add(part)
                    image_urls.append(part)

        print("FOUND URLS:", len(image_urls))

        count = 0

        for src in image_urls:
            if count >= LIMIT:
                break
            if save_image(src, out_dir, count + 1):
                count += 1
                print("saved", count)

        print("TOTAL:", count)

    browser.close()

print("\nDONE")
