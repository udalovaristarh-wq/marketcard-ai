from pydantic import BaseModel, EmailStr
from typing import Optional


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    offer_accepted: bool = False
    offer_accept_lang: Optional[str] = None
    offer_accepted: bool
    offer_accept_lang: str
    offer_accepted: bool
    offer_accept_lang: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TariffActivateRequest(BaseModel):
    tariff_name: str


class ProfileResponse(BaseModel):
    email: EmailStr
    full_name: str
    tariff_name: Optional[str] = None
    tariff_active: bool
    tariff_generations_total: int
    tariff_generations_used: int
    tariff_generations_left: int
    audit_credits: int = 0
    offer_accepted: bool = False
    offer_accepted_at: Optional[str] = None
    offer_accept_lang: Optional[str] = None


class ProductCreate(BaseModel):
    title: str
    brand: Optional[str] = None
    category: str
    marketplace: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class ProductResponse(BaseModel):
    id: int
    user_id: int
    title: str
    brand: Optional[str] = None
    category: str
    marketplace: str
    description: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    image_url: Optional[str] = None
    status: str
    
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
