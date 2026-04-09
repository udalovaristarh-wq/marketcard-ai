from collections import defaultdict
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db import get_session
from app.models import User
from app.models.finance_income import TariffIncome
from app.models.generationexpense import GenerationExpense

router = APIRouter(prefix="/admin", tags=["admin-analytics"])


@router.get("/tariff-stats")
def get_tariff_stats(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    incomes = session.exec(select(TariffIncome)).all()
    expenses = session.exec(select(GenerationExpense)).all()

    data = {
        "Start": {"users": 0, "revenue": 0},
        "Business": {"users": 0, "revenue": 0},
        "Premium": {"users": 0, "revenue": 0},
    }

    for user in users:
        if user.tariff_name in data:
            data[user.tariff_name]["users"] += 1

    for income in incomes:
        if income.tariff_name in data:
            data[income.tariff_name]["revenue"] += int(income.amount_uzs or 0)

    return data

@router.get("/arpu-stats")
def get_arpu_stats(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    incomes = session.exec(select(TariffIncome)).all()
    expenses = session.exec(select(GenerationExpense)).all()

    total_users = len(users)
    paying_user_ids = {int(i.user_id) for i in incomes if i.user_id is not None}
    paying_users = len(paying_user_ids)

    total_income_uzs = sum(int(i.amount_uzs or 0) for i in incomes)
    total_expense_usd = sum(float(e.total_cost_usd or 0) for e in expenses)
    total_generations = len(expenses)

    arpu_uzs = (total_income_uzs / paying_users) if paying_users > 0 else 0
    revenue_per_generation_uzs = (
        total_income_uzs / total_generations if total_generations > 0 else 0
    )
    avg_cost_per_generation_usd = (
        total_expense_usd / total_generations if total_generations > 0 else 0
    )

    return {
        "total_users": total_users,
        "paying_users": paying_users,
        "total_income_uzs": total_income_uzs,
        "total_expense_usd": round(total_expense_usd, 6),
        "total_generations": total_generations,
        "arpu_uzs": round(arpu_uzs, 2),
        "avg_check_uzs": round(arpu_uzs, 2),
        "revenue_per_generation_uzs": round(revenue_per_generation_uzs, 2),
        "avg_cost_per_generation_usd": round(avg_cost_per_generation_usd, 6),
        "profit_note": "income in UZS, expense in USD",
    }

@router.get("/top-users")
def get_top_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    incomes = session.exec(select(TariffIncome)).all()
    expenses = session.exec(select(GenerationExpense)).all()

    users_by_id = {int(u.id): u for u in users if u.id is not None}

    income_by_user = defaultdict(int)
    for income in incomes:
        if income.user_id is not None:
            income_by_user[int(income.user_id)] += int(income.amount_uzs or 0)

    expense_by_user = defaultdict(float)
    generations_by_user = defaultdict(int)

    for expense in expenses:
        if expense.user_id is not None:
            uid = int(expense.user_id)
            expense_by_user[uid] += float(expense.total_cost_usd or 0)
            generations_by_user[uid] += 1

    candidate_ids = set(income_by_user.keys()) | set(expense_by_user.keys())

    rows = []
    for uid in candidate_ids:
        user = users_by_id.get(uid)
        rows.append({
            "user_id": uid,
            "email": getattr(user, "email", None) or "",
            "full_name": getattr(user, "full_name", None) or "",
            "tariff_name": getattr(user, "tariff_name", None) or "",
            "income_uzs": income_by_user.get(uid, 0),
            "expense_usd": round(expense_by_user.get(uid, 0.0), 6),
            "generations": generations_by_user.get(uid, 0),
        })

    rows.sort(
        key=lambda x: (x["generations"], x["expense_usd"], x["income_uzs"]),
        reverse=True,
    )

    return {
        "count": len(rows),
        "items": rows[:20],
    }
