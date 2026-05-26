from __future__ import annotations

from sqlmodel import SQLModel, Field


class Product(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    user_id: int

    title: str
    brand: str | None = None
    category: str

    marketplace: str

    description: str | None = None
    seo_title: str | None = None
    seo_description: str | None = None

    image_url: str | None = None

    status: str = "draft"