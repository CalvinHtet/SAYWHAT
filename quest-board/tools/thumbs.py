#!/usr/bin/env python3
"""Banner thumbnails for the Shop's grid (LEAD 2026-11-25; Cal: "it freezes for a few seconds" going into the banner shop).

The grid of small banners loaded every full painting (1200 x 1600, about 150 MB once decoded for twenty), which froze a phone for
seconds. For each art/app/bl_pc_<id>.webp this writes bl_pc_<id>_t.webp at 360 x 480 (quality 78) when it is missing or older than the
painting. The game uses the thumbnail in the grid when it exists (29zz_v152.js pcThumb) and the full painting everywhere else.
Run it after adding or changing a banner:  python3 quest-board/tools/thumbs.py   (needs cwebp, brew install webp)."""
import glob, os, subprocess, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "art", "app")
n = 0
for src in sorted(glob.glob(os.path.join(ROOT, "bl_pc_*.webp"))):
    if src.endswith("_t.webp"):
        continue
    out = src[:-5] + "_t.webp"
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
        continue
    subprocess.run(["cwebp", "-quiet", "-q", "78", "-resize", "360", "480", src, "-o", out], check=True)
    n += 1
print("thumbnails written:", n)
