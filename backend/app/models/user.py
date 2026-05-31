from __future__ import annotations

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    email: str = Field(index=True, unique=True)
    accepted_terms_at: Optional[datetime] = None
    accepted_terms_version: Optional[str] = None
    password: str
    full_name: str = Field(default="")

    tariff_name: str | None = Field(default=None)
    tariff_active: bool = Field(default=False)

    tariff_generations_total: int = Field(default=0)
    tariff_generations_used: int = Field(default=0)
    tariff_generations_left: int = Field(default=0)
    audit_credits: int = Field(default=0)

    is_admin: bool = Field(default=False)
    is_banned: bool = Field(default=False)
    ban_reason: str | None = Field(default=None)
    token_version: int = Field(default=0)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
