from __future__ import annotations

import time
from collections import defaultdict
from threading import Lock

from fastapi import HTTPException, Request

_lock = Lock()
_buckets: dict[str, list[float]] = defaultdict(list)


def rate_limit(request: Request, *, key_prefix: str, max_calls: int, window_seconds: int) -> None:
    client = request.client.host if request.client else "unknown"
    forwarded = request.headers.get("x-forwarded-for", "").split(",")[0].strip()
    identity = forwarded or client
    bucket_key = f"{key_prefix}:{identity}"
    now = time.time()
    cutoff = now - window_seconds

    with _lock:
        hits = [ts for ts in _buckets[bucket_key] if ts >= cutoff]
        if len(hits) >= max_calls:
            raise HTTPException(
                status_code=429,
                detail="Слишком много запросов. Попробуйте позже.",
            )
        hits.append(now)
        _buckets[bucket_key] = hits
