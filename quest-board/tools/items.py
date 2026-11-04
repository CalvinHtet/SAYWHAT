"""Finish shop items after their sheets are ingested.

  items.py <layers dir> <app art dir> <data/items.json>

Writes a cut-out icon for each item, so the shop shows only the item, and works out
where a hat trims the hair: a line across the art, one height per column, following the
hat's lower edge. Past the sides of the head the line slopes down, so hair falls out from
under the hat instead of ending in a flat cut or leaving stray tufts.
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
SLOPE = 1.25  # how fast the line drops per pixel outside the head


def trim_line(hat, head):
    """hat and head are boolean masks of one view. Returns COLUMNS heights from 0 to 1."""
    h, w = hat.shape
    bottom = np.full(w, -1.0)
    for x in np.nonzero(hat.any(axis=0))[0]:
        rows = np.nonzero(hat[:, x])[0]
        # End of the first solid run, so hair still shows through a strap gap in the hat.
        gaps = np.nonzero(np.diff(rows) > 40)[0]
        end = rows[gaps[0]] if len(gaps) else rows[-1]
        # Tuck the hair a little way under the edge so no gap opens up.
        bottom[x] = end - min(0.25 * (end - rows[0]), 40)
    covered = np.nonzero(bottom >= 0)[0]
    centre = (covered.min() + covered.max()) // 2
    rows_at = int(np.median(bottom[max(covered.min(), centre - 120):min(covered.max(), centre + 120)]))
    head_cols = np.nonzero(head[min(h - 1, rows_at)])[0]
    left, right = (head_cols.min(), head_cols.max()) if len(head_cols) else (covered.min(), covered.max())
    at = lambda x: bottom[covered[np.argmin(np.abs(covered - x))]]
    line = np.array([bottom[x] if bottom[x] >= 0 else at(x) for x in range(w)], dtype=float)
    a_left, a_right = at(left), at(right)
    for x in range(w):
        if x < left:
            line[x] = max(line[x], a_left + SLOPE * (left - x))
        elif x > right:
            line[x] = max(line[x], a_right + SLOPE * (x - right))
    edges = np.linspace(0, w, COLUMNS, endpoint=False).astype(int)
    step = w // COLUMNS
    return [round(float(line[e:e + step].max()) / h, 4) for e in edges]


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

    if meta.get("slot") == "hat":
        meta["clip"] = {}
        for b in ("m", "f"):
            meta["clip"][b] = {}
            for view in ("front", "back"):
                p = os.path.join(layers, f"{b}_{art}_{view}.png")
                if os.path.exists(p):
                    alpha = np.asarray(Image.open(p).convert("RGBA"))[..., 3] > 40
                    head = np.asarray(Image.open(os.path.join(layers, f"{b}_base_{view}.png")).convert("RGBA"))[..., 3] > 40
                    up = meta.get("lift", {}).get(b, 0) / alpha.shape[0]
                    meta["clip"][b][view] = [round(max(0, y - up), 4) for y in trim_line(alpha, head)]


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
