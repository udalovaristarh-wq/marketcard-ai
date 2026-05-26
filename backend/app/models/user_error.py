from typing import Optional
from sqlmodel import SQLModel, Field


class UserError(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)

    error_type: str
    error_message: str
    error_trace: Optional[str] = None

    solution: Optional[str] = None
    is_resolved: bool = False

    created_at: Optional[str] = None
