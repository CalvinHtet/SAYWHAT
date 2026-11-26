"""Seasonal building backdrop from a Higgsfield 16:9 edit of bld_bg_<id>.webp (ROOMS 2026-11-25; LEAD 73160da0, 29zz_v175.js).

  season_cut.py <source.png> <id> <season>     -> art/app/bld_bg_<id>_<season>.webp

Same size as the summer painting (1600 x 900) so the rooms line up; the source is cropped to that aspect around its centre.
"""
import os
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
APP = os.path.join(ROOT, "art", "app")


def main():
    src, bid, season = sys.argv[1:4]
    base = Image.open(os.path.join(APP, "bld_bg_%s.webp" % bid))
    W, H = base.size
    im = Image.open(src).convert("RGB")
    w, h = im.size
    if w * H > h * W:
        nw = h * W // H
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = w * H // W
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((W, H), Image.LANCZOS)
    out = os.path.join(APP, "bld_bg_%s_%s.webp" % (bid, season))
    for q in (86, 82, 78, 74):
        im.save(out, "WEBP", quality=q, method=6)
        if os.path.getsize(out) <= 200 * 1024:
            break
    print(out, im.size, os.path.getsize(out) // 1024, "KB q", q)


if __name__ == "__main__":
    main()
