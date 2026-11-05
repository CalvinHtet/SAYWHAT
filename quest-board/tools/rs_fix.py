"""Clean green glow left on sprites: on new ones in art/app, and on old ones inside app/blobs.js.

  rs_fix.py art <name> ...     fixes art/app/<name>.webp in place
  rs_fix.py old <key> ...      writes art/app/fix_<key>.webp, which replaces that old sprite
  rs_fix.py green <name> ...   removes leftover flat green (a patch left under an object)
  rs_fix.py edge <name> ...    neutralises a green line round the outside of a sprite; edge-all does every room sprite
  rs_fix.py halo <name> ...    removes a warm glow disc around a lamp, working in from the outside
  rs_fix.py cool <name> ...    turns neon green into cyan
  rs_fix.py rim <name> ...     trims a few pixels off the edge of a cutout
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


def drop_green(name):
    """Bright green that survived keying is background, not paint. Clear it and soften the edge."""
    path = os.path.join(ART, name + ".webp")
    a = np.array(Image.open(path).convert("RGBA")).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    hit = (g > r * 1.3 + 6) & (g > b * 1.3 + 6) & (g > 60)
    hit = ndimage.binary_dilation(hit, iterations=1)
    a[..., 3][hit] = 0
    Image.fromarray(a.astype(np.uint8)).save(path, "WEBP", quality=90, method=6)
    print(name, "green cleared", int(hit.sum()))


def load(name):
    path = os.path.join(ART, name + ".webp")
    return path, np.array(Image.open(path).convert("RGBA")).astype(float)


def save(path, a):
    Image.fromarray(a.clip(0, 255).astype(np.uint8)).save(path, "WEBP", quality=90, method=6)


def halo(name):
    """A glow is bright, warm and soft, and it touches the outside. Dark outlines stop the flood, so the lamp itself stays."""
    path, a = load(name)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    glow = (r > 150) & (g > 110) & (b < r - 25) & (al > 0)
    lab, _ = ndimage.label(glow | (al < 8))
    out = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1], lab[al < 8]]))
    hit = np.isin(lab, out[out > 0]) & glow
    a[..., 3][hit] = 0
    save(path, a)
    print(name, "halo cleared", int(hit.sum()))


def cool(name):
    path, a = load(name)
    r, g, b = a[..., 0].copy(), a[..., 1].copy(), a[..., 2].copy()
    hit = (g > r * 1.15) & (g > b * 1.05) & (g > 70)
    a[..., 0][hit] = r[hit] * .5
    a[..., 1][hit] = g[hit] * .92
    a[..., 2][hit] = g[hit]
    save(path, a)
    print(name, "cooled", int(hit.sum()))


def rim(name):
    path, a = load(name)
    a[..., 3] = np.minimum(a[..., 3], ndimage.binary_erosion(a[..., 3] > 60, iterations=5) * 255.0)
    save(path, a)
    print(name, "rim trimmed")


def edge(name, report=True):
    """Green screen left a bright green line round the outside of most sprites, invisible at room size but plain when
    zoomed in. Pull green back to grey in the outer 3px band only; in art that is green inside, like plants, only lime
    green (the key colour), so leaves keep theirs. The outline goes neutral and nothing inside changes. Returns the number of pixels changed."""
    path, a = load(name)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    vis = al > 8
    inner = ndimage.binary_erosion(vis, iterations=6)
    bright = (g > 110) & (g > r + 45) & (g > b + 30)
    green_inside = (inner & bright).sum() / max(inner.sum(), 1) > 0.02
    band = vis & ~ndimage.binary_erosion(vis, iterations=3)
    spill = band & (g > np.maximum(r, b) + 12)
    if green_inside:
        # key spill is lime (red under .45 of green); leaves in this art are olive to grass, red .5 to .8 of green
        spill &= (r < 0.45 * g) & (g > 100)
        # and pure lime anywhere: it glows between leaves too, and no leaf is that colour
        spill |= vis & (r < 0.3 * g) & (b < 0.6 * g) & (g > 110)
    a[..., 1][spill] = np.maximum(r, b)[spill] + 4
    save(path, a)
    if report:
        print(name, "edge despilled", int(spill.sum()), "(green inside)" if green_inside else "")
    return int(spill.sum())


if __name__ == "__main__" and sys.argv[1] == "edge-all":
    # every room sprite listed in data/rsart.json
    names = [n for n in json.load(open(INDEX)) if os.path.exists(os.path.join(ART, n + ".webp"))]
    total = sum(edge(n, report=False) for n in names)
    print(len(names), "sprites,", total, "edge pixels despilled")
    sys.exit(0)

if __name__ == "__main__" and sys.argv[1] in ("halo", "cool", "rim", "edge"):
    for n in sys.argv[2:]:
        {"halo": halo, "cool": cool, "rim": rim, "edge": edge}[sys.argv[1]](n)
    sys.exit()
if __name__ == "__main__" and sys.argv[1] == "green":
    for n in sys.argv[2:]:
        drop_green(n)
    sys.exit()
if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
