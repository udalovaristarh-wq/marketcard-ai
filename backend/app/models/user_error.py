from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class UserError(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)

    error_type: str
    error_message: str
    error_trace: Optional[str] = None

    solution: Optional[str] = None
    is_resolved: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
