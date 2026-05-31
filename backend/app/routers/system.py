from datetime import datetime, timedelta
from fastapi import APIRouter

import psutil

router = APIRouter(prefix="/system", tags=["system"])

ONLINE_USERS: dict[str, datetime] = {}
ONLINE_WINDOW_MINUTES = 5


def _cleanup_online() -> None:
    threshold = datetime.utcnow() - timedelta(minutes=ONLINE_WINDOW_MINUTES)
    expired = [email for email, seen in ONLINE_USERS.items() if seen < threshold]
    for email in expired:
        ONLINE_USERS.pop(email, None)


@router.get("/stats")
def get_system_stats():
    cpu = psutil.cpu_percent(interval=None)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage("/").percent

    load_percent = int((cpu + memory + disk) / 3)

    return {
        "cpu": cpu,
        "memory": memory,
        "disk": disk,
        "load_percent": load_percent,
    }


@router.post("/ping")
def ping(email: str):
    email = (email or "").strip().lower()
    if not email:
        return {"ok": False, "error": "email_required"}

    ONLINE_USERS[email] = datetime.utcnow()
    _cleanup_online()
    return {"ok": True, "online": len(ONLINE_USERS)}


@router.get("/online-count")
def get_online_count():
    _cleanup_online()
    return {"online": len(ONLINE_USERS), "window_minutes": ONLINE_WINDOW_MINUTES}
