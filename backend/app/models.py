from typing import Optional
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    email: str = Field(index=True, unique=True)
    hashed_password: str
    full_name: str

    # статус пользователя
    is_active: bool = True

    # тариф
    tariff_name: Optional[str] = None
    tariff_active: bool = False

    # генерации
    tariff_generations_total: int = 0
    tariff_generations_used: int = 0


class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(index=True)

    title: str
    brand: Optional[str] = None
    category: str = Field(index=True)
    marketplace: str = Field(index=True)

    description: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

    image_url: Optional[str] = None

    status: str = "draft"