from PIL import Image, ImageDraw, ImageFilter
import random


# =========================
# BASE GRADIENT
# =========================

def create_gradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", size, top)
    draw = ImageDraw.Draw(img)

    for y in range(h):
        r = int(top[0] + (bottom[0] - top[0]) * y / h)
        g = int(top[1] + (bottom[1] - top[1]) * y / h)
        b = int(top[2] + (bottom[2] - top[2]) * y / h)
        draw.line((0, y, w, y), fill=(r, g, b))

    return img.convert("RGBA")


# =========================
# GLOW EFFECT
# =========================

def add_glow(img, x, y, radius, color):
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)

    draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=color)
    glow = glow.filter(ImageFilter.GaussianBlur(radius // 2))

    img.alpha_composite(glow)


# =========================
# TECH GRID
# =========================

def add_grid(img, step=80, color=(255,255,255,30)):
    draw = ImageDraw.Draw(img)
    w, h = img.size

    for x in range(0, w, step):
        draw.line((x, 0, x, h), fill=color)

    for y in range(0, h, step):
        draw.line((0, y, w, y), fill=color)


# =========================
# GLASS PANEL
# =========================

def add_glass_panel(img, box):
    overlay = Image.new("RGBA", img.size, (0,0,0,0))
    draw = ImageDraw.Draw(overlay)

    draw.rounded_rectangle(
        box,
        radius=30,
        fill=(255,255,255,40),
        outline=(255,255,255,80)
    )

    overlay = overlay.filter(ImageFilter.GaussianBlur(4))
    img.alpha_composite(overlay)


# =========================
# LIGHT STREAKS
# =========================

def add_light_streak(img):
    overlay = Image.new("RGBA", img.size, (0,0,0,0))
    draw = ImageDraw.Draw(overlay)

    w, h = img.size

    for i in range(3):
        x1 = random.randint(0, w)
        x2 = x1 + random.randint(200, 400)

        draw.line(
            (x1, 0, x2, h),
            fill=(255,255,255,80),
            width=3
        )

    overlay = overlay.filter(ImageFilter.GaussianBlur(10))
    img.alpha_composite(overlay)


# =========================
# MAIN SCENE BUILDER
# =========================

def build_scene(size, palette, scene_type):
    img = create_gradient(size, palette.bg_top, palette.bg_bottom)

    w, h = size

    # универсальный glow
    add_glow(img, int(w*0.8), int(h*0.2), 300, palette.accent)
    add_glow(img, int(w*0.2), int(h*0.8), 250, palette.accent3)

    if scene_type == "tech":
        add_grid(img)
        add_light_streak(img)

    elif scene_type == "neon":
        add_glow(img, int(w*0.5), int(h*0.5), 200, palette.accent2)

    elif scene_type == "clean":
        pass

    elif scene_type == "dark":
        add_light_streak(img)

    elif scene_type == "soft":
        add_glow(img, int(w*0.5), int(h*0.6), 200, palette.accent2)

    elif scene_type == "premium":
        add_glass_panel(img, (80, 200, w-80, h-120))

    return img