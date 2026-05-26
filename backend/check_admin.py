import sys
import os

sys.path.append(os.path.dirname(__file__))

from sqlmodel import Session, select
from app.db import engine
from app.models.user import User

with Session(engine) as db:
    user = db.exec(
        select(User).where(User.email == "udalovaristarh@gmail.com")
    ).first()

    if user:
        user.is_admin = True
        db.add(user)
        db.commit()
        print("Теперь udalovaristarh@gmail.com админ")
    else:
        print("Пользователь не найден")
