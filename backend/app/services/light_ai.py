from PIL import Image, ImageFilter, ImageEnhance

def add_soft_glow(image: Image.Image) -> Image.Image:
    glow = image.copy().filter(ImageFilter.GaussianBlur(18))
    glow = ImageEnhance.Brightness(glow).enhance(1.2)
    base = image.copy()
    base = Image.blend(glow, base, 0.65)
    return base


def add_shadow_layer(image: Image.Image) -> Image.Image:
    shadow = image.copy().filter(ImageFilter.GaussianBlur(20))
    shadow = ImageEnhance.Brightness(shadow).enhance(0.45)
    return shadow