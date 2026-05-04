from __future__ import annotations

from pathlib import Path
from typing import Any
import shutil

from app.services.next_gen.external_tools import get_external_tool_config
from app.services.next_gen.tools.photoroom_client import process_with_photoroom
from app.services.next_gen.tools.removebg_client import process_with_removebg
from app.services.next_gen.tools.claid_client import process_with_claid
from app.services.next_gen.pipeline_orchestrator import run_product_pipeline


def prepare_locked_product(
    *,
    product_image_path: str,
    work_dir: str,
) -> dict[str, Any]:
    """
    V2 product lock layer.

    Goal:
    - never redraw the product
    - prepare a clean product-safe source
    - later connect PhotoRoom / RemoveBG / Claid / upscale here

    For now this is safe passthrough, so it does not break production.
    """
    src = Path(product_image_path).resolve()
    if not src.exists():
        raise FileNotFoundError(f"Product image not found: {src}")

    out_dir = Path(work_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    cfg = get_external_tool_config()

    locked_path = out_dir / f"locked_product{src.suffix.lower() or '.png'}"
    shutil.copy2(src, locked_path)

    product_pipeline = run_product_pipeline(
        source_image=str(locked_path),
        work_dir=str(out_dir),
    )
    locked_path = Path(product_pipeline["final_product_path"])
    tool_results = product_pipeline.get("stages", [])

    return {
        "success": True,
        "locked_product_path": str(locked_path),
        "tool_results": tool_results,
        "source_product_path": str(src),
        "tools": {
            "photoroom_enabled": cfg.photoroom_enabled,
            "removebg_enabled": cfg.removebg_enabled,
            "clipdrop_enabled": cfg.clipdrop_enabled,
            "claid_enabled": cfg.claid_enabled,
            "letsenhance_enabled": cfg.letsenhance_enabled,
        },
        "mode": "passthrough_until_api_keys_connected",
    }
