from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class GenerationExpense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    email: str = Field(index=True)
    tariff_name: Optional[str] = Field(default=None, index=True)

    marketplace: str = Field(index=True)
    language_mode: str = Field(index=True)
    variants_count: int = Field(default=1, index=True)

    text_model: Optional[str] = Field(default=None)
    image_model: Optional[str] = Field(default=None)

    text_cost_usd: float = Field(default=0.0)
    image_cost_usd: float = Field(default=0.0)
    total_cost_usd: float = Field(default=0.0)

    source: str = Field(default="full_generate", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
