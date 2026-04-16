from __future__ import annotations
from typing import Any
import cv2
import numpy as np

def _load_image(path: str):
    img = cv2.imread(path)
    if img is None:
        raise FileNotFoundError(path)
    return img

def _detect_product_box(img: np.ndarray) -> tuple[int, int, int, int]:
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 60, 140)

    kernel = np.ones((5, 5), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=2)
    edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=2)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    best = None
    best_area = 0

    for c in contours:
        x, y, cw, ch = cv2.boundingRect(c)
        area = cw * ch
        if area < (w * h * 0.04):
            continue

        if area > best_area:
            best = (x, y, cw, ch)
            best_area = area

    if best is None:
        return (int(w * 0.22), int(h * 0.18), int(w * 0.56), int(h * 0.62))

    return best

def _expand_box(box, w, h, pad=0.03):
    x, y, bw, bh = box
    px = int(w * pad)
    py = int(h * pad)
    x = max(0, x - px)
    y = max(0, y - py)
    bw = min(w - x, bw + px * 2)
    bh = min(h - y, bh + py * 2)
    return (x, y, bw, bh)

def _box_overlap(a, b):
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    x1 = max(ax, bx)
    y1 = max(ay, by)
    x2 = min(ax + aw, bx + bw)
    y2 = min(ay + ah, by + bh)
    return max(0, x2 - x1) * max(0, y2 - y1)

def _zone_complexity(img, box):
    x, y, w, h = box
    roi = img[y:y+h, x:x+w]
    if roi.size == 0:
        return 1e9

    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 80, 160)
    return float(edges.mean())

def _candidate_boxes(w, h):
    return {
        "top_left": (int(w * 0.08), int(h * 0.05), int(w * 0.28), int(h * 0.12)),
        "top_center": (int(w * 0.20), int(h * 0.05), int(w * 0.54), int(h * 0.12)),
        "top_right": (int(w * 0.66), int(h * 0.05), int(w * 0.22), int(h * 0.10)),
        "mid_left": (int(w * 0.05), int(h * 0.28), int(w * 0.30), int(h * 0.28)),
        "mid_right": (int(w * 0.65), int(h * 0.28), int(w * 0.30), int(h * 0.28)),
        "bottom_center": (int(w * 0.22), int(h * 0.78), int(w * 0.54), int(h * 0.10)),
    }

def analyze_smart_layout(image_path: str, slide_key: str) -> dict[str, Any]:
    img = _load_image(image_path)
    h, w = img.shape[:2]

    product_box = _expand_box(_detect_product_box(img), w, h)
    candidates = _candidate_boxes(w, h)

    best = None
    best_score = -1e9

    for name, box in candidates.items():
        overlap = _box_overlap(box, product_box)
        complexity = _zone_complexity(img, box)
        score = 10000 - overlap * 0.03 - complexity * 1.2

        if score > best_score:
            best = box
            best_score = score

    return {
        "image_size": (w, h),
        "product_box": product_box,
        "zones": {
            "headline": best,
            "subheadline": best,
            "bullets": best,
            "badge": best,
            "footer": best,
        },
        "slide_key": slide_key,
    }
