"""Finish shop items after their sheets are ingested.

  items.py <layers dir> <app art dir> <data/items.json>

Writes a cut-out icon for each item, so the shop shows only the item, and works out
where a hat trims the hair: a line across the art, one height per column, following the
hat's lower edge, and flat at the brim's height past the hat (tools/cliplib.py).
"""
import json
import os
import re
import sys

import numpy as np
from PIL import Image

layers, app, path = sys.argv[1:4]
items = json.load(open(path))
ICON = 320
COLUMNS = 64  # must match CLIP_COLUMNS in src/rig.js
RECLIP = set(x for x in os.environ.get("RECLIP", "").split(",") if x)


# the hats' clip line lives in tools/cliplib.py (shared with tools/clip_lines.py), so running this never brings the old line back
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cliplib import trim_line  # noqa: E402

for art, meta in items.items():
    body = "f" if meta.get("femaleOnly") else "m"
    src = os.path.join(layers, f"{body}_{art}_front.png")
    if not os.path.exists(src):
        continue
    im = Image.open(src).convert("RGBA")
    a = np.asarray(im)[..., 3] > 40
    ys, xs = np.nonzero(a)
    if not len(xs):
        print("EMPTY", art)
        continue
    pad = 24
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.width, xs.max() + pad), min(im.height, ys.max() + pad))
    crop = im.crop(box)
    crop.thumbnail((ICON, ICON), Image.LANCZOS)
    tile = Image.new("RGBA", (ICON, ICON), (0, 0, 0, 0))
    tile.alpha_composite(crop, ((ICON - crop.width) // 2, (ICON - crop.height) // 2))
    tile.save(os.path.join(app, f"icon_{art}.webp"), "WEBP", quality=92, alpha_quality=95, method=6)

    # noClip: a band or a clip that sits in the hair, so the hair above it stays.
    if meta.get("noClip"):
        meta.pop("clip", None)
    elif meta.get("slot") == "hat":
        # LEAD 11-28: a hat that already has a clip keeps it (QA passed that one); re-running this for other items used to
        # re-derive every hat's line from its current layer and drift live hats (nc_fleecetrapper). Redo on purpose with
        # RECLIP=<art,art> (or RECLIP=all) in the environment, or with tools/clip_lines.py.
        if meta.get("clip") and art not in RECLIP and "all" not in RECLIP:
            continue
        meta["clip"] = {}
        for b in ("m", "f"):
            meta["clip"][b] = {}
            for view in ("front", "back"):
                p = os.path.join(layers, f"{b}_{art}_{view}.png")
                if os.path.exists(p):
                    alpha = np.asarray(Image.open(p).convert("RGBA"))[..., 3] > 40
                    # clipTop (0..1 of the layer height): only the hat above this row cuts the hair, so long hanging parts
                    # (a bandana's tails) do not cut a deep notch that tears when they swing (ROOMS 11-25, QA on smk_tails)
                    if meta.get("clipTop"):
                        alpha = alpha.copy()
                        alpha[int(meta["clipTop"] * alpha.shape[0]):] = False
                    up = meta.get("lift", {}).get(b, 0) / alpha.shape[0]
                    meta["clip"][b][view] = [round(max(0, y - up), 4) for y in trim_line(alpha)]


def smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def tinted(path, ramp):
    """The same color ramp the rig's shader applies, for a basic's shop icon."""
    im = np.asarray(Image.open(path).convert("RGBA")).astype(float) / 255
    rgb, al = im[..., :3], im[..., 3:]
    l = (rgb @ [0.299, 0.587, 0.114])[..., None]
    A, B, C = (np.array(ramp[k]) for k in "abc")
    low = A + (B - A) * smooth(0.14, 0.5, l)
    high = B + (C - B) * smooth(0.5, 0.9, l)
    r = np.where(l < 0.5, low, high)
    out = rgb + (r - rgb) * smooth(0.05, 0.16, l)
    return Image.fromarray((np.dstack([np.clip(out, 0, 1), al]) * 255).round().astype("uint8"), "RGBA")


def save_icon(im, name):
    ys, xs = np.nonzero(np.asarray(im)[..., 3] > 40)
    pad = 24
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.width, xs.max() + pad), min(im.height, ys.max() + pad))
    crop = im.crop(box)
    crop.thumbnail((ICON, ICON), Image.LANCZOS)
    tile = Image.new("RGBA", (ICON, ICON), (0, 0, 0, 0))
    tile.alpha_composite(crop, ((ICON - crop.width) // 2, (ICON - crop.height) // 2))
    tile.save(os.path.join(app, f"icon_{name}.webp"), "WEBP", quality=90, alpha_quality=92, method=6)


creator = json.load(open(os.path.join(os.path.dirname(path), "creator.json")))
for group in ("tops", "bottoms", "shoes"):
    for o in creator[group]:
        for c in creator["clothColors"]:
            save_icon(tinted(os.path.join(layers, f"m_{o['id']}_front.png"), c), f"basic_{o['id']}_{c['id']}")
brown = next(c for c in creator["hairColors"] if c["id"] == "brown")
for b in ("m", "f"):
    for o in creator["hairStyles"][b]:
        save_icon(tinted(os.path.join(layers, f"{b}_{o['id']}_front.png"), brown), f"basic_{b}_{o['id']}")

text = json.dumps(items, indent=1)
# Keep each trim line on one row.
text = re.sub(r"\[\s+([0-9.,\s]+?)\s+\]", lambda m: "[" + re.sub(r"\s+", "", m.group(1)) + "]", text)
open(path, "w").write(text)
print("items", len(items))
