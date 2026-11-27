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

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cliplib import trim_line  # noqa: E402



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
open(path, "w").write(text if text.endswith("\n") else text)
print("clip lines redone:", n)
