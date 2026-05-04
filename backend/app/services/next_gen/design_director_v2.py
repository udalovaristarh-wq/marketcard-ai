from __future__ import annotations


def build_design_direction(
    *,
    product_title: str,
    category: str,
    brand: str,
    marketplace: str,
) -> dict:
    """
    V2 Design Brain:
    AI should create design around product,
    never redesign product itself.
    """

    category_l = (category or "").lower()
    title_l = (product_title or "").lower()

    if any(x in category_l or x in title_l for x in ["авто", "запчаст", "подвес", "масло", "car", "auto"]):
        style = "premium automotive performance design, metallic accents, technical trust, powerful engineering aesthetic"
        bg = "dark metallic, speed lines, automotive energy"
    elif any(x in category_l or x in title_l for x in ["мыло", "космет", "beauty", "skin", "cream"]):
        style = "premium beauty commercial design, clean luxury, glossy wellness aesthetic"
        bg = "soft gradients, skincare glow, premium product aura"
    elif any(x in category_l or x in title_l for x in ["tech", "mouse", "keyboard", "electronics"]):
        style = "high-tech commercial design, futuristic lighting, premium gadget aesthetic"
        bg = "neon tech, clean contrast, digital premium"
    else:
        style = "premium marketplace commercial design, high CTR infographic style"
        bg = "clean marketplace premium gradient background"

    master_prompt = f"""
STRICT PRODUCT PRESERVATION MODE.

The uploaded product is the real product and must remain pixel-faithful:
- do NOT redraw product
- do NOT change geometry
- do NOT stylize product
- do NOT animefy
- do NOT deform
- do NOT add marketplace logos
- do NOT replace product

ONLY:
- remove/replace background
- build premium commercial design around product
- add sales composition
- add infographic zones
- preserve exact product shape

Design style: {style}
Background style: {bg}
Marketplace: {marketplace}
"""

    return {
        "style": style,
        "background_style": bg,
        "master_prompt": master_prompt.strip(),
    }
