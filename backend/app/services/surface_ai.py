from PIL import ImageDraw

def draw_platform(draw: ImageDraw.ImageDraw, width: int, height: int, mode: str):
    cx = width // 2
    cy = int(height * 0.78)

    if mode == "metal":
        draw.ellipse((cx - 240, cy - 40, cx + 240, cy + 40), fill=(90, 100, 120, 180))
        draw.ellipse((cx - 200, cy - 26, cx + 200, cy + 26), fill=(150, 160, 180, 160))
    elif mode == "glass":
        draw.ellipse((cx - 230, cy - 36, cx + 230, cy + 36), fill=(255, 255, 255, 60))
    else:
        draw.ellipse((cx - 220, cy - 34, cx + 220, cy + 34), fill=(40, 40, 40, 150))