from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class TariffIncome(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    email: str = Field(index=True)
    tariff_name: str = Field(index=True)
    amount_uzs: int = Field(default=0, index=True)
    generations_total: int = Field(default=0)
    source: str = Field(default="tariff_activation", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
