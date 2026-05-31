from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    email: str = Field(index=True, unique=True)
    hashed_password: str
    full_name: str
    offer_accepted: bool = False
    offer_accepted_at: Optional[datetime] = None
    offer_accept_lang: Optional[str] = None
    offer_accept_ip: Optional[str] = None
    offer_accept_user_agent: Optional[str] = None

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

class UserError(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(index=True)

    error_type: str
    error_message: str
    error_trace: Optional[str] = None

    solution: Optional[str] = None
    is_resolved: bool = False

    created_at: Optional[str] = None

class OfferAcceptanceLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    email: str = Field(index=True)
    accepted: bool = True
    accepted_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    accept_lang: Optional[str] = None
    accept_ip: Optional[str] = None
    accept_user_agent: Optional[str] = None
    offer_version: Optional[str] = None

