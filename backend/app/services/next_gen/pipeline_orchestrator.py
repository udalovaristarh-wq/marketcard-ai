from __future__ import annotations

from pathlib import Path
from typing import Dict, Any

from app.services.next_gen.tools.photoroom_client import process_with_photoroom
from app.services.next_gen.tools.removebg_client import process_with_removebg
from app.services.next_gen.tools.local_rembg_client import process_with_local_rembg
from app.services.next_gen.tools.claid_client import process_with_claid


def run_product_pipeline(
    *,
    source_image: str,
    work_dir: str,
) -> Dict[str, Any]:
    src = Path(source_image).resolve()
    out = Path(work_dir).resolve()
    out.mkdir(parents=True, exist_ok=True)

    current = src
    stages = []

    # Stage 1 — PhotoRoom
    pr_out = out / "stage_photoroom.png"
    pr = process_with_photoroom(str(current), str(pr_out))
    stages.append({"stage": "photoroom", **pr})
    if pr.get("success") and pr_out.exists():
        current = pr_out

    # Stage 2 — RemoveBG API fallback
    if current == src:
        rb_out = out / "stage_removebg.png"
        rb = process_with_removebg(str(current), str(rb_out))
        stages.append({"stage": "removebg", **rb})
        if rb.get("success") and rb_out.exists():
            current = rb_out

    # Stage 2.5 — FREE local rembg fallback
    if current == src:
        lrb_out = out / "stage_local_rembg.png"
        lrb = process_with_local_rembg(str(current), str(lrb_out))
        stages.append({"stage": "local_rembg", **lrb})
        if lrb.get("success") and lrb_out.exists():
            current = lrb_out

    # Stage 3 — Claid polish
    cl_out = out / "stage_claid.png"
    cl = process_with_claid(str(current), str(cl_out))
    stages.append({"stage": "claid", **cl})
    if cl.get("success") and cl_out.exists():
        current = cl_out

    return {
        "success": True,
        "final_product_path": str(current),
        "source_product_path": str(src),
        "stages": stages,
    }
