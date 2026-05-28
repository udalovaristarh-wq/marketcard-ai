from app.routes import card_audit
from app.routes import product_intelligence
from app.routes import abc_analysis
from app.routes import deficit_products
from app.routes import translate_listing
from app.routes import card_audit
from app.routes import support
from app.routers.payments import router as payments_router
from app.routers.click import router as click_router

from pathlib import Path
import os

from fastapi import FastAPI
from app.routers.analysis import router as analysis_router
from app.routers import analysis
from app.routes.product_intelligence import router as product_intelligence_router
from app.routers.system import router as system_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db import create_db_and_tables
from app.routers.auth import router as auth_router
from app.routers.products import router as products_router
from app.routes.fix_generated_image import router as fix_generated_image_router
from app.routes.ai_generate import router as ai_router
from app.routes.fix_generated_image import router as fix_generated_image_router
from app.routes.listing_generate import router as listing_generate_router
from app.routes.fix_generated_image import router as fix_generated_image_router
from app.routes.full_generate import router as full_generate_router
from app.routes.demo_generate import router as demo_generate_router
from app.routes.product_photo_analyze import router as product_photo_analyze_router
from app.routes.video_generate import GENERATED_VIDEO_DIR, router as video_generate_router
from app.routes.fix_generated_image import router as fix_generated_image_router
from app.routes.queue_generate import router as queue_generate_router
from app.routes.fix_generated_image import router as fix_generated_image_router
from app.routes.queue_generate import router as queue_generate_router
from app.routes.fix_generated_image import router as fix_generated_image_router
from app.routes.ikpu import router as ikpu_router
from app.routers import admin
from app.routers.admin_finance import router as admin_finance_router
from app.routers.admin_analytics import router as admin_analytics_router


app = FastAPI(
    title="MarketCard AI",
    debug=os.getenv("APP_DEBUG", "0") == "1",
    root_path="/api",
)
app.include_router(card_audit.router)
app.include_router(product_intelligence.router)
app.include_router(abc_analysis.router)
app.include_router(deficit_products.router)
app.include_router(translate_listing.router)
app.include_router(admin.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://marketcard.uz", "https://www.marketcard.uz"],
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

app.mount(
    "/generated_reports",
    StaticFiles(directory="/var/www/marketcard/generated_reports"),
    name="generated_reports",
)

app.mount(
    "/generated_videos",
    StaticFiles(directory=str(GENERATED_VIDEO_DIR)),
    name="generated_videos",
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(payments_router)
app.include_router(click_router)
app.include_router(products_router, prefix="/products", tags=["products"])
app.include_router(ai_router, prefix="/ai", tags=["ai"])
app.include_router(listing_generate_router, prefix="/listing", tags=["listing"])
app.include_router(full_generate_router, prefix="", tags=["full_generate"])
app.include_router(demo_generate_router, prefix="", tags=["demo_generate"])
app.include_router(product_photo_analyze_router)
app.include_router(video_generate_router)
app.include_router(queue_generate_router)
app.include_router(queue_generate_router)
from app.routes.fix_generated_image import router as fix_generated_image_router
from app.routes.queue_generate import router as queue_generate_router
app.include_router(ikpu_router)
app.include_router(admin.router)
app.include_router(admin_finance_router)
app.include_router(admin_analytics_router)
app.include_router(support.router)

@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables()


app.include_router(system_router)

app.include_router(fix_generated_image_router)

app.include_router(product_intelligence_router, prefix="/api")

app.include_router(analysis.router)
