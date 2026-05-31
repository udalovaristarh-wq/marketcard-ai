from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from sqlalchemy import func
from app.db import get_session
from app.models.finance_income import TariffIncome
from app.models.generationexpense import GenerationExpense
from app.models.user import User
from app.security import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin-finance"])


@router.get("/finance-summary")
def get_finance_summary(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin),
):
    total_income = session.exec(
        select(func.coalesce(func.sum(TariffIncome.amount_uzs), 0))
    ).one()

    total_expense = session.exec(
        select(func.coalesce(func.sum(GenerationExpense.total_cost_usd), 0))
    ).one()

    total_generations = session.exec(
        select(func.count(GenerationExpense.id))
    ).one()

    return {
        "total_income_uzs": total_income,
        "total_expense_usd": total_expense,
        "total_generations": total_generations,
        "profit_note": "income in UZS, expense in USD",
    }


@router.get("/finance-timeseries")
def get_finance_timeseries(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin),
):
    income_rows = session.exec(
        select(
            func.date(TariffIncome.created_at),
            func.sum(TariffIncome.amount_uzs)
        )
        .group_by(func.date(TariffIncome.created_at))
        .order_by(func.date(TariffIncome.created_at))
    ).all()

    expense_rows = session.exec(
        select(
            func.date(GenerationExpense.created_at),
            func.sum(GenerationExpense.total_cost_usd)
        )
        .group_by(func.date(GenerationExpense.created_at))
        .order_by(func.date(GenerationExpense.created_at))
    ).all()

    return {
        "income": [
            {"date": str(row[0]), "amount": row[1]}
            for row in income_rows
        ],
        "expense": [
            {"date": str(row[0]), "amount": row[1]}
            for row in expense_rows
        ],
    }
