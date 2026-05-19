from pathlib import Path
import requests
import hashlib
import time

from app.services.product_intelligence.parsers.uzum_parser import parse_uzum

BASE = Path("/root/marketcard-ai/backend/app/style_references/uzum_parser")

SEARCHES = {
    "electronics": "смартфон",
    "home": "подушка",
    "furniture": "кресло",
    "beauty": "духи",
    "clothes": "футболка",
    "shoes": "кроссовки",
    "accessories": "сумка",
    "auto": "автомагнитола",
    "sport": "гантели",
    "kids": "игрушка",
    "construction": "дрель",
    "appliances": "пылесос",
    "food": "кофе",
    "chemistry": "стиральный порошок",
    "stationery": "ручка",
    "zoo": "корм для кошек",
    "books": "книга",
}

LIMIT = 20


def save_image(url: str, out_dir: Path, idx: int):
    try:
        r = requests.get(
            url,
            timeout=30,
            headers={"User-Agent": "Mozilla/5.0"}
        )

        if r.status_code != 200:
            return False

        if len(r.content) < 10000:
            return False

        h = hashlib.md5(r.content).hexdigest()[:10]

        path = out_dir / f"ref_{idx:03d}_{h}.jpg"
        path.write_bytes(r.content)

        return True

    except Exception:
        return False


for category, query in SEARCHES.items():

    print()
    print("CATEGORY:", category)

    out_dir = BASE / category
    out_dir.mkdir(parents=True, exist_ok=True)

    items = parse_uzum(query, None, 40)

    saved = 0
    seen = set()

    for item in items:

        images = item.get("images") or []

        for img in images:

            if img in seen:
                continue

            seen.add(img)

            ok = save_image(img, out_dir, saved)

            if ok:
                saved += 1
                print("saved", saved, img[:80])

            if saved >= LIMIT:
                break

        if saved >= LIMIT:
            break

    print("TOTAL:", saved)

    time.sleep(2)

print()
print("DONE")
