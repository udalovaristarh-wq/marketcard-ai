from __future__ import annotations

from typing import Any


def _language_rule(language_mode: str) -> str:
    mode = (language_mode or "ru").strip().lower()

    if mode == "uz":
        return (
            "All visible text on the card must be in Uzbek latin only. "
            "Do not mix Russian. "
            "Use clean marketplace wording. "
            "All Uzbek latin text must be grammatically correct, natural, and easy to read."
        )

    if mode in {"ru+uz", "uz+ru", "both"}:
        return (
            "All visible text on the card must be bilingual: Russian and Uzbek latin. "
            "Russian line first, Uzbek latin line second where appropriate. "
            "Keep text short, readable, commercially strong, and grammatically correct in both languages."
        )

    return (
        "All visible text on the card must be in Russian only. "
        "Use strong marketplace wording, short phrases, and clean readable typography. "
        "All Russian text must be grammatically correct, natural, and easy to read."
    )


def _text_quality_rule(language_mode: str) -> str:
    mode = (language_mode or "ru").strip().lower()

    if mode == "uz":
        return (
            "All visible text must be grammatically correct Uzbek latin only. "
            "Do not use Cyrillic, transliteration mistakes, broken words, mixed alphabets, gibberish, random symbols, or spelling mistakes. "
            "Do not split words unnaturally across lines. "
            "Use only short, simple, clear, common commercial phrases. "
            "If wording is uncertain, use simpler and safer Uzbek latin phrasing. "
            "If spelling quality is uncertain, reduce the amount of text."
        )

    if mode in {"ru+uz", "uz+ru", "both"}:
        return (
            "All visible text must be grammatically correct in both Russian and Uzbek latin. "
            "Do not use broken words, mixed alphabets, gibberish, random symbols, or spelling mistakes. "
            "Do not split words unnaturally across lines. "
            "Do not mix both languages inside the same short line. "
            "Use short, simple, clean phrases only. "
            "If wording is uncertain, use simpler and safer phrasing in both languages. "
            "If spelling quality is uncertain, reduce the amount of text."
        )

    return (
        "All visible text must be grammatically correct Russian only. "
        "Do not use transliteration, broken words, mixed alphabets, gibberish, random symbols, or spelling mistakes. "
        "Do not split words unnaturally across lines. "
        "Use only short, simple, clear, common marketplace phrases. "
        "If wording is uncertain, use simpler and safer Russian phrasing. "
        "If spelling quality is uncertain, reduce the amount of text."
    )


def _marketplace_rule(marketplace: str, profile: dict[str, Any]) -> str:
    mp = (marketplace or "uzum").strip().lower()
    width = profile.get("width", 1080)
    height = profile.get("height", 1440)
    ratio = profile.get("ratio", "3:4")

    return (
        f"Create a premium marketplace infographic for {mp}. "
        f"Canvas size {width}x{height}, aspect ratio {ratio}. "
        "This must look like a real high-converting e-commerce product card. "
        "Not a flyer. Not UI. Not a wireframe. Not a simple poster. "
        "The product must remain the main object. "
        "The result must feel commercially polished, expensive, premium, and marketplace-ready."
    )


def _category_rule(category_type: str) -> str:
    rules = {
        "electronics": (
            "Visual direction: premium tech, cinematic highlights, controlled glow accents, premium materials, high contrast, modern commercial design."
        ),
        "auto": (
            "Visual direction: industrial premium, technical mood, metallic accents, precision, power, reliability, performance atmosphere."),
        "fashion": (
            "Visual direction: editorial premium, stylish, elegant, clean luxury, commercial fashion campaign feel."
        ),
        "beauty": (
            "Visual direction: clean luxury, polished, elegant, refined beauty-commercial style with premium packaging feel."
        ),
        "home": (
            "Visual direction: cozy premium, warm, modern, interior-friendly commercial presentation with tasteful styling."
        ),
        "books": (
            "Visual direction: editorial minimal, elegant, intelligent, clean readable style with premium layout hierarchy."
        ),
        "kids": (
            "Visual direction: premium playful, bright but clean, cheerful, colorful commercial energy without chaos."
        ),
        "sports": (
            "Visual direction: dynamic, energetic, motion-driven commercial sports style with strong impact."
        ),
        "tools": (
            "Visual direction: bold industrial utility style, practical premium infographic, strong functional presentation."
        ),
        "food": (
            "Visual direction: appetizing premium commercial look, fresh, attractive, rich product presentation."
        ),
        "general": (
            "Visual direction: premium marketplace commercial design, clean, strong, product-first, polished and high-converting."
        ),
    }
    return rules.get(category_type, rules["general"])


def _slide_goal_rule(slide: dict[str, Any]) -> str:
    key = slide.get("key", "hero")
    mapping = {
        "hero": (
            "This is the main hero slide. "
            "Use the strongest composition in the series. "
            "Large product, strong visual focus, premium background, high CTR feeling."
        ),
        "benefits": (
            "This slide must show 3 or 4 key selling benefits in infographic style. "
            "The product must still be clearly visible and dominant."
        ),
        "specs": (
            "This slide must show key characteristics or safe specifications in a structured and easy-to-scan infographic style."
        ),
        "usage": (
            "This slide must show use case, scenario, context, or lifestyle application. "
            "It should feel believable, commercial, and visually engaging."
        ),
        "trust": (
            "This slide must create confidence and a final buying impulse. "
            "Use quality, reliability, comfort, compatibility, or trust messaging."
        ),
    }
    return mapping.get(key, "Create a premium marketplace card.")


def _angle_rule(slide_key: str) -> str:
    mapping = {
        "hero": (
            "Use a main front-facing or powerful three-quarter premium angle. "
            "Large dominant product presentation."
        ),
        "benefits": (
            "Use a slightly rotated angle or visually dynamic angle different from the hero slide."
        ),
        "specs": (
            "Use a clean structured angle, possibly top-front or technical angle, suitable for showing details."
        ),
        "usage": (
            "Use a contextual angle or believable usage angle, different from hero and benefits."
        ),
        "trust": (
            "Use a clean premium final angle, possibly close-up or polished confidence-building angle."
        ),
    }
    return mapping.get(slide_key, "Use a distinct product angle.")


def _anti_bad_rule() -> str:
    return (
        "Do not create template-looking layouts. "
        "Do not create ugly white empty backgrounds unless visually justified. "
        "Do not make the product too small. "
        "Do not distort the product. "
        "Do not invent fake logo badges. "
        "Do not use gibberish text. "
        "Do not overload with tiny unreadable text. ""Do not overload the card with too many text blocks. "
        "Do not repeat exactly the same composition across all 5 slides. "
        "Do not place marketplace names like OZON, UZUM, Wildberries, Yandex Market inside the image. "
        "Do not place marketplace logos inside the image. "
        "Do not create buttons, buy now buttons, UI cards, app interface elements, fake website elements, or fake CTA blocks. "
        "Do not add words like Купить, Buy, Order, Add to cart, Shop now inside the card. "
        "Do not generate long paragraphs. "
        "Do not use visual clutter. "
        "Do not make the design cheap, generic, flat, weak, or amateur. "
        "This must be a clean marketplace infographic, not an app screenshot."
    )


def _series_uniqueness_rule() -> str:
    return (
        "Each slide in this series must contain different visible text. "
        "Do not repeat the same headline, subtitle, bullets, footer, or short marketing phrases across slides. "
        "Every slide must have a unique communication role. "
        "Slide 1 must be the hero offer. "
        "Slide 2 must focus on benefits. "
        "Slide 3 must focus on specs. "
        "Slide 4 must focus on usage scenarios. "
        "Slide 5 must focus on trust and closing message. "
        "Do not reuse the same wording across multiple slides."
    )


def _slide_text_role_rule(slide_key: str) -> str:
    mapping = {
        "hero": (
            "For this hero slide, use one strong headline and 2 or 3 short selling points only. "
            "Do not overload with technical details."
        ),
        "benefits": (
            "For this benefits slide, focus on advantages, convenience, useful functions, and strong selling points. "
            "Do not repeat the hero headline or the same bullets."
        ),
        "specs": (
            "For this specs slide, focus on characteristics, parameters, materials, construction, size, compatibility, runtime, or other safe technical details. "
            "Do not repeat previous wording."
        ),
        "usage": (
            "For this usage slide, focus on where, how, or in what situations the product is useful. "
            "Use scenario-oriented wording and do not repeat previous wording."
        ),
        "trust": (
            "For this trust slide, focus on reliability, comfort, quality feeling, confidence, or final purchase motivation. "
            "Do not repeat previous wording."
        ),
    }
    return mapping.get(
        slide_key,
        "Use unique visible text for this slide and do not repeat wording from the rest of the series.",
    )


def _visual_profile_rule(visual_profile: dict[str, Any]) -> str:
    palette = visual_profile.get("palette", {})
    base = palette.get("base", "adaptive base color")
    accent = palette.get("accent", "adaptive accent color")
    support = palette.get("support", "support color")
    background = palette.get("background", "premium adaptive background")
    lighting = palette.get("lighting", "commercial premium light")

    return (
        f"Visual DNA for this product series: "
        f"base color family = {base}; "
        f"accent color = {accent}; "
        f"support color = {support}; "
        f"background direction = {background}; "
        f"lighting style = {lighting}. "
        f"Style family = {visual_profile.get('style_family', 'premium marketplace')}. "
        f"Graphic accents = {visual_profile.get('graphic_accent_style', 'clean commercial accents')}. "
        f"{visual_profile.get('series_consistency_rule', '')}"
    )


def _premium_design_rule() -> str:
    return (
        "Push visual quality higher than standard marketplace cards. "
        "Use premium commercial art direction, better spacing, stronger hierarchy, cleaner typography zones, richer lighting, realistic shadows, premium material rendering, stronger product separation from background, and more refined composition. ""Make the design look expensive, polished, modern, and highly clickable. "
        "Avoid weak generic layouts. "
        "Each slide must feel intentionally designed by a strong commercial designer."
    )


def _copy_guidance(category_type: str) -> str:
    mapping = {
        "electronics": (
            "Generate strong marketplace copy automatically: "
            "1 short selling headline, 2 to 4 benefits, 2 to 4 safe characteristics if supported by the product name or image, "
            "and a short product-description feeling. "
            "If exact specs are unknown, do not invent precise technical numbers. "
            "Use realistic wording like bright display, comfort, daily use, useful functions, convenient design, stable performance."
        ),
        "auto": (
            "Generate practical marketplace copy automatically: "
            "headline, benefits, safe characteristics, compatibility-oriented wording when appropriate. "
            "Do not invent exact fitments or OEM numbers unless clearly known."
        ),
        "fashion": (
            "Generate style, comfort, fit, and material-oriented copy automatically. "
            "Do not invent precise fabric composition if unknown."
        ),
        "beauty": (
            "Generate polished beauty-commercial copy automatically: "
            "benefits, care effect, comfort, soft premium wording. "
            "Do not invent ingredients or medical claims."
        ),
        "home": (
            "Generate comfort and practical-use copy automatically: "
            "headline, 3 to 4 benefits, 2 to 4 safe characteristics, short descriptive wording."
        ),
        "books": (
            "Generate editorial selling copy automatically: "
            "who this product is for, why it is useful, and what kind of value it gives. "
            "Do not invent exact publisher or page count if unknown."
        ),
        "kids": (
            "Generate friendly parent-oriented commercial copy automatically. "
            "Do not invent unsupported claims."
        ),
        "sports": (
            "Generate energetic use-case-oriented commercial copy automatically."
        ),
        "tools": (
            "Generate utility-focused copy automatically with practical benefits and safe characteristics."
        ),
        "food": (
            "Generate appetizing commercial copy automatically without inventing ingredients or nutrition facts."
        ),
        "general": (
            "Generate short marketplace-ready selling copy automatically: "
            "headline, benefits, safe characteristics, and a short descriptive line. "
            "Never invent exact specs if they are not known."
        ),
    }
    return mapping.get(category_type, mapping["general"])


def build_card_prompt(
    *,
    product_title: str,
    brand: str,
    category: str,
    category_type: str,
    marketplace: str,
    marketplace_profile: dict[str, Any],
    language_mode: str,
    slide: dict[str, Any],
    scene_tags: list[str] | None = None,
    extra_features: list[str] | None = None,
    visual_profile: dict[str, Any] | None = None,
) -> str:
    slide_key = slide.get("key", "hero")
    scene_text = ", ".join(scene_tags or [])
    feature_text = ", ".join(extra_features or [])

    parts = [
        _marketplace_rule(marketplace, marketplace_profile),
        _language_rule(language_mode),
        _text_quality_rule(language_mode),
        _series_uniqueness_rule(),
        _premium_design_rule(),
        _category_rule(category_type),
        _slide_goal_rule(slide),
        _slide_text_role_rule(slide_key),
        _angle_rule(slide_key),
        _copy_guidance(category_type),
        _anti_bad_rule(),
        (
            f"Product title: {product_title or 'Товар'}. "f"Brand: {brand or 'not specified'}. "
            f"Category: {category or 'general product'}. "
            f"Category type: {category_type}."
        ),
        (
            "AI must generate the actual infographic text content for this slide automatically. "
            "That includes a proper product headline, useful selling benefits, safe characteristics, "
            "and short description fragments suitable for marketplace cards. "
            "The text must look like real product infographic copy, not generic filler."
        ),
        (
            "Use the uploaded product photo as the real product reference. "
            "Preserve the actual product identity, shape, material impression, and core appearance."
        ),
        (
            "Use only short, clean, readable marketplace text. "
            "Prefer fewer text blocks over many text blocks. "
            "Do not repeat exact product naming on every slide. "
            "Do not reuse the same bullet points across the series. "
            "Do not duplicate the same marketing phrases."
        ),
        (
            "Typography must be visually clean and readable. "
            "Do not place too much text near edges. "
            "Do not let text collide with the product. "
            "Keep clear hierarchy between headline, bullets, and supporting text."
        ),
    ]

    if visual_profile:
        parts.append(_visual_profile_rule(visual_profile))

    if scene_text:
        parts.append(f"Preferred scene and mood tags: {scene_text}.")

    if feature_text:
        parts.append(
            f"Use these product points when relevant, but do not force all of them: {feature_text}."
        )

    parts.append(
        "Create a finished premium marketplace infographic card image. "
        "The visual design, colors, background, layout, lighting, and graphic accents must be chosen by AI automatically. "
        "Keep this slide visually consistent with the rest of the series, but give it its own composition, hierarchy, and angle."
    )

    return "\n\n".join(parts)


def build_series_prompts(
    *,
    product_title: str,
    brand: str,
    category: str,
    category_type: str,
    marketplace: str,
    marketplace_profile: dict[str, Any],
    language_mode: str,
    slides: list[dict[str, Any]],
    scene_tags: list[str] | None = None,
    extra_features: list[str] | None = None,
    visual_profile: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    result: list[dict[str, Any]] = []

    for index, slide in enumerate(slides, start=1):
        prompt = build_card_prompt(
            product_title=product_title,
            brand=brand,
            category=category,
            category_type=category_type,
            marketplace=marketplace,
            marketplace_profile=marketplace_profile,
            language_mode=language_mode,
            slide=slide,
            scene_tags=scene_tags,
            extra_features=extra_features,
            visual_profile=visual_profile,
        )
        result.append(
            {
                "index": index,
                "slide_key": slide.get("key", f"slide_{index}"),
                "prompt": prompt,
            }
        )

    return result