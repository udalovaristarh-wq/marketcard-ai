from __future__ import annotations
from typing import Any
import cv2
import numpy as np

try:
    from paddleocr import PaddleOCR
except Exception:
    PaddleOCR = None

_OCR = None

def _get_ocr():
    global _OCR
    if PaddleOCR is None:
        return None
    if _OCR is None:
        _OCR = PaddleOCR(use_angle_cls=False, lang="en")
    return _OCR

def _load_image(path: str):
    img = cv2.imread(path)
    if img is None:
        raise FileNotFoundError(path)
    return img

def _largest_object_box(img: np.ndarray) -> tuple[int, int, int, int]:
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 80, 160)
    kernel = np.ones((5, 5), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=2)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    best = None
    best_area = 0
    cx_min = int(w * 0.15)
    cx_max = int(w * 0.85)
    cy_min = int(h * 0.10)
    cy_max = int(h * 0.90)

    for c in contours:
        x, y, cw, ch = cv2.boundingRect(c)
        area = cw * ch
        cx = x + cw // 2
        cy = y + ch // 2
        if area < (w * h * 0.03):
            continue
        if not (cx_min <= cx <= cx_max and cy_min <= cy <= cy_max):
            continue
        if area > best_area:
            best = (x, y, cw, ch)
            best_area = area

    if best is None:
        return (int(w * 0.25), int(h * 0.20), int(w * 0.50), int(h * 0.55))
    return best

def _zone_score(img: np.ndarray, box: tuple[int, int, int, int], avoid: tuple[int, int, int, int]) -> float:
    x, y, w, h = box
    ax, ay, aw, ah = avoid

    overlap_x1 = max(x, ax)
    overlap_y1 = max(y, ay)
    overlap_x2 = min(x + w, ax + aw)
    overlap_y2 = min(y + h, ay + ah)
    overlap = max(0, overlap_x2 - overlap_x1) * max(0, overlap_y2 - overlap_y1)

    roi = img[y:y+h, x:x+w]
    if roi.size == 0:
        return -1e9

    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 80, 160)
    edge_density = float(edges.mean())

    score = 1000.0
    score -= overlap * 0.02
    score -= edge_density * 2.5
    return score

def _candidate_zones(w: int, h: int) -> dict[str, tuple[int, int, int, int]]:
    return {
        "headline_top": (int(w * 0.08), int(h * 0.05), int(w * 0.72), int(h * 0.10)),
        "subheadline_top": (int(w * 0.08), int(h * 0.16), int(w * 0.60), int(h * 0.08)),
        "left_mid": (int(w * 0.05), int(h * 0.28), int(w * 0.34), int(h * 0.34)),
        "right_mid": (int(w * 0.61), int(h * 0.28), int(w * 0.34), int(h * 0.34)),
        "bottom_strip": (int(w * 0.06), int(h * 0.76), int(w * 0.88), int(h * 0.16)),
        "badge_top_right": (int(w * 0.74), int(h * 0.05), int(w * 0.18), int(h * 0.06)),
    }

def analyze_layout(image_path: str, slide_key: str) -> dict[str, Any]:
    img = _load_image(image_path)
    h, w = img.shape[:2]
    product_box = _largest_object_box(img)
    zones = _candidate_zones(w, h)

    scored = {k: _zone_score(img, v, product_box) for k, v in zones.items()}

    bullets_zone = "left_mid" if scored["left_mid"] >= scored["right_mid"] else "right_mid"

    return {
        "image_size": (w, h),
        "product_box": product_box,
        "zones": {
            "headline": zones["headline_top"],
            "subheadline": zones["subheadline_top"],
            "bullets": zones[bullets_zone],
            "badge": zones["badge_top_right"],
            "footer": zones["bottom_strip"],
        },
        "scores": scored,
        "slide_key": slide_key,
    }
