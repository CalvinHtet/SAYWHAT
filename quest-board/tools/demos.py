"""Cut exercise sheets into demo frames.

  demos.py <exercise id> <raw sheet.png> [...]

One sheet is a 2 by 2 grid: man on top, woman below, start on the left, end on the right.
Each body's two frames are aligned on whatever doesn't move and share one scale, so
fading between them shows only the movement. Writes art/app/ex_<id>_<m|f>_<a|b>.webp.
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ni

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "art", "app")
SIZE = 460


def key(cell):
    """Green to transparent, and no green fringe left on the edges."""
    a = np.asarray(cell.convert("RGB")).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    spill = g - np.maximum(r, b)
    alpha = np.clip(1 - (spill - 30) / 70, 0, 1)
    alpha[(g > 150) & (r < 95) & (b < 95)] = 0
    a[..., 1] = np.where(spill > 0, np.maximum(r, b), g)
    solid = alpha > 0.5
    parts, n = ni.label(solid, structure=np.ones((3, 3)))
    if n:
        sizes = ni.sum(solid, parts, range(1, n + 1))
        keep = np.isin(parts, 1 + np.nonzero(sizes > 0.0012 * solid.size)[0])
        alpha = alpha * ni.binary_dilation(keep, iterations=2)
    return np.dstack([a, alpha * 255])


def offset(a, b):
    """How far to move b so it stands on the same spot as a: same floor line, and the
    lower body or machine, which moves least, lined up sideways."""
    al, bl = a[..., 3] > 128, b[..., 3] > 128
    dy = int(np.nonzero(al.any(axis=1))[0].max() - np.nonzero(bl.any(axis=1))[0].max())
    h = al.shape[0]
    low = h - (h - np.nonzero(al.any(axis=1))[0].min()) * 2 // 5
    pa = al[low:].sum(axis=0).astype(float)
    pb = np.roll(bl, dy, axis=0)[low:].sum(axis=0).astype(float)
    reach = al.shape[1] // 4
    best, dx = -1.0, 0
    for d in range(-reach, reach + 1, 2):
        score = float((pa * np.roll(pb, d)).sum())
        if score > best:
            best, dx = score, d
    return dx, dy


def moved(arr, dx, dy):
    """The same art shifted, with nothing wrapping round to the far side."""
    out = np.zeros_like(arr)
    h, w = arr.shape[:2]
    sy, sx = max(0, -dy), max(0, -dx)
    ty, tx = max(0, dy), max(0, dx)
    ch, cw = h - abs(dy), w - abs(dx)
    out[ty:ty + ch, tx:tx + cw] = arr[sy:sy + ch, sx:sx + cw]
    return out


def touches_edge(arr):
    al = arr[..., 3] > 128
    return al[:3].any() or al[-3:].any() or al[:, :3].any() or al[:, -3:].any()


args = sys.argv[1:]
for ex, path in zip(args[0::2], args[1::2]):
    sheet = Image.open(path).convert("RGB")
    w, h = sheet.width // 2, sheet.height // 2
    notes = []
    for row, body in enumerate("mf"):
        a = key(sheet.crop((0, row * h, w, row * h + h)))
        b = key(sheet.crop((w, row * h, 2 * w, row * h + h)))
        if touches_edge(a) or touches_edge(b):
            notes.append(body + " touches panel edge")
        dx, dy = offset(a, b)
        b = moved(b, dx, dy)
        al = (a[..., 3] > 40) | (b[..., 3] > 40)
        ys, xs = np.nonzero(al)
        pad = 10
        box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(w, xs.max() + pad), min(h, ys.max() + pad))
        bw, bh = box[2] - box[0], box[3] - box[1]
        scale = SIZE / max(bw, bh)
        for phase, arr in (("a", a), ("b", b)):
            im = Image.fromarray(arr.round().astype("uint8"), "RGBA").crop(box)
            im = im.resize((round(bw * scale), round(bh * scale)), Image.LANCZOS)
            tile = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
            tile.alpha_composite(im, ((SIZE - im.width) // 2, SIZE - im.height))
            tile.save(os.path.join(OUT, f"ex_{ex}_{body}_{phase}.webp"), "WEBP", quality=86, alpha_quality=90, method=6)
    print(ex, "ok" if not notes else "; ".join(notes))
