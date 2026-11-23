"""Stylist icon for a hairstyle, from its cleaned runtime art (ROOMS 2026-11-23).

  hair_icon.py <body> <style id> [...]      e.g. hair_icon.py m h4 m h5 f h4

items.py makes icon_basic_<b>_<id> from art/layers, but a new style's layer can still hold the template body's outline
(strip_mannequin.py cleans the runtime .webp, not the layer). This makes the same icon, the same brown ramp, crop and size
as items.py, from art/app/<b>_<id>_front.webp, so the icon shows only the hair.
"""
import json
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
APP = os.path.join(ROOT, "art", "app")
ICON = 320


def smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def tinted(path, ramp):
    im = np.asarray(Image.open(path).convert("RGBA")).astype(float) / 255
    rgb, al = im[..., :3], im[..., 3:]
    l = (rgb @ [0.299, 0.587, 0.114])[..., None]
    A, B, C = (np.array(ramp[k]) for k in "abc")
    low = A + (B - A) * smooth(0.14, 0.5, l)
    high = B + (C - B) * smooth(0.5, 0.9, l)
    r = np.where(l < 0.5, low, high)
    out = rgb + (r - rgb) * smooth(0.05, 0.16, l)
    return Image.fromarray((np.dstack([np.clip(out, 0, 1), al]) * 255).round().astype("uint8"), "RGBA")


def save_icon(im, name):
    ys, xs = np.nonzero(np.asarray(im)[..., 3] > 40)
    pad = 12  # runtime art is half the layer size: half of items.py's 24
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.width, xs.max() + pad), min(im.height, ys.max() + pad))
    crop = im.crop(box)
    crop.thumbnail((ICON, ICON), Image.LANCZOS)
    tile = Image.new("RGBA", (ICON, ICON), (0, 0, 0, 0))
    tile.alpha_composite(crop, ((ICON - crop.width) // 2, (ICON - crop.height) // 2))
    tile.save(os.path.join(APP, "icon_%s.webp" % name), "WEBP", quality=90, alpha_quality=92, method=6)
    print("icon_%s.webp" % name, crop.size)


def main():
    creator = json.load(open(os.path.join(ROOT, "data", "creator.json")))
    brown = next(c for c in creator["hairColors"] if c["id"] == "brown")
    a = sys.argv[1:]
    for b, sid in zip(a[::2], a[1::2]):
        save_icon(tinted(os.path.join(APP, "%s_%s_front.webp" % (b, sid)), brown), "basic_%s_%s" % (b, sid))


if __name__ == "__main__":
    main()
