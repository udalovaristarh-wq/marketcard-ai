from __future__ import annotations

from datetime import datetime, timedelta
from typing import Optional

from sqlmodel import SQLModel, Field


class PaymentOrder(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(index=True)
    email: str = Field(index=True)

    tariff_name: str = Field(index=True)
    amount_uzs: int = Field(default=0, index=True)

    provider: str = Field(default="unknown", index=True)
    status: str = Field(default="pending", index=True)

    external_order_id: Optional[str] = Field(default=None, index=True)
    external_transaction_id: Optional[str] = Field(default=None, index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    expires_at: datetime = Field(
        default_factory=lambda: datetime.utcnow() + timedelta(minutes=30),
        index=True,
    )
    paid_at: Optional[datetime] = Field(default=None, index=True)
