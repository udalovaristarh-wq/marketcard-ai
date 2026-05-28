from app.models.generationexpense import GenerationExpense
from app.models.finance_income import TariffIncome

import os

from sqlmodel import SQLModel, Session, create_engine
from app import models

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")

engine = create_engine(DATABASE_URL, echo=os.getenv("SQL_ECHO", "0") == "1")


def create_db_and_tables():
    from app.models.user import User
    from app.models.product import Product
    from app.models.ikpu import IKPU
    from app.models.user_error import UserError

    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
