from app.models.generationexpense import GenerationExpense
from app.models.finance_income import TariffIncome

from sqlmodel import SQLModel, Session, create_engine
from app import models

# 🔥 PostgreSQL подключение
DATABASE_URL = "postgresql://marketcard_user:12345678@127.0.0.1:5432/marketcard"

engine = create_engine(DATABASE_URL, echo=True)


def create_db_and_tables():
    from app.models.user import User
    from app.models.product import Product
    from app.models.ikpu import IKPU
    from app.models.user_error import UserError

    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
