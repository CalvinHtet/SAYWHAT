"""Cut one furniture sheet into separate room sprites.

  rs_art.py <sheet.png> <name> <name> ...   names in reading order, "-" skips a cell

The sheet is a grid on flat green with one object per cell. Each sprite goes to
art/app with an entry in data/rsart.json, which the room code reads.
Set QB_GRID=rows,cols if the sheet is not 3 by 3.
"""
import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "art", "app")
INDEX = os.path.join(ROOT, "data", "rsart.json")
MAX_SIDE = 620


def key(rgb):
    """Alpha from distance to the sheet's own background, which is not always pure green.
    Edge pixels are unmixed from the background so no green fringe is left behind."""
    px = rgb.astype(float)
    H, W = px.shape[:2]
    n = 24
    bg = np.median(np.concatenate([px[:n, :n], px[:n, -n:], px[-n:, :n], px[-n:, -n:]]).reshape(-1, 3), axis=0)
    d = np.sqrt(((px - bg) ** 2).sum(2))
    a = np.clip((d - 26) / 44, 0, 1)
    safe = np.maximum(a, 0.05)[..., None]
    fg = np.where(a[..., None] < 1, (px - (1 - a[..., None]) * bg) / safe, px)
    return np.dstack([fg.clip(0, 255), a * 255]).astype(np.uint8)


def cut(sheet, names):
    rows, cols = [int(v) for v in os.environ.get("QB_GRID", "3,3").split(",")]
    px = key(np.array(Image.open(sheet).convert("RGB")))
    H, W = px.shape[:2]
    solid = px[..., 3] > 60
    lab, n = ndimage.label(ndimage.binary_dilation(solid, iterations=3))
    boxes = ndimage.find_objects(lab)
    cells = {}
    for i, box in enumerate(boxes, 1):
        area = int(((lab[box] == i) & solid[box]).sum())
        if area < 900:
            continue
        cy = (box[0].start + box[0].stop) / 2
        cx = (box[1].start + box[1].stop) / 2
        cell = min(rows - 1, int(cy / H * rows)) * cols + min(cols - 1, int(cx / W * cols))
        cells.setdefault(cell, []).append((i, box, area))
    index = json.load(open(INDEX)) if os.path.exists(INDEX) else {}
    for c, name in enumerate(names):
        if name == "-":
            continue
        if c not in cells:
            print(name, "MISSING")
            continue
        mask = np.isin(lab, [p[0] for p in cells[c]]) & (px[..., 3] > 0)
        ys, xs = np.nonzero(mask)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        crop = px[y0:y1, x0:x1].copy()
        crop[..., 3] = crop[..., 3] * mask[y0:y1, x0:x1]
        im = Image.fromarray(crop)
        s = min(1, MAX_SIDE / max(im.size))
        if s < 1:
            im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        im.save(os.path.join(OUT, name + ".webp"), quality=90, method=6)
        index[name] = {"w": im.width, "h": im.height}
        print(name, im.size, "from", len(cells[c]), "parts")
    json.dump(index, open(INDEX, "w"), indent=0, sort_keys=True)


if __name__ == "__main__":
    cut(sys.argv[1], sys.argv[2:])
