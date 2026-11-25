"""Boutique brand portrait background from a Higgsfield 9:16 picture (ROOMS 2026-11-25; LEAD ea71679e, Cal: "high resolution").

  portrait_cut.py <source.png> <brand id>

Writes art/app/ui_banner_<id>_p.webp at the source's own size (Unlimited 2K 9:16 = 1536 x 2752), cropped to exactly 9:16
around the centre, never upscaled: the page uses background-size: cover, so a phone trims the sides itself (LEAD: keep it
uncropped so wider screens still fit). Quality steps down until the file is under about 480 KB.
"""
import os
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
APP = os.path.join(ROOT, "art", "app")
LIMIT = 480 * 1024


def main():
    src, bid = sys.argv[1], sys.argv[2]
    im = Image.open(src).convert("RGB")
    w, h = im.size
    if w * 16 > h * 9:  # too wide
        nw = h * 9 // 16
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = w * 16 // 9
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    out = os.path.join(APP, "ui_banner_%s_p.webp" % bid)
    for q in (88, 84, 80, 76, 72, 68, 64):
        im.save(out, "WEBP", quality=q, method=6)
        if os.path.getsize(out) <= LIMIT:
            break
    print(out, im.size, os.path.getsize(out) // 1024, "KB q", q)


if __name__ == "__main__":
    main()
