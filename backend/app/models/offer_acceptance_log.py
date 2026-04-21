from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


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
