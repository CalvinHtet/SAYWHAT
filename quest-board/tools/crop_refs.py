"""Cut single-pose style references out of the legacy raw sheets.

Usage: crop_refs.py <raw sheets dir> <output dir>
The legacy sheets are 3 columns x 2 rows; the top-left cell is the idle pose.
"""
import os
import sys

from PIL import Image

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
for sex, sheet in (("m", "m_top_hoodie"), ("f", "f_top_hoodie")):
    im = Image.open(os.path.join(src, sheet + ".webp")).convert("RGB")
    cell = im.crop((0, 0, im.width // 3, im.height // 2))
    # Pad back to 2:3 so the character keeps its proportions in the generator.
    w = cell.width
    h = int(w * 1.5)
    canvas = Image.new("RGB", (w, max(h, cell.height)), (0, 255, 0))
    canvas.paste(cell, (0, 0))
    canvas.save(os.path.join(out, f"ref_{sex}.png"))
    print(sex, canvas.size)
