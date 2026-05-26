from __future__ import annotations

from typing import Any


def analyze_items(items: list[dict[str, Any]]) -> dict[str, Any]:
    prices = [int(i.get("price") or 0) for i in items if int(i.get("price") or 0) > 0]
    sellers = len(items)

    if not prices:
        return {
            "count": 0,
            "sellers": 0,
            "avg_price": 0,
            "min_price": 0,
            "max_price": 0,
            "recommended_price": "0-0",
            "competition": "низкая",
            "demand": "низкий",
            "saturation": "ниша свободнее",
        }

    avg_price = int(sum(prices) / len(prices))
    min_price = min(prices)
    max_price = max(prices)

    rec_from = int(avg_price * 0.92)
    rec_to = int(avg_price * 0.97)

    count = len(items)
    reviews_total = sum(int(i.get("reviews") or 0) for i in items)
    avg_rating = sum(float(i.get("rating") or 0) for i in items) / count if count else 0

    bucket_size = 50000
    buckets = {}
    for price in prices:
        start = (price // bucket_size) * bucket_size
        end = start + bucket_size
        key = f"{start}-{end}"
        buckets[key] = buckets.get(key, 0) + 1

    price_buckets = [
        {"range": key, "count": value}
        for key, value in sorted(
            buckets.items(),
            key=lambda x: int(x[0].split("-")[0])
        )
    ]

    if count >= 30:
        competition = "высокая"
    elif count >= 10:
        competition = "средняя"
    else:
        competition = "низкая"

    if reviews_total >= 5000 or avg_rating >= 4.5:
        demand = "средний/высокий"
    elif reviews_total >= 1000:
        demand = "средний"
    else:
        demand = "низкий"

    if competition == "высокая" and demand in ("средний/высокий", "средний"):
        saturation = "ниша насыщенная, нужна сильная карточка и цена ниже среднего на 5–10%"
    elif competition == "средняя":
        saturation = "ниша рабочая, можно заходить с хорошей карточкой"
    else:
        saturation = "ниша свободнее, но спрос нужно проверять"

    return {
        "count": count,
        "sellers": sellers,
        "avg_price": avg_price,
        "min_price": min_price,
        "max_price": max_price,
        "recommended_price": f"{rec_from}-{rec_to}",
        "competition": competition,
        "demand": demand,
        "saturation": saturation,
        "reviews_total": reviews_total,
        "avg_rating": round(avg_rating, 1),
        "price_buckets": price_buckets,
    }


    return {
        "count": count,
        "sellers": sellers,
        "avg_price": avg_price,
        "min_price": min_price,
        "max_price": max_price,
        "recommended_price": f"{rec_from}-{rec_to}",
        "competition": competition,
        "demand": demand,
        "saturation": saturation,
        "reviews_total": reviews_total,
        "avg_rating": round(avg_rating, 1),
        "price_buckets": price_buckets,
    }
