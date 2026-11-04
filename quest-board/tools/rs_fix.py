"""Clean green glow left on sprites: on new ones in art/app, and on old ones inside app/blobs.js.

  rs_fix.py art <name> ...     fixes art/app/<name>.webp in place
  rs_fix.py old <key> ...      writes art/app/fix_<key>.webp, which replaces that old sprite
"""
import base64
import io
import json
import os
import re
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "art", "app")
INDEX = os.path.join(ROOT, "data", "rsart.json")


def warm(im):
    """Neon green becomes warm lamp light. Dark leaves stay as they are."""
    a = np.array(im.convert("RGBA")).astype(float)
    r, g, b, al = [a[..., i] for i in range(4)]
    lime = (g > r + 10) & (g > b + 30) & (g > 140)
    soft = (al < 250) & (g > np.maximum(r, b))
    m = lime | soft
    k = np.maximum(g, r)
    a[..., 0] = np.where(m, k, r)
    a[..., 1] = np.where(m, k * 0.86, g)
    a[..., 2] = np.where(m, np.minimum(b, k * 0.55), b)
    a[..., 3] = np.where(lime & (al < 255), al * 0.8, al)
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))


def islands(im):
    """Drop scraps of neighbouring sprites that got caught in an old crop."""
    a = np.array(im)
    lab, n = ndimage.label(a[..., 3] > 40)
    if n < 2:
        return im
    sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
    big = sizes.max()
    keep = [i + 1 for i, s in enumerate(sizes) if s > big * 0.015]
    a[..., 3] = a[..., 3] * ndimage.binary_dilation(np.isin(lab, keep), iterations=2)
    return Image.fromarray(a)


def old_sprites():
    code = open(os.path.join(ROOT, "app", "src", "30_app_b.js"), encoding="utf-8").read()
    m = re.search(r"var LFSPR=window\.LFSPR=(\{.*?\});?/\*SPRDATA-END", code, re.S)
    blob = open(os.path.join(ROOT, "app", "blobs.js"), encoding="utf-8").read()
    return code, blob


def load_old(key):
    code, blob = old_sprites()
    i = re.search(r'"%s":\{"w":\d+,"h":\d+,"u":__B\[(\d+)\]' % re.escape(key), code)
    n = int(i.group(1))
    items = re.findall(r'"(data:image/[^"]+)"', blob)
    return Image.open(io.BytesIO(base64.b64decode(items[n].split(",")[1]))).convert("RGBA")


def main(mode, names):
    index = json.load(open(INDEX))
    for name in names:
        if mode == "art":
            p = os.path.join(ART, name + ".webp")
            warm(Image.open(p)).save(p, quality=90, method=6)
        else:
            im = islands(warm(load_old(name)))
            box = im.getchannel("A").getbbox()
            im = im.crop(box)
            out = "fix_" + name
            im.save(os.path.join(ART, out + ".webp"), quality=90, method=6)
            index[out] = {"w": im.width, "h": im.height}
        print(name, "ok")
    json.dump(index, open(INDEX, "w"), indent=0, sort_keys=True)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
