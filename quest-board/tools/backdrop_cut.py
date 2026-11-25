"""Player-card backdrop from a Higgsfield 3:4 picture (ROOMS 2026-11-24).

  backdrop_cut.py <source.png> <id> [--y <0..1>] [--w 1200]

Writes art/app/bl_pc_<id>.webp, 900 x 1200 (--w 1200: 1200 x 1600, the tier-2 size Cal asked for 11-25) (LEAD's player card, 29zz_v152.js: background-size cover, the character's feet
17% up from the bottom, a dark name plate over the bottom 17%). The source is cropped to exactly 3:4 around its centre
(--y moves the crop up or down when the source is taller than 3:4: 0 = keep the top, 1 = keep the bottom, default 0.5).
"""
import os
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
APP = os.path.join(ROOT, "art", "app")


def main():
    a = sys.argv[1:]
    src, pid = a[0], a[1]
    fy = float(a[a.index("--y") + 1]) if "--y" in a else 0.5
    W = int(a[a.index("--w") + 1]) if "--w" in a else 900
    im = Image.open(src).convert("RGB")
    w, h = im.size
    if w * 4 > h * 3:  # too wide: crop the sides
        nw = h * 3 // 4
        x = (w - nw) // 2
        im = im.crop((x, 0, x + nw, h))
    else:  # too tall: crop top/bottom
        nh = w * 4 // 3
        y = int((h - nh) * fy)
        im = im.crop((0, y, w, y + nh))
    im = im.resize((W, W * 4 // 3), Image.LANCZOS)
    out = os.path.join(APP, "bl_pc_%s.webp" % pid)
    im.save(out, "WEBP", quality=86, method=6)
    print(out, os.path.getsize(out) // 1024, "KB")


if __name__ == "__main__":
    main()
