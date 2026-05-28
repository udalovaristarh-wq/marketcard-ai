from __future__ import annotations

from datetime import datetime
from typing import Any, Iterable
import os
import re

import requests
from sqlmodel import Session, select

from app.db import engine
from app.models.ikpu import IKPU


DEFAULT_SOLIQ_URL = "https://tasnif.soliq.uz/api/cl-api/classifier/search"
SOLIQ_SEARCH_URLS = [
    url.strip()
    for url in os.getenv("SOLIQ_IKPU_SEARCH_URLS", DEFAULT_SOLIQ_URL).split(",")
    if url.strip()
]
REQUEST_TIMEOUT = int(os.getenv("SOLIQ_IKPU_TIMEOUT", "18"))

CODE_KEYS = (
    "code",
    "classCode",
    "mxikCode",
    "mxik_code",
    "mxik",
    "ikpu",
    "ikpuCode",
    "catalogCode",
)
NAME_KEYS = (
    "name",
    "title",
    "label",
    "className",
    "fullName",
    "productName",
    "mxikName",
    "ruName",
)


def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "")).strip()


def _norm(text: str) -> str:
    value = _clean(text).lower()
    value = value.replace("ё", "е")
    return re.sub(r"[^0-9a-zа-я]+", " ", value).strip()


def _tokens(text: str) -> list[str]:
    return [token for token in _norm(text).split() if len(token) > 1]


def _walk_dicts(payload: Any) -> Iterable[dict[str, Any]]:
    if isinstance(payload, dict):
        yield payload
        for value in payload.values():
            yield from _walk_dicts(value)
    elif isinstance(payload, list):
        for value in payload:
            yield from _walk_dicts(value)


def _first_value(row: dict[str, Any], keys: tuple[str, ...]) -> str:
    for key in keys:
        value = row.get(key)
        if value not in (None, ""):
            return _clean(str(value))
    return ""


def normalize_items(payload: Any, *, source: str = "soliq") -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    seen: set[str] = set()

    for row in _walk_dicts(payload):
        code = _first_value(row, CODE_KEYS)
        name = _first_value(row, NAME_KEYS)

        if not code or not name:
            continue

        code = re.sub(r"\s+", "", code)
        if code in seen:
            continue

        seen.add(code)
        items.append(
            {
                "code": code,
                "name": name,
                "source": source,
            }
        )

    return items


def _score_item(query: str, item: dict[str, Any]) -> int:
    query_norm = _norm(query)
    name_norm = _norm(str(item.get("name", "")))
    code_norm = _norm(str(item.get("code", "")))

    if not query_norm:
        return 0

    score = 0
    if query_norm == code_norm:
        score += 120
    if query_norm == name_norm:
        score += 100
    if query_norm in name_norm:
        score += 45
    if code_norm and query_norm in code_norm:
        score += 35

    for token in _tokens(query):
        if token in name_norm:
            score += 15
        if token in code_norm:
            score += 8

    if item.get("source") == "local":
        score += 6
    return score


def _dedupe_rank(query: str, items: list[dict[str, Any]], limit: int) -> list[dict[str, Any]]:
    by_code: dict[str, dict[str, Any]] = {}

    for item in items:
        code = str(item.get("code") or "").strip()
        name = str(item.get("name") or "").strip()
        if not code or not name:
            continue

        score = _score_item(query, item)
        normalized = {
            "code": code,
            "name": name,
            "source": item.get("source", "unknown"),
            "score": score,
        }

        if code not in by_code or score > int(by_code[code].get("score", 0)):
            by_code[code] = normalized

    return sorted(
        by_code.values(),
        key=lambda row: (int(row.get("score", 0)), row.get("source") == "local"),
        reverse=True,
    )[:limit]


def _search_local(query: str, limit: int) -> list[dict[str, Any]]:
    q = _clean(query)
    if not q:
        return []

    with Session(engine) as session:
        rows = session.exec(
            select(IKPU)
            .where((IKPU.name.ilike(f"%{q}%")) | (IKPU.code.ilike(f"%{q}%")))
            .limit(max(limit * 2, 20))
        ).all()

    return [
        {
            "code": row.code,
            "name": row.name,
            "source": "local",
        }
        for row in rows
    ]


def _search_soliq(query: str) -> list[dict[str, Any]]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json, text/plain, */*",
        "Origin": "https://tasnif.soliq.uz",
        "Referer": "https://tasnif.soliq.uz/classifier/",
    }

    for url in SOLIQ_SEARCH_URLS:
        try:
            response = requests.get(
                url,
                params={"search": query, "q": query, "lang": "ru"},
                timeout=REQUEST_TIMEOUT,
                headers=headers,
            )
            response.raise_for_status()
            return normalize_items(response.json(), source="soliq")
        except Exception:
            continue

    return []


def _upsert_local(items: list[dict[str, Any]], source_query: str) -> None:
    if not items:
        return

    with Session(engine) as session:
        for item in items:
            code = str(item.get("code") or "").strip()
            name = str(item.get("name") or "").strip()
            if not code or not name:
                continue

            existing = session.exec(select(IKPU).where(IKPU.code == code)).first()
            if existing:
                existing.name = name
                existing.source_query = source_query
                existing.updated_at = datetime.utcnow()
                session.add(existing)
            else:
                session.add(
                    IKPU(
                        code=code,
                        name=name,
                        source_query=source_query,
                        updated_at=datetime.utcnow(),
                    )
                )
        session.commit()


def search_ikpu(query: str, limit: int = 10) -> list[dict[str, Any]]:
    q = _clean(query)
    if not q:
        return []

    local_items = _search_local(q, limit)
    remote_items = _search_soliq(q)
    _upsert_local(remote_items, q)

    ranked = _dedupe_rank(q, local_items + remote_items, limit)
    if ranked:
        return ranked

    return [
        {
            "code": "",
            "name": "ИКПУ не найден. Уточните название товара, категорию или бренд.",
            "source": "empty",
            "score": 0,
        }
    ]


def suggest_ikpu_for_product(
    *,
    title: str,
    brand: str = "",
    category: str = "",
    description: str = "",
    limit: int = 8,
) -> dict[str, Any]:
    queries = [
        f"{title} {category}".strip(),
        f"{title} {brand}".strip(),
        title,
        category,
        description,
    ]

    collected: list[dict[str, Any]] = []
    for query in queries:
        if len(_clean(query)) < 2:
            continue
        collected.extend(search_ikpu(query, limit=limit))

    ranked = _dedupe_rank(" ".join(_tokens(" ".join(queries))), collected, limit)
    return {
        "success": True,
        "query": " ".join(part for part in [title, brand, category] if part),
        "best": ranked[0] if ranked else None,
        "items": ranked,
    }
