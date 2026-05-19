from pathlib import Path
import time
import hashlib
import requests
from playwright.sync_api import sync_playwright

BASE = Path("/root/marketcard-ai/backend/app/style_references/uzum_all")
LIMIT_PER_CATEGORY = 20

CATEGORIES = [
    ("electronics", "https://uzum.uz/ru/category/elektronika-10020"),
    ("smartphones", "https://uzum.uz/ru/category/smartfony-i-telefony-10044"),
    ("home", "https://uzum.uz/ru/category/tovary-dlya-doma-10015"),
    ("furniture", "https://uzum.uz/ru/category/mebel-10022"),
    ("beauty", "https://uzum.uz/ru/category/krasota-i-uhod-10013"),
    ("clothes", "https://uzum.uz/ru/category/odezhda-10007"),
    ("shoes", "https://uzum.uz/ru/category/obuv-10011"),
    ("accessories", "https://uzum.uz/ru/category/aksessuary-10012"),
    ("auto", "https://uzum.uz/ru/category/avtotovary-10024"),
    ("sport", "https://uzum.uz/ru/category/sport-i-otdyh-10018"),
    ("kids", "https://uzum.uz/ru/category/detskie-tovary-10016"),
    ("construction", "https://uzum.uz/ru/category/stroitelstvo-i-remont-10014"),
    ("appliances", "https://uzum.uz/ru/category/bytovaya-tehnika-10021"),
    ("food", "https://uzum.uz/ru/category/produkty-pitaniya-10019"),
    ("chemistry", "https://uzum.uz/ru/category/bytovaya-himiya-10017"),
    ("stationery", "https://uzum.uz/ru/category/kantselyariya-10027"),
    ("zoo", "https://uzum.uz/ru/category/zootovary-10026"),
    ("books", "https://uzum.uz/ru/category/knigi-10025"),
]

def save_image(url: str, out_dir: Path, idx: int) -> bool:
    try:
        r = requests.get(url, timeout=25, headers={"User-Agent": "Mozilla/5.0"})
        if r.status_code != 200 or len(r.content) < 15000:
            return False
        h = hashlib.md5(r.content).hexdigest()[:10]
        out = out_dir / f"ref_{idx:03d}_{h}.jpg"
        out.write_bytes(r.content)
        return True
    except Exception:
        return False

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 2400})

    for cat_name, cat_url in CATEGORIES:
        folder = BASE / cat_name
        folder.mkdir(parents=True, exist_ok=True)

        print("\nCATEGORY:", cat_name)

        try:
            page.goto(cat_url, wait_until="domcontentloaded", timeout=120000)
        except Exception as e:
            print("OPEN ERROR:", e)
            continue

        time.sleep(8)

        for _ in range(15):
            page.mouse.wheel(0, 5000)
            time.sleep(1)

        image_urls = []
        seen = set()

        imgs = page.locator("img").all()

        for img in imgs:
            for attr in ["src", "data-src", "data-original", "srcset"]:
                try:
                    value = img.get_attribute(attr) or ""
                except Exception:
                    value = ""

                if not value:
                    continue

                parts = value.replace(",", " ").split()

                for src in parts:
                    if not src.startswith("http"):
                        continue

                    low = src.lower()

                    if any(bad in low for bad in ["logo", "icon", "avatar", "favicon", "svg"]):
                        continue

                    if src in seen:
                        continue

                    seen.add(src)
                    image_urls.append(src)

        print("FOUND URLS:", len(image_urls))

        count = 0

        for src in image_urls:
            if count >= LIMIT_PER_CATEGORY:
                break

            if save_image(src, folder, count + 1):
                count += 1
                print("saved", count)

        print("TOTAL:", count)

    browser.close()

print("\nDONE")
