import random
from dataclasses import dataclass


# =========================
# DATA STRUCTURES
# =========================

@dataclass
class Palette:
    bg_top: tuple
    bg_bottom: tuple
    accent: tuple
    accent2: tuple
    accent3: tuple
    headline: tuple
    subheadline: tuple
    panel: tuple
    panel_outline: tuple
    chip_dark: tuple


@dataclass
class DesignPack:
    palette: Palette
    scene: str
    layout: str
    category: str


# =========================
# CATEGORY DETECTION
# =========================

def detect_category(title: str, category: str) -> str:
    text = f"{title} {category}".lower()

    if any(x in text for x in ["iphone", "науш", "электрон", "смарт", "гаджет"]):
        return "electronics"

    if any(x in text for x in ["крем", "духи", "beauty", "уход", "кожа"]):
        return "beauty"

    if any(x in text for x in ["футболка", "одежда", "куртка", "обувь"]):
        return "fashion"

    if any(x in text for x in ["дет", "игрушка", "ребенок"]):
        return "kids"

    if any(x in text for x in ["кухня", "дом", "посуда", "интерьер"]):
        return "home"

    if any(x in text for x in ["спорт", "трен", "гантели"]):
        return "sport"

    if any(x in text for x in ["машина", "авто", "car"]):
        return "auto"

    return "universal"


# =========================
# PALETTES
# =========================

def get_palette(category: str) -> Palette:
    palettes = {
        "electronics": [
            Palette((10, 20, 40), (0, 80, 160), (0, 200, 255, 255), (0,150,255,255), (255,200,0,255),
                    (255,255,255), (200,230,255), (255,255,255,20), (255,255,255,40), (10,20,40,200))
        ],

        "beauty": [
            Palette((255, 230, 240), (255, 180, 200), (255, 100, 140, 255), (255,150,200,255), (255,200,220,255),
                    (40,20,30), (90,50,70), (255,255,255,180), (255,255,255,40), (255,100,150,180))
        ],

        "fashion": [
            Palette((30, 30, 30), (80, 80, 80), (255, 255, 255, 255), (200,200,200,255), (255,200,0,255),
                    (255,255,255), (200,200,200), (255,255,255,20), (255,255,255,40), (20,20,20,180))
        ],

        "kids": [
            Palette((255, 240, 200), (255, 200, 100), (255, 100, 0, 255), (0,200,255,255), (255,0,150,255),
                    (40,40,40), (80,80,80), (255,255,255,150), (255,255,255,30), (255,150,0,150))
        ],

        "home": [
            Palette((240, 240, 240), (200, 200, 200), (0, 120, 255, 255), (0,180,255,255), (255,180,0,255),
                    (20,20,20), (80,80,80), (255,255,255,200), (255,255,255,40), (0,120,255,150))
        ],

        "sport": [
            Palette((0, 0, 0), (50, 0, 0), (255, 0, 0, 255), (255,100,0,255), (255,255,0,255),
                    (255,255,255), (200,200,200), (255,255,255,20), (255,255,255,40), (50,0,0,200))
        ],

        "auto": [
            Palette((20, 20, 20), (60, 60, 60), (255, 50, 50, 255), (255,150,0,255), (255,255,0,255),
                    (255,255,255), (200,200,200), (255,255,255,20), (255,255,255,40), (20,20,20,200))
        ],

        "universal": [
            Palette((240, 240, 240), (255, 255, 255), (0, 120, 255, 255), (0,180,255,255), (255,180,0,255),
                    (20,20,20), (80,80,80), (255,255,255,200), (255,255,255,40), (0,120,255,150))
        ],
    }

    return random.choice(palettes.get(category, palettes["universal"]))


# =========================
# SCENES
# =========================

def get_scene(category: str) -> str:
    scenes = {
        "electronics": ["tech", "neon", "dark"],
        "beauty": ["soft", "pastel", "clean"],
        "fashion": ["dark", "minimal", "studio"],
        "kids": ["fun", "colorful"],
        "home": ["light", "cozy"],
        "sport": ["energy", "dark"],
        "auto": ["metal", "industrial"],
        "universal": ["clean", "minimal"]
    }

    return random.choice(scenes.get(category, ["clean"]))


# =========================
# LAYOUTS
# ========================= 
def get_layout(category: str) -> str:
    layouts = [
        "center_focus",
        "left_text_right_product",
        "bottom_infographic",
        "grid_features",
        "cards"
    ]
    return random.choice(layouts)


# =========================
# MAIN FUNCTION
# =========================

def build_design_pack(title: str, category: str, slide_type: str, seed: int = 0) -> dict:
    random.seed(seed)

    detected = detect_category(title, category)

    palette = get_palette(detected)
    scene = get_scene(detected)
    layout = get_layout(detected)

    return {
        "palette": palette,
        "scene": scene,
        "layout": layout,
        "category": detected
    }