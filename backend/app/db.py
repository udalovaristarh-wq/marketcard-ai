from sqlmodel import SQLModel, Session, create_engine

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)


def create_db_and_tables():
    from app.models.user import User
    from app.models.product import Product
    from app.models.ikpu import IKPU

    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session