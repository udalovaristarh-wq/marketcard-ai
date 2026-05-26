from __future__ import annotations

from pathlib import Path
from rembg import remove


def process_with_local_rembg(image_path: str, output_path: str) -> dict:
    src = Path(image_path).resolve()
    out = Path(output_path).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)

    if not src.exists():
        return {"success": False, "reason": f"source not found: {src}"}

    try:
        input_bytes = src.read_bytes()
        output_bytes = remove(input_bytes)
        out.write_bytes(output_bytes)

        return {
            "success": True,
            "provider": "local_rembg",
            "output_path": str(out),
        }
    except Exception as e:
        return {
            "success": False,
            "provider": "local_rembg",
            "reason": str(e),
        }
