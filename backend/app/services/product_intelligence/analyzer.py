from statistics import mean
from typing import Any


def _to_int_price(value: Any) -> int | None:
    if value is None:
        return None

    if isinstance(value, int):
        return value

    text = str(value)
    cleaned = "".join(ch for ch in text if ch.isdigit())

    if not cleaned:
        return None

    return int(cleaned)


def analyze_items(marketplace: str, query: str, category: str | None, items: list[dict[str, Any]]) -> dict[str, Any]:
    prices: list[int] = []

    for item in items:
        price = _to_int_price(item.get("price"))
        if price and price > 0:
            prices.append(price)

    sellers = {
        str(item.get("seller")).strip()
        for item in items
        if item.get("seller")
    }

    count = len(items)
    seller_count = len(sellers)

    avg_price = int(mean(prices)) if prices else 0
    min_price = min(prices) if prices else 0
    max_price = max(prices) if prices else 0

    recommended_from = int(avg_price * 0.92) if avg_price else 0
    recommended_to = int(avg_price * 0.97) if avg_price else 0

    if count >= 40:
        competition = "высокая"
    elif count >= 15:
        competition = "средняя"
    else:
        competition = "низкая"

    if count >= 30:
        demand = "средний/высокий"
    elif count >= 10:
        demand = "низкий/средний"
    else:
        demand = "низкий"

    saturation = "товар в избытке" if count >= 50 else "рынок умеренный" if count >= 15 else "ниша свободнее"

    if avg_price:
        summary = (
            f"Найдено похожих товаров: {count}. "
            f"Продавцов: {seller_count}. "
            f"Средняя цена: {avg_price:,} сум."
        )
    else:
        summary = "Данных по ценам пока мало."

    recommendation = (
        "Можно заходить, если сделать сильную карточку, хорошую цену и визуально выделиться среди конкурентов."
        if count
        else "Пока данных мало. Нужно попробовать другой запрос или категорию."
    )

    return {
        "marketplace": marketplace,
        "query": query,
        "category": category,
        "similar_products": count,
        "sellers": seller_count,
        "average_price": avg_price,
        "min_price": min_price,
        "max_price": max_price,
        "recommended_price_from": recommended_from,
        "recommended_price_to": recommended_to,
        "competition": competition,
        "demand": demand,
        "saturation": saturation,
        "summary": summary,
        "recommendation": recommendation,
        "items": items[:30],
    }
