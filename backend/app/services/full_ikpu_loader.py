from __future__ import annotations

from collections import deque
from datetime import datetime
from typing import Any, Iterable
import json
import time

import requests
from sqlmodel import Session, select

from app.db import engine
from app.models.ikpu import IKPU


SEARCH_URL = "https://tasnif.soliq.uz/api/cl-api/classifier/search"

ALPHABET = list("abcdefghijklmnopqrstuvwxyz0123456789абвгдеёжзийклмнопрстуфхцчшщэюя")
REQUEST_TIMEOUT = 40
SLEEP_BETWEEN_REQUESTS = 3
MAX_ITEMS_PER_QUERY_HINT = 50
MAX_PREFIX_LEN = 4


def normalize_items(data: Any) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []

    raw_list: Iterable[Any]
    if isinstance(data, list):
        raw_list = data
    elif isinstance(data, dict):
        if isinstance(data.get("items"), list):
            raw_list = data["items"]
        elif isinstance(data.get("data"), list):
            raw_list = data["data"]
        elif isinstance(data.get("results"), list):
            raw_list = data["results"]
        else:
            raw_list = []
    else:
        raw_list = []

    for row in raw_list:
        if not isinstance(row, dict):
            continue

        code = str(
            row.get("code")
            or row.get("ikpu")
            or row.get("value")
            or ""
        ).strip()

        name = str(
            row.get("name")
            or row.get("label")
            or row.get("title")
            or ""
        ).strip()

        if not code or not name:
            continue

        items.append({"code": code, "name": name})

    return items


def fetch_prefix(prefix: str) -> list[dict[str, str]]:
    resp = requests.get(
        SEARCH_URL,
        params={"search": prefix},
        timeout=REQUEST_TIMEOUT,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json,text/plain,*/*",
        },
    )
    resp.raise_for_status()

    try:
        data = resp.json()
    except json.JSONDecodeError:
        return []

    return normalize_items(data)


def upsert_items(session: Session, items: list[dict[str, str]], source_query: str) -> int:
    added_or_updated = 0

    for item in items:
        code = item["code"]
        name = item["name"]

        existing = session.exec(select(IKPU).where(IKPU.code == code)).first()

        if existing:
            changed = False

            if existing.name != name:
                existing.name = name
                changed = True

            if existing.source_query != source_query:
                existing.source_query = source_query
                changed = True

            if changed:
                existing.updated_at = datetime.utcnow()
                session.add(existing)
                added_or_updated += 1
        else:
            session.add(
                IKPU(
                    code=code,
                    name=name,
                    source_query=source_query,
                    updated_at=datetime.utcnow(),
                )
            )
            added_or_updated += 1

    session.commit()
    return added_or_updated


def load_full_ikpu() -> dict[str, int]:
    checked_prefixes: set[str] = set()
    queue: deque[str] = deque(ALPHABET)

    total_requests = 0
    total_saved = 0
    total_unique_prefixes = 0

    with Session(engine) as session:
        while queue:
            prefix = queue.popleft()

            if prefix in checked_prefixes:
                continue

            checked_prefixes.add(prefix)
            total_unique_prefixes += 1

            try:
                items = fetch_prefix(prefix)
                total_requests += 1

                if items:
                    total_saved += upsert_items(session, items, prefix)

                if len(items) >= MAX_ITEMS_PER_QUERY_HINT and len(prefix) < MAX_PREFIX_LEN:
                    for ch in ALPHABET:
                        queue.append(prefix + ch)
                        print(
                    f"[IKPU] prefix={prefix!r} items={len(items)} "
                    f"saved={total_saved} requests={total_requests}"
                )

            except Exception as e:
                print(f"[IKPU][ERROR] prefix={prefix!r}: {e}")

            time.sleep(SLEEP_BETWEEN_REQUESTS)

    return {
        "requests": total_requests,
        "saved": total_saved,
        "prefixes": total_unique_prefixes,
    }


if __name__ == "__main__":
    result = load_full_ikpu()
    print("DONE:", result)