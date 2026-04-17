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
            "Do not duplicate the exact same meaning line by line in both languages. "
            "Russian and Uzbek must complement each other. "
            "One language may carry the main selling idea, while the second language may support it with benefit, comfort, trust, or usage meaning. "
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
            "Make it visually explosive, premium, and highly clickable. "
            "The product must be large, dominant, and instantly readable. "
            "Use the strongest premium marketplace composition for this exact product automatically. "
            "Use premium text styling, strong headline hierarchy, accent text colors, elegant infographic plates, refined badges, and stylish decorative graphic elements where they improve the design. "
            "Use beautiful premium shapes, circles, highlight blocks, glow accents, or clean geometry if they make the card look more expensive. "
            "The slide must feel like top-level business infographic design created by an elite marketplace art director."
        ),
        "benefits": (
            "This slide must explain 3 or 4 key product benefits in a strong infographic style. "
            "Keep the product clearly visible and commercially dominant. "
            "Use premium benefit cards, elegant icon zones, accent bullets, colored text hierarchy, and visually rich infographic blocks. "
            "The layout must feel premium, designer-made, and visually more advanced than standard marketplace cards."
        ),
        "specs": (
            "This slide must present safe characteristics or practical parameters in a structured premium infographic layout. "
            "Use stylish specification blocks, clean premium labels, contrast hierarchy, decorative support lines, and refined graphic grouping. "
            "The information must be easy to scan, visually expensive, and business-level polished."
        ),
        "usage": (
            "This slide must show believable real-life use, context, or lifestyle application. "
            "If appropriate, show a person, hand, interior, or real usage setup that fits this product category. "
            "Combine the scene with premium infographic overlays, elegant text blocks, stylish accents, and strong visual storytelling. "
            "The slide must feel alive, persuasive, and commercially powerful."
        ),
        "trust": (
            "This slide must create confidence and final buying motivation. "
            "Focus on reliability, comfort, quality, durability, trust, or confidence-building value. "
            "Use premium trust badges, refined labels, soft highlight elements, polished graphic accents, and strong closing composition. "
            "The result must feel expensive, credible, and conversion-oriented."
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
        "Do not create boring, empty, flat, template-looking layouts. "
        "Do not create plain single-color backgrounds with just text and product. "
        "Do not use simple default bullet lists as the main infographic solution. "
        "Do not make the card look like a document, poster, or Canva beginner template. "
        "Do not make the composition predictable, weak, or static. "
        "Do not keep all text in one boring block. "
        "Do not use cheap gradients, childish effects, ugly random decorations, or chaotic clutter. "
        "Do not distort, replace, redraw incorrectly, or visually corrupt the real product. "
        "Do not invent fake product parts, fake accessories, fake logos, or fake packaging details. "
        "Do not use gibberish text. "
        "Do not overload with tiny unreadable text. "
        "Do not place marketplace names or marketplace logos inside the image. "
        "Do not create buttons, app interface elements, fake website blocks, or fake CTA widgets. "
        "Do not add words like Buy, Order, Add to cart, Shop now, Купить inside the card. "
        "At the same time, premium infographic plates, elegant badges, accent labels, decorative circles, refined shapes, layered text blocks, and stylish commercial design elements ARE ALLOWED and SHOULD be used when they make the card more premium and visually stronger."
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
        "Push visual quality to elite marketplace level. "
        "Make the design visually rich, premium, bold, and scroll-stopping. "
        "Avoid sterile minimalism if it makes the card boring. "
        "Use layered composition, depth, premium lighting, contrast, and strong product focus. "
        "Use beautiful premium backgrounds, not flat empty backgrounds. "
        "The design must feel intentionally art-directed and visually expensive. "

        "Use premium infographic plates, elegant badges, stylish callout blocks, accent shapes, and refined highlight zones. "
        "Use different visual concepts for different slides and products. "
        "Vary composition, badge style, block shapes, text placement, accent lines, and hierarchy. "
        "Use controlled design variety, not one repetitive template. "

        "Use strong premium color combinations chosen specifically for the product. "
        "Accent colors, support colors, and text colors may vary when it improves the design. "
        "Use different text hierarchy levels: strong headline, clean support text, premium badges, benefit accents. "
        "Typography may vary in scale, weight, emphasis, and placement to create a more premium result. "

        "Some products may look better in dark premium style, some in bright premium style, some in bold commercial style. "
        "Choose the most beautiful and commercially strong style for this exact product automatically. "
        "Every result must feel unique, premium, and designer-made. "

        "The result must not look cheap, generic, flat, basic, or template-generated. "
        "The final card must make designers respect the quality."
    )


def _copy_guidance(category_type: str) -> str:
    return (
        "Generate HIGH-CONVERSION marketplace copy. "
        "Focus only on benefits, emotions, and real user value. "
        "Do not use generic filler phrases like high quality, optimal, modern design, or good material. "
        "Do not describe obvious things. "
        "Do not sound like a dry catalog. "
        "Each phrase must answer why the user should buy this product. "
        "Use short, strong, human, marketplace-ready wording. "
        "Use real-life value: comfort, convenience, durability, practical use, pleasant feeling, daily benefit. "
        "If wording is weak, simplify it and make it more natural. "
        "All text must feel commercially strong, trustworthy, and easy to read."
    )


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
        (
            "CRITICAL DESIGN REQUIREMENT: "
            "The infographic MUST include visible premium plates, badges, or text containers. "
            "Do NOT leave text floating directly on background. "

            "Each key text element (headline, benefits, labels) should be placed inside or near a visual structure: "
            "rounded plates, soft rectangles, gradient blocks, glass-style panels, or premium label badges. "

            "At least one of the following MUST be present: "
            "- product badge (example: '2 шт', 'комплект', size, feature label) "
            "- benefit plates (text inside styled blocks) "
            "- highlight labels or accent tags "

            "The design must feel layered, structured, and visually rich — not flat text over background."
        ),
        (
            "Typography must feel premium, rich, and visually designed. "
            "Use multiple typography levels: dominant headline, stylish subheadline, premium labels, benefit text, accent words, and support text. "
            "Do not keep all text in one identical font style or one identical color. "
            "Use contrast in size, weight, spacing, and emphasis. "
            "Use different text colors for main headline, support text, badges, highlight words, and benefit blocks when it makes the design stronger. "
            "Use beautiful premium text styling, elegant hierarchy, and expensive commercial typography. "
            "The text system must look like it was designed by a senior marketplace designer, not auto-generated."
        ),
        (
            "Background and color direction must feel premium, deep, and designer-made. "
            "Do not use boring plain backgrounds unless the concept is intentionally luxury-minimal. "
            "Use gradient depth, light zones, premium shadows, layered color transitions, subtle texture, glow accents, or elegant abstract graphic background elements when they improve the design. "
            "Choose a strong color concept specifically for this product: dark premium, bright premium, bold commercial, luxury minimal, or modern rich contrast. "
            "The background must support the product and make the whole card look expensive and visually powerful."
        ),
        (
            "Use a rich premium infographic graphic system. "
            "Actively use elegant text plates, premium badges, highlight labels, decorative circles, soft squares, refined accent shapes, clean lines, layered graphic blocks, and stylish visual separators. "
            "Use multi-level typography with different font scales, weights, and emphasis. "
            "Use different text colors for headline, support text, benefits, labels, and accents when it improves the design. "
            "Do not keep all text in the same style. "
            "Make the typography and graphic layout feel designer-made, visually rich, and commercially premium."
        ),
        (
            "This design must maximize click-through rate and conversion. "
            "Every element must help the product sell: composition, text, lighting, color, and emphasis. "
            "If something does not improve sales clarity, do not include it. "
            "The final result must look like a top-performing marketplace product card, not just a beautiful image."
        ),
        (
            "All slides in the series must feel like one premium product story. "
            "Keep one visual DNA across the series: related palette, related lighting mood, related graphic language, and brand consistency. "
            "At the same time, each slide must have a different composition, different message role, and different visual emphasis. "
            "The series must feel cohesive, premium, and intentionally art-directed."
        ),
        (
            "Use premium marketplace infographic structure with strong visual hierarchy. "
            "Use bold headline zones, clean benefit blocks, premium badges, refined callout cards, and visually strong selling accents. "
            "The card must look intentionally designed, expensive, modern, and highly clickable. "
            "Use graphic elements only when they improve sales clarity and product focus."
        ),
        (
            "Choose the best visual scenario for this exact product automatically. "
            "If the product is wearable, consider lifestyle presentation on a person when commercially appropriate. "
            "If the product is used in context, show believable real-life usage when it improves sales. "
            "If the product sells better as a clean isolated hero object, keep the product dominant without unnecessary people. "
            "Always choose the visual direction that best helps this product sell."
        ),
        (
            "Visible text on the infographic must be extremely error-resistant. "
            "Use only short, simple, common, low-risk words. "
            "Avoid rare, complex, ambiguous, or hard-to-spell words. "
            "If any word may be misspelled, replace it with a simpler synonym or remove it. "
            "If text quality is uncertain, use less text, not more text. "
            "Do not generate broken words, mixed alphabets, random symbols, or unreadable text."
        ),
        (
            "Never replace, redesign, or visually corrupt the real product. "
            "Use the uploaded product as the true reference. "
            "Preserve its real shape, proportions, material feel, details, and identity. "
            "Do not invent false specifications, false accessories, false packaging, or false product features. "
            "If some fact is unknown, do not claim it."
        ),
        (
            "You are a world-class marketplace art director, senior infographic designer, "
            "top e-commerce marketer, and conversion-focused visual strategist. "
            "Think like a top seller who knows what design will attract clicks and sales. "
            "Choose the best visual composition, the best commercial style, and the best type of infographic for this exact product automatically. "
            "Make the card look premium, expensive, highly clickable, and professionally designed."
        ),
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