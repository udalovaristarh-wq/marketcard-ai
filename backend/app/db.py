import os

from sqlmodel import Session, SQLModel, create_engine

from app import models  # noqa: F401 — register models for metadata

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://marketcard_user:12345678@127.0.0.1:5432/marketcard",
)

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=os.getenv("SQL_ECHO", "").lower() in ("1", "true", "yes"),
    )
else:
    engine = create_engine(
        DATABASE_URL,
        echo=os.getenv("SQL_ECHO", "").lower() in ("1", "true", "yes"),
    )


def create_db_and_tables():
    from app.models.generationexpense import GenerationExpense  # noqa: F401
    from app.models.generationjob import GenerationJob  # noqa: F401
    from app.models.ikpu import IKPU  # noqa: F401
    from app.models.offer_acceptance_log import OfferAcceptanceLog  # noqa: F401
    from app.models.payment_order import PaymentOrder  # noqa: F401
    from app.models.product import Product  # noqa: F401
    from app.models.user import User  # noqa: F401
    from app.models.user_error import UserError  # noqa: F401
    from app.models.finance_income import TariffIncome  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
