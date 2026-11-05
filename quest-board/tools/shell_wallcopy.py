"""Repaint part of a painted shell's left wall with the same painting's back-right wall (paint, skirting, trim and all).

  shell_wallcopy.py <in.png> <W> <D> <H> <y_from> <y_to> <shade> <out.png>

The left wall from y_from to y_to (tiles along it) is replaced by the back-right wall at the same distance from the
corner (x = y, same height), times <shade> (left walls sit in shadow; 0.9 is usual). Used when a generated shell got a
feature across a whole wall and only part of it should keep it, so the rest matches the room exactly.
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from shell_guide import frame  # noqa: E402


def main():
    src, W, D, H, y0, y1, shade, out = sys.argv[1:9]
    W, D, H, y0, y1, shade = map(float, (W, D, H, y0, y1, shade))
    left, top, fw, fh = frame(W, D)
    im = np.asarray(Image.open(src).convert("RGB")).astype(float)
    h, w = im.shape[:2]
    sx, sy = w / fw, h / fh
    py, px = np.mgrid[0:h, 0:w].astype(float)
    gx = px / sx + left
    gy = py / sy + top
    ly = -gx / 26
    lz = ly * 13 - gy
    sel = (ly >= y0) & (ly <= y1) & (lz >= -2) & (lz <= H + 1)
    # same spot on the back-right wall: x = ly, z = lz
    rgx = ly * 26
    rgy = ly * 13 - lz
    qx = np.clip(((rgx - left) * sx).round().astype(int), 0, w - 1)
    qy = np.clip(((rgy - top) * sy).round().astype(int), 0, h - 1)
    copy = im[qy, qx] * shade
    m = ndi.gaussian_filter(sel.astype(float), 1.2)[..., None]
    res = im * (1 - m) + copy * m
    Image.fromarray(res.clip(0, 255).astype(np.uint8)).save(out)
    print(out, (w, h))


if __name__ == "__main__":
    main()
