from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Body
from fastapi.responses import FileResponse
from sqlmodel import Session, select
import csv
import io
import os
from PIL import Image, ImageDraw, ImageFont

from app.db import get_session
from app.models import Product, User
from app.schemas import ProductCreate
from app.security import get_current_user

router = APIRouter(prefix="/products", tags=["products"])


def render_product_image(product: Product, width: int, height: int, marketplace_mode: str) -> str:
    os.makedirs("generated_cards", exist_ok=True)

    image = Image.new("RGB", (width, height), color=(245, 247, 250))
    draw = ImageDraw.Draw(image)

    try:
        title_font = ImageFont.truetype("arial.ttf", 42)
        text_font = ImageFont.truetype("arial.ttf", 28)
        small_font = ImageFont.truetype("arial.ttf", 22)
    except Exception:
        title_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
        small_font = ImageFont.load_default()

    colors = {
        "uzum": (122, 92, 255),
        "ozon": (0, 91, 255),
        "wildberries": (191, 56, 142),
        "yandex": (255, 204, 0),
    }

    accent = colors.get(marketplace_mode, (60, 120, 255))

    draw.rectangle((30, 30, width - 30, height - 30), outline=accent, width=4)

    draw.text(
        (60, 60),
        f"{marketplace_mode.upper()} / {product.category or 'category'}",
        fill=accent,
        font=small_font,
    )

    draw.text(
        (60, 120),
        product.title or "Без названия",
        fill=(20, 20, 20),
        font=title_font,
    )

    draw.text(
        (60, 200),
        f"Бренд: {product.brand or 'Без бренда'}",
        fill=(70, 70, 70),
        font=text_font,
    )

    draw.rectangle((60, 300, width - 60, 700), outline=(200, 200, 200))
    draw.text(
        (width // 2 - 80, 480),
        "Фото товара",
        fill=(100, 100, 100),
        font=text_font,
    )

    filename = f"generated_cards/product_{product.id}_{marketplace_mode}.png"
    image.save(filename, "PNG")
    return filename


def build_benefits(product: Product) -> list[str]:
    category = (product.category or "").lower()

    if "electronic" in category or "элект" in category:
        return [
            "Высокое качество",
            "Отличная цена",
            "Быстрая доставка",
            "Подходит для маркетплейсов",
        ]

    if "auto" in category or "запчаст" in category:
        return [
            "Надёжная деталь",
            "Идеально подходит для автомобиля",
            "Высокий ресурс работы",
            "Подходит для маркетплейсов",
        ]

    return [
        "Высокое качество",
        "Отличная цена",
        "Быстрая доставка",
        "Подходит для маркетплейсов",
    ]


def build_seo_description(product: Product) -> str:
    title = product.title or "Товар"
    brand = product.brand or "Без бренда"
    category = product.category or "товары"
    marketplace = product.marketplace or "marketplace"

    return (
        f"{title} от бренда {brand}. "
        f"Качественный товар категории {category}. "
        f"Оптимизирован для размещения на {marketplace}. "
        f"Подходит для онлайн продаж и маркетплейсов."
    )


@router.post("/")
def create_product(
    data: ProductCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    product = Product(
        user_id=current_user.id,
        title=data.title,
        brand=data.brand,
        category=data.category,
        marketplace=data.marketplace,
        description=data.description,
        image_url=data.image_url,
        status="draft",
    )

    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.get("/")
def list_products(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    products = session.exec(
        select(Product).where(Product.user_id == current_user.id)
    ).all()
    return products


@router.post("/{product_id}/generate")
def generate_product_card(
    product_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    product = session.get(Product, product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.user_id != current_user.id and not getattr(current_user, "is_admin", False):
        raise HTTPException(status_code=403, detail="Access denied")
    title = product.title or "Без названия"
    category = product.category or "category"
    marketplace = product.marketplace or "marketplace"

    product.seo_title = f"{title} | {marketplace} | {category}"
    product.seo_description = build_seo_description(product)
    product.status = "generated"

    session.add(product)
    session.commit()
    session.refresh(product)

    return {
        "message": "AI card generated",
        "product": product,
        "benefits": build_benefits(product),
    }


@router.get("/{product_id}/preview")
def get_product_preview(
    product_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    product = session.get(Product, product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.user_id != current_user.id and not getattr(current_user, "is_admin", False):
        raise HTTPException(status_code=403, detail="Access denied")

    return {
        "id": product.id,
        "title": product.title or "Без названия",
        "brand": product.brand or "Без бренда",
        "category": product.category or "Категория",
        "marketplace": product.marketplace or "marketplace",
        "description": product.description or "Описание пока не добавлено",
        "seo_title": product.seo_title or product.title,
        "seo_description": product.seo_description or build_seo_description(product),
        "status": product.status or "draft",
        "image_url": product.image_url or "",
        "benefits": build_benefits(product),
    }


@router.post("/import-csv")
async def import_products_csv(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    content = await file.read()
    text = content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(text))

    created = 0

    for row in reader:
        product = Product(
            user_id=current_user.id,
            title=row.get("title"),
            brand=row.get("brand"),
            category=row.get("category") or "Без категории",
            marketplace=row.get("marketplace") or "uzum",
            description=row.get("description"),
            image_url=row.get("image_url"),
            status="draft",
        )
        session.add(product)
        created += 1

    session.commit()

    return {
        "message": "CSV импортирован",
        "created_products": created,
    }


@router.post("/generate-all")
def generate_all_cards(
    payload: dict = Body(default={}),
    session: Session = Depends(get_session),
):
    products = session.exec(select(Product)).all()

    generated_count = 0
    skipped_count = 0

    marketplace_mode = payload.get("marketplace_mode", "uzum")
    width = payload.get("width", 1080)
    height = payload.get("height", 1440)

    for product in products:
        if not product.title:
            skipped_count += 1
            continue

        title = product.title or "Без названия"
        category = product.category or "category"

        product.seo_title = f"{title} | {marketplace_mode} | {category}"
        product.seo_description = build_seo_description(product)
        product.status = "generated"

        session.add(product)
        generated_count += 1

    session.commit()

    return {
        "message": "All cards generated",
        "generated_count": generated_count,
        "skipped_count": skipped_count,
        "marketplace_mode": marketplace_mode,
        "width": width,
        "height": height,
    }


@router.post("/{product_id}/render-image")
def render_product_card_image(
    product_id: int,
    payload: dict = Body(default={}),
    session: Session = Depends(get_session),
):
    product = session.get(Product, product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    marketplace_mode = payload.get("marketplace_mode", "uzum")
    width = payload.get("width", 1080)
    height = payload.get("height", 1440)

    file_path = render_product_image(product, width, height, marketplace_mode)
    product.status = "generated"
    product.image_url = file_path
    product.seo_title = f"{product.title or 'Без названия'} | {marketplace_mode} | {product.category or 'category'}"
    product.seo_description = build_seo_description(product)

    session.add(product)
    session.commit()
    session.refresh(product)

    return {
        "message": "Image rendered successfully",
        "file_path": file_path,
        "product_id": product.id,
    }


@router.get("/{product_id}/download-image")
def download_image(product_id: int, marketplace_mode: str = "uzum"):
    file_path = f"generated_cards/product_{product_id}_{marketplace_mode}.png"

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(
        path=file_path,
        filename=f"product_{product_id}_{marketplace_mode}.png",
        media_type="image/png",
    )