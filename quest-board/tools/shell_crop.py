"""Crop a wide room's guide tight, so the generator has no empty space above the walls to fill with taller walls, and put
the painting back into the game's 5:4 frame afterwards.

  shell_crop.py cut <guide.png> <out.jpg> <aspect>       e.g. aspect 16:9; prints the box it used
  shell_crop.py back <guide.png> <painting.png> <aspect> <out.png>

cut: the room's bounding box (everything not flat green), grown to the aspect with green around it, saved for upload.
back: the painting scaled to that box and pasted into a green frame the size of the guide, ready for shell_sheet.py and
for saving as the shell. The same guide and aspect must be given to both.
"""
import sys

import numpy as np
from PIL import Image


def box(guide, aspect):
    g = np.asarray(Image.open(guide).convert("RGB")).astype(int)
    room = ~((g[..., 1] > 200) & (g[..., 0] < 60) & (g[..., 2] < 60))
    ys, xs = np.where(room)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    pad = round(0.02 * (x1 - x0))
    x0, x1, y0, y1 = x0 - pad, x1 + pad, y0 - pad, y1 + pad
    a, b = (float(v) for v in aspect.split(":"))
    w, h = x1 - x0, y1 - y0
    if w / h > a / b:
        nh = round(w * b / a)
        y0 -= (nh - h) // 2
        y1 = y0 + nh
    else:
        nw = round(h * a / b)
        x0 -= (nw - w) // 2
        x1 = x0 + nw
    return x0, y0, x1, y1


def main():
    mode, guide = sys.argv[1], sys.argv[2]
    G = Image.open(guide).convert("RGB")
    if mode == "cut":
        out, aspect = sys.argv[3], sys.argv[4]
        b = box(guide, aspect)
        canvas = Image.new("RGB", (b[2] - b[0], b[3] - b[1]), (0, 255, 0))
        canvas.paste(G.crop((max(0, b[0]), max(0, b[1]), min(G.width, b[2]), min(G.height, b[3]))), (max(0, -b[0]), max(0, -b[1])))
        canvas.save(out, quality=90)
        print(out, canvas.size, "box", b)
    else:
        painting, aspect, out = sys.argv[3], sys.argv[4], sys.argv[5]
        b = box(guide, aspect)
        P = Image.open(painting).convert("RGB").resize((b[2] - b[0], b[3] - b[1]), Image.LANCZOS)
        frame = Image.new("RGB", G.size, (0, 255, 0))
        frame.paste(P, (b[0], b[1]))
        frame.save(out)
        print(out, frame.size, "box", b)


if __name__ == "__main__":
    main()
