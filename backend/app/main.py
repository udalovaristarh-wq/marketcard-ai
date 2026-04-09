from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from app.routers.system import router as system_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db import create_db_and_tables
from app.routers.auth import router as auth_router
from app.routers.products import router as products_router
from app.routes.ai_generate import router as ai_router
from app.routes.listing_generate import router as listing_generate_router
from app.routes.full_generate import router as full_generate_router
from app.routes.ikpu import router as ikpu_router
from app.routers import admin
from app.routers.admin_finance import router as admin_finance_router
from app.routers.admin_analytics import router as admin_analytics_router


app = FastAPI(
    title="MarketCard AI",
    debug=True,
    root_path="/api",
)
app.include_router(admin.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_DIR = Path(__file__).resolve().parent.parent
GENERATED_DIR = Path("/var/www/marketcard/generated_cards").resolve()
TEMP_DIR = (BACKEND_DIR / "temp").resolve()

GENERATED_DIR.mkdir(parents=True, exist_ok=True)
TEMP_DIR.mkdir(parents=True, exist_ok=True)

app.mount(
    "/generated_cards",
    StaticFiles(directory="/var/www/marketcard/generated_cards"),
    name="generated_cards",
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(products_router, prefix="/products", tags=["products"])
app.include_router(ai_router, prefix="/ai", tags=["ai"])
app.include_router(listing_generate_router, prefix="/listing", tags=["listing"])
app.include_router(full_generate_router, prefix="", tags=["full_generate"])
app.include_router(ikpu_router)
app.include_router(admin.router)
app.include_router(admin_finance_router)
app.include_router(admin_analytics_router)

@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables()


app.include_router(system_router)
