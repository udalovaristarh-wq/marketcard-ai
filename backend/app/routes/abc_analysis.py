from __future__ import annotations

from typing import Any
from urllib.parse import urlparse, parse_qs, unquote

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session

from app.db import get_session
from app.models.user import User
from app.security import get_current_user

from app.services.product_intelligence.parsers.uzum_parser import parse_uzum
from app.services.product_intelligence.parsers.wb_parser import parse_wildberries
from app.services.product_intelligence.parsers.ozon_parser import parse_ozon
from app.services.product_intelligence.parsers.yandex_parser import parse_yandex
from app.services.product_intelligence.uzum_analyzer import analyze_items


router = APIRouter()


class ABCRequest(BaseModel):
    url: str


def detect_marketplace(url: str) -> str:
    host = urlparse(url).netloc.lower()

    if "uzum" in host:
        return "uzum"
    if "wildberries" in host or "wb.ru" in host:
        return "wb"
    if "ozon" in host:
        return "ozon"
    if "yandex" in host:
        return "yandex"

    raise HTTPException(
        status_code=400,
        detail="Не удалось определить маркетплейс по ссылке"
    )


def extract_query_from_url(url: str) -> str:
    parsed = urlparse(url)
    qs = parse_qs(parsed.query)

    for key in ("query", "text", "search", "q"):
        value = qs.get(key)
        if value and value[0].strip():
            return unquote(value[0]).strip()

    path_parts = [p for p in parsed.path.split("/") if p]
    if path_parts:
        slug = path_parts[-1]
        slug = slug.split("?")[0]
        slug = slug.replace("-", " ").replace("_", " ")
        slug = "".join(
            ch if ch.isalnum() or ch.isspace() else " "
            for ch in slug
        )
        slug = " ".join(slug.split())
        if slug:
            return slug[:120]

    raise HTTPException(
        status_code=400,
        detail="Не удалось извлечь товарный запрос из ссылки"
    )


def parse_by_marketplace(marketplace: str, query: str) -> list[dict[str, Any]]:
    if marketplace == "uzum":
        return parse_uzum(query, None, 30)

    if marketplace == "wb":
        items = parse_wildberries(query, None, 30)
        return items or parse_uzum(query, None, 30)

    if marketplace == "ozon":
        items = parse_ozon(query, None, 30)
        return items or parse_uzum(query, None, 30)

    if marketplace == "yandex":
        items = parse_yandex(query, None, 30)
        return items or parse_uzum(query, None, 30)

    return []


def build_abc_strategy(
    analysis: dict[str, Any],
    query: str,
    marketplace: str,
) -> dict[str, Any]:
    count = int(analysis.get("count") or 0)
    reviews_total = int(analysis.get("reviews_total") or 0)
    avg_rating = float(analysis.get("avg_rating") or 0)
    competition = str(analysis.get("competition") or "")
    demand = str(analysis.get("demand") or "")

    if count <= 0:
        return {
            "abc_class": "D",
            "decision": "Не заходить сейчас",
            "confidence": 35,
            "product_query": query,
            "marketplace": marketplace,
            "why": [
                "По ссылке не удалось собрать достаточно рыночных данных.",
                "Решение будет слишком рискованным без нормальной выборки.",
            ],
            "risks": [
                "Нет подтверждения спроса.",
                "Непонятна реальная конкуренция.",
            ],
            "opportunities": [
                "Проверить товар вручную через обычную аналитику товара.",
            ],
            "entry_strategy": [
                "Не закупать партию до повторной проверки.",
                "Сначала протестировать похожий поисковый запрос.",
            ],
            "launch_plan_7_days": [
                "День 1: перепроверить нишу другим запросом.",
                "День 2: сравнить 5–10 прямых конкурентов вручную.",
                "День 3–7: запускать только тестовую минимальную партию.",
            ],
        }

    score = 0

    if demand in ("средний/высокий", "средний"):
        score += 35
    elif demand == "низкий":
        score += 10

    if competition == "низкая":
        score += 30
    elif competition == "средняя":
        score += 22
    elif competition == "высокая":
        score += 12

    if avg_rating >= 4.6:
        score += 12
    elif avg_rating >= 4.2:
        score += 8
    else:
        score += 4

    if reviews_total >= 5000:
        score += 15
    elif reviews_total >= 1000:
        score += 10
    else:
        score += 4

    if count >= 30 and reviews_total < 1000:
        score -= 10

    score = max(0, min(100, score))

    if score >= 75:
        abc_class = "A"
        decision = "Можно заходить"
        confidence = 88
    elif score >= 58:
        abc_class = "B"
        decision = "Можно заходить, но только со стратегией"
        confidence = 78
    elif score >= 40:
        abc_class = "C"
        decision = "Рискованный вход"
        confidence = 66
    else:
        abc_class = "D"
        decision = "Лучше не заходить"
        confidence = 58

    why = []
    risks = []
    opportunities = []
    entry_strategy = []
    launch_plan = []

    if demand in ("средний/высокий", "средний"):
        why.append("Есть признаки живого спроса: товар не выглядит мёртвой нишей.")
    else:
        why.append("Спрос слабый или плохо подтверждён — нужен осторожный тест.")

    if competition == "высокая":
        risks.append("Высокая конкуренция: нельзя заходить с обычной карточкой.")
        entry_strategy.append("Заходить через сильную инфографику, УТП и стартовую цену ниже рынка.")
    elif competition == "средняя":
        opportunities.append("Конкуренция управляемая: можно выделиться карточкой и оффером.")
        entry_strategy.append("Сделать карточку визуально сильнее среднего конкурента.")
    else:
        opportunities.append("Ниша свободнее: есть шанс занять позиции быстрее.")
        entry_strategy.append("Быстро протестировать товар небольшой партией.")

    if avg_rating >= 4.5:
        why.append("Высокие рейтинги показывают, что покупатели готовы брать такой товар.")
    else:
        opportunities.append("У конкурентов неидеальный рейтинг — можно выиграть качеством и описанием.")

    if reviews_total >= 5000:
        why.append("Много отзывов в нише — это признак накопленного спроса.")
    elif reviews_total < 1000:
        risks.append("Мало отзывов: спрос может быть нестабильным или сезонным.")

    opportunities.extend([
        "Сделать карточку не как у конкурентов: больше пользы, меньше шаблонного дизайна.",
        "Добавить блоки: преимущества, сценарии использования, комплектация, сравнение.",
        "Использовать MarketCard AI для серии изображений под этот товар.",
    ])

    entry_strategy.extend([
        "Не копировать конкурентов — зайти через более понятный визуальный оффер.",
        "Сделать минимум 5 изображений: главный экран, преимущества, характеристики, сценарий, доверие.",
        "Первые продажи собирать через сильную карточку и аккуратную стартовую цену.",
    ])

    launch_plan.extend([
        "День 1: проверить 10 прямых конкурентов и выписать их слабые места.",
        "День 2: подготовить сильную карточку и 5 изображений.",
        "День 3: запустить товар с понятным УТП.",
        "День 4–5: следить за кликами, корзиной и первыми заказами.",
        "День 6–7: усилить фото/описание по реакции покупателей.",
    ])

    return {
        "abc_class": abc_class,
        "decision": decision,
        "confidence": confidence,
        "product_query": query,
        "marketplace": marketplace,
        "why": why[:4],
        "risks": risks[:4],
        "opportunities": opportunities[:5],
        "entry_strategy": entry_strategy[:5],
        "launch_plan_7_days": launch_plan[:7],
        "note": "ABC-анализ не дублирует цены и конкуренцию. Он превращает рыночные данные в решение и стратегию запуска.",
    }


@router.post("/abc-analysis")
def abc_analysis(
    req: ABCRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if (current_user.audit_credits or 0) < 2:
        raise HTTPException(status_code=402, detail="Пополните аудиты для ABC-анализа")

    marketplace = detect_marketplace(req.url)
    query = extract_query_from_url(req.url)

    items = parse_by_marketplace(marketplace, query)
    analysis = analyze_items(items)
    result = build_abc_strategy(analysis, query, marketplace)

    if int(analysis.get("count") or 0) > 0:
        current_user.audit_credits = max((current_user.audit_credits or 0) - 2, 0)
        session.add(current_user)
        session.commit()
        session.refresh(current_user)

    result["audit_credits_left"] = current_user.audit_credits
    return result

    if reviews_total >= 5000:
        why.append("Много отзывов в нише — это признак накопленного спроса.")
    elif reviews_total < 1000:
        risks.append("Мало отзывов: спрос может быть нестабильным или сезонным.")

    opportunities.extend([
        "Сделать карточку не как у конкурентов: больше пользы, меньше шаблонного дизайна.",
        "Добавить блоки: преимущества, сценарии использования, комплектация, сравнение.",
        "Использовать MarketCard AI для серии изображений под этот товар.",
    ])

    entry_strategy.extend([
        "Не копировать конкурентов — зайти через более понятный визуальный оффер.",
        "Сделать минимум 5 изображений: главный экран, преимущества, характеристики, сценарий, доверие.",
        "Первые продажи собирать через сильную карточку и аккуратную стартовую цену.",
    ])

    launch_plan.extend([
        "День 1: проверить 10 прямых конкурентов и выписать их слабые места.",
        "День 2: подготовить сильную карточку и 5 изображений.",
        "День 3: запустить товар с понятным УТП.",
        "День 4–5: следить за кликами, корзиной и первыми заказами.",
        "День 6–7: усилить фото/описание по реакции покупателей.",
    ])

    return {
        "abc_class": abc_class,
        "decision": decision,
        "confidence": confidence,
        "product_query": query,
        "marketplace": marketplace,
        "why": why[:4],
        "risks": risks[:4],
        "opportunities": opportunities[:5],
        "entry_strategy": entry_strategy[:5],
        "launch_plan_7_days": launch_plan[:7],
        "note": "ABC-анализ не дублирует цены и конкуренцию. Он превращает рыночные данные в решение и стратегию запуска.",
    }


@router.post("/abc-analysis")
def abc_analysis(
    req: ABCRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if (current_user.audit_credits or 0) < 2:
        raise HTTPException(status_code=402, detail="Пополните аудиты для ABC-анализа")

    marketplace = detect_marketplace(req.url)
    query = extract_query_from_url(req.url)

    items = parse_by_marketplace(marketplace, query)
    analysis = analyze_items(items)
    result = build_abc_strategy(analysis, query, marketplace)

    if int(analysis.get("count") or 0) > 0:
        current_user.audit_credits = max((current_user.audit_credits or 0) - 2, 0)
        session.add(current_user)
        session.commit()
        session.refresh(current_user)

    result["audit_credits_left"] = current_user.audit_credits
    return result
