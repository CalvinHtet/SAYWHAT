"""Rework only the hats' hair clip lines in data/items.json (no icons, no other keys).

  clip_lines.py <layers dir> <data/items.json> [ids comma-separated]

Cal 11-26: "make sure they look good on every hairstyle for male and female so that there is no weird gaps. They should look natural."
QA's sweep (rigtest/qa/hairgap_1126.md): on almost every brimmed hat the old line (tools/items.py trim_line) kept dropping past the sides
of the head, so long hair, a ponytail and hair hanging behind were sliced in diagonal and vertical lines.

The new line, per column of the layer:
  - under the hat: the hat's lower edge, tucked a little under it (as before), so hair poking through the hat stays hidden;
  - past the hat: the brim's height at that side, flat, never lower. Hair above the brim beside the hat is still hidden, and
    everything below the brim (long hair, a ponytail, hair falling behind) stays whole.
The rig (src/rig.js) feathers the line, so where hair does meet it, it fades instead of ending in a hard edge.
"""
import json
import re
import sys

import numpy as np
from PIL import Image
import os

COLUMNS = 64  # must match CLIP_COLUMNS in src/rig.js


def trim_line(hat):
    h, w = hat.shape
    bottom = np.full(w, -1.0)
    for x in np.nonzero(hat.any(axis=0))[0]:
        rows = np.nonzero(hat[:, x])[0]
        gaps = np.nonzero(np.diff(rows) > 40)[0]
        end = rows[gaps[0]] if len(gaps) else rows[-1]
        bottom[x] = end - min(0.25 * (end - rows[0]), 40)
    covered = np.nonzero(bottom >= 0)[0]
    lo, hi = covered.min(), covered.max()
    # the brim's height at each side: the lower edge over the outer eighth of the hat
    span = max(8, (hi - lo) // 8)
    left_y = float(np.median(bottom[lo:lo + span][bottom[lo:lo + span] >= 0]))
    right_y = float(np.median(bottom[hi - span + 1:hi + 1][bottom[hi - span + 1:hi + 1] >= 0]))
    line = np.zeros(w)
    for x in range(w):
        if bottom[x] >= 0:
            line[x] = bottom[x]
        elif x < lo:
            line[x] = left_y
        elif x > hi:
            line[x] = right_y
        else:  # a strap gap inside the hat: the lower of its neighbours
            l = bottom[:x][bottom[:x] >= 0]
            r = bottom[x:][bottom[x:] >= 0]
            line[x] = min(l[-1] if len(l) else 0, r[0] if len(r) else 0)
    edges = np.linspace(0, w, COLUMNS, endpoint=False).astype(int)
    step = w // COLUMNS
    return [round(float(line[e:e + step].min()) / h, 4) for e in edges]


layers, path = sys.argv[1:3]
only = set(sys.argv[3].split(",")) if len(sys.argv) > 3 and sys.argv[3] else None
items = json.load(open(path))
n = 0
for art, meta in items.items():
    if meta.get("slot") != "hat" or meta.get("noClip") or not meta.get("clip"):
        continue
    if only and art not in only:
        continue
    for b in ("m", "f"):
        for view in ("front", "back"):
            p = os.path.join(layers, f"{b}_{art}_{view}.png")
            if not os.path.exists(p) or b not in meta["clip"]:
                continue
            alpha = np.asarray(Image.open(p).convert("RGBA"))[..., 3] > 40
            if meta.get("clipTop"):
                alpha = alpha.copy()
                alpha[int(meta["clipTop"] * alpha.shape[0]):] = False
            if not alpha.any():
                continue
            up = meta.get("lift", {}).get(b, 0) / alpha.shape[0]
            meta["clip"][b][view] = [round(max(0, y - up), 4) for y in trim_line(alpha)]
    n += 1
text = json.dumps(items, indent=1)
# the same layout as tools/items.py: each trim line on one row
text = re.sub(r"\[\s+([0-9.,\s]+?)\s+\]", lambda m: "[" + re.sub(r"\s+", "", m.group(1)) + "]", text)
open(path, "w").write(text)
print("clip lines redone:", n)
