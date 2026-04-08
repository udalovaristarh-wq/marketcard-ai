from fastapi import APIRouter
import psutil

router = APIRouter(prefix="/system", tags=["system"])

@router.get("/stats")
def get_system_stats():
    cpu = psutil.cpu_percent(interval=0.5)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent

    load_percent = int((cpu + memory + disk) / 3)

    return {
        "cpu": cpu,
        "memory": memory,
        "disk": disk,
        "load_percent": load_percent
    }
