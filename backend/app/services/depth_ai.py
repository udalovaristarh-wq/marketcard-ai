from PIL import ImageDraw
import random

def draw_depth_particles(draw: ImageDraw.ImageDraw, width: int, height: int, count: int = 28):
    for _ in range(count):
        x = random.randint(0, width)
        y = random.randint(0, height)
        r = random.randint(2, 7)
        alpha = random.randint(20, 70)
        draw.ellipse((x-r, y-r, x+r, y+r), fill=(255, 255, 255, alpha))