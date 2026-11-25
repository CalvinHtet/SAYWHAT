"""The Shop home's door pictures (ROOMS 2026-11-25; LEAD's 29zz_v159.js).

  shop_doors.py <sheet.png>                 a 2x2 Higgsfield sheet -> ui_shop_street, _stylist, _iface, _pets (800 x 800)
  shop_doors.py --vault <strip.png>          a wide picture -> ui_shop_vault (4:1, 1200 x 300)

One sheet holds all four doors so they share one style and light. Each quarter is trimmed of the dark gap between panels
(rows/columns much darker than the panel), cropped square around its centre and saved under about 120 KB.
"""
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
APP = os.path.join(ROOT, "art", "app")
IDS = [["street", "stylist"], ["iface", "pets"]]


def save(im, name, limit=120):
    p = os.path.join(APP, "ui_shop_%s.webp" % name)
    for q in (88, 84, 80, 76, 72, 68):
        im.save(p, "WEBP", quality=q, method=6)
        if os.path.getsize(p) <= limit * 1024:
            break
    print(p, im.size, os.path.getsize(p) // 1024, "KB q", q)


def trim(panel):
    """drop the dark gap rows/columns at the panel's edges"""
    a = np.asarray(panel.convert("L")).astype(float)
    med = np.median(a)
    rows, cols = a.mean(1), a.mean(0)
    def run(v, rev):
        idx = range(len(v) - 1, -1, -1) if rev else range(len(v))
        n = 0
        for i in idx:
            if v[i] < min(25, med * 0.35):
                n += 1
            else:
                break
        return n
    t, b, l, r = run(rows, False), run(rows, True), run(cols, False), run(cols, True)
    return panel.crop((l, t, panel.width - r, panel.height - b))


def main():
    a = sys.argv[1:]
    if a[0] == "--vault":
        im = Image.open(a[1]).convert("RGB")
        w, h = im.size
        nh = w // 4
        y = (h - nh) // 2
        save(im.crop((0, y, w, y + nh)).resize((1200, 300), Image.LANCZOS), "vault", 80)
        return
    im = Image.open(a[0]).convert("RGB")
    W, H = im.size
    for r in range(2):
        for c in range(2):
            p = trim(im.crop((c * W // 2, r * H // 2, (c + 1) * W // 2, (r + 1) * H // 2)))
            s = min(p.size)
            x, y = (p.width - s) // 2, (p.height - s) // 2
            save(p.crop((x, y, x + s, y + s)).resize((800, 800), Image.LANCZOS), IDS[r][c])


if __name__ == "__main__":
    main()
