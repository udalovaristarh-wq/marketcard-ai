from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class GenerationJob(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(index=True)
    email: str = Field(index=True)
    tariff_name: Optional[str] = Field(default=None, index=True)

    marketplace: str = Field(index=True)
    language_mode: str = Field(index=True)
    variant_count: int = Field(default=1, index=True)
    priority: int = Field(default=1, index=True)

    status: str = Field(default="queued", index=True)
    payload_json: str = Field(default="")
    result_json: Optional[str] = Field(default=None)
    error_message: Optional[str] = Field(default=None)

    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    started_at: Optional[datetime] = Field(default=None, index=True)
    finished_at: Optional[datetime] = Field(default=None, index=True)
