from __future__ import annotations


def build_auto_slide_plan() -> list[dict]:
    return [
        {
            "slide_type": "hero",
            "goal": "main_offer",
            "title_mode": "main",
            "content_mode": "hero_benefits",
        },
        {
            "slide_type": "benefits",
            "goal": "advantages",
            "title_mode": "benefits",
            "content_mode": "benefit_cards",
        },
        {
            "slide_type": "details",
            "goal": "quality_focus",
            "title_mode": "details",
            "content_mode": "quality_focus",
        },
        {
            "slide_type": "specs",
            "goal": "compatibility_specs",
            "title_mode": "specs",
            "content_mode": "spec_grid",
        },
        {
            "slide_type": "package",
            "goal": "trust_package",
            "title_mode": "package",
            "content_mode": "trust_panel",
        },
    ]


def build_electronics_slide_plan() -> list[dict]:
    return [
        {
            "slide_type": "hero",
            "goal": "main_offer",
            "title_mode": "main",
            "content_mode": "hero_benefits",
        },
        {
            "slide_type": "benefits",
            "goal": "comfort_features",
            "title_mode": "benefits",
            "content_mode": "benefit_cards",
        },
        {
            "slide_type": "details",
            "goal": "design_focus",
            "title_mode": "details",
            "content_mode": "quality_focus",
        },
        {
            "slide_type": "specs",
            "goal": "technical_specs",
            "title_mode": "specs",
            "content_mode": "spec_grid",
        },
        {
            "slide_type": "package",
            "goal": "box_contents",
            "title_mode": "package",
            "content_mode": "trust_panel",
        },
    ]


def build_general_slide_plan() -> list[dict]:
    return [
        {
            "slide_type": "hero",
            "goal": "main_offer",
            "title_mode": "main",
            "content_mode": "hero_benefits",
        },
        {
            "slide_type": "benefits",
            "goal": "advantages",
            "title_mode": "benefits",
            "content_mode": "benefit_cards",
        },
        {
            "slide_type": "details",
            "goal": "details_focus",
            "title_mode": "details",
            "content_mode": "quality_focus",
        },
        {
            "slide_type": "specs",
            "goal": "specifications",
            "title_mode": "specs",
            "content_mode": "spec_grid",
        },
        {
            "slide_type": "package",
            "goal": "trust_package",
            "title_mode": "package",
            "content_mode": "trust_panel",
        },
    ]


def build_slide_plan(category_type: str) -> list[dict]:
    if category_type == "auto":
        return build_auto_slide_plan()

    if category_type == "electronics":
        return build_electronics_slide_plan()

    return build_general_slide_plan()