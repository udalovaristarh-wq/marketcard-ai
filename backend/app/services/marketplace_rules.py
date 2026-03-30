from typing import TypedDict


class MarketplaceRule(TypedDict):
    title_max: int
    seo_title_max: int
    short_description_max: int
    full_description_max: int
    keywords_max: int
    characteristics_max: int


MARKETPLACE_RULES: dict[str, MarketplaceRule] = {
    "uzum": {
        "title_max": 90,
        "seo_title_max": 120,
        "short_description_max": 220,
        "full_description_max": 3000,
        "keywords_max": 12,
        "characteristics_max": 12,
    },
    "wildberries": {
        "title_max": 100,
        "seo_title_max": 140,
        "short_description_max": 250,
        "full_description_max": 4000,
        "keywords_max": 15,
        "characteristics_max": 15,
    },
    "ozon": {
        "title_max": 200,
        "seo_title_max": 200,
        "short_description_max": 300,
        "full_description_max": 5000,
        "keywords_max": 20,
        "characteristics_max": 20,
    },
    "yandex": {
        "title_max": 120,
        "seo_title_max": 160,
        "short_description_max": 250,
        "full_description_max": 4000,
        "keywords_max": 15,
        "characteristics_max": 15,
    },
}


def get_marketplace_rules(marketplace: str) -> MarketplaceRule:
    key = str(marketplace).strip().lower()
    return MARKETPLACE_RULES.get(key, MARKETPLACE_RULES["uzum"])