"""Strip a baked-in mannequin out of an item layer that was ingested with it.

  strip_mannequin.py [--lens | --garment] <art/app/file.webp> [...]

A few small pieces (a chain, a lanyard, sunglasses) came out of the generator with the
whole template body still drawn in: its outline, its dark edge shading and magenta key
colour where the body fill should have been. The rig then draws that outline and a purple
cape on whoever wears the item. This keeps only the item itself:

  1. seeds are the pixels the template never has: anything that is not near-black outline,
     not dark edge shading and not magenta,
  2. small specks of seed are dropped,
  3. the item is the seeds grown by a few pixels with holes filled, so the item's own
     outline and dark lenses inside a frame survive,
  4. magenta is removed everywhere and its spill neutralised on the rim.

Works on the runtime .webp in place (the layered sources are not in this repo). Prints
what it kept so a bad result is easy to spot. Always look at the result in the rig.
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def silhouette_edge(path):
    """Distance to the edge of the template body this layer was painted on."""
    name = path.replace("\\", "/").rsplit("/", 1)[-1]
    body_id, view = name[0], name.rsplit("_", 1)[-1].split(".")[0]
    sil = Image.open(f"{ROOT}/art/sil/{body_id}_{view}.png").convert("RGB")
    im = np.asarray(sil.resize((sil.width // 2, sil.height // 2), Image.NEAREST)).astype(float)
    body = (im[..., 0] > 128) & (im[..., 1] < 128)
    return ndi.distance_transform_edt(~(body ^ ndi.binary_erosion(body)))


def strip(path, grow=3, speck=40, lens=False, garment=False):
    im = np.asarray(Image.open(path).convert("RGBA")).astype(float)
    rgb, a = im[..., :3], im[..., 3] / 255
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx, mn = rgb.max(-1), rgb.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1)
    magenta = (np.minimum(r, b) - g > 25) & (r > 70) & (b > 60)
    # The template's edge shading is a dark warm brown, never a real colour on these items.
    brown = (mx < 120) & (r > b + 12) & (sat > 0.25)
    if garment:
        # A whole garment (a corset) painted over the template's ink outline. A wide opening
        # keeps the garment and its straps and drops every template line. Small pieces hanging
        # off its middle (lacing, bow tails) come back; long template lines do not.
        core = ndi.binary_opening(a > 0.5, iterations=8)
        lab, n = ndi.label(core)
        if n:
            core = lab == 1 + int(np.argmax(ndi.sum(core, lab, range(1, n + 1))))
        keep = ndi.binary_fill_holes(ndi.binary_dilation(core, iterations=5))
        xs = np.nonzero(core)[1]
        mid0, mid1 = np.percentile(xs, 30), np.percentile(xs, 70)
        rest = (a > 0.3) & ~keep
        lab, n = ndi.label(rest)
        touch = ndi.binary_dilation(keep, iterations=2)
        for i, sl in enumerate(ndi.find_objects(lab)):
            piece = lab[sl] == i + 1
            h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
            cx = (sl[1].start + sl[1].stop) / 2
            if h < 130 and w < 90 and mid0 <= cx <= mid1 and (touch[sl] & piece).any():
                keep[sl] |= piece
    elif lens:
        # Glasses: the frames are the same black ink as the template, so cut the ink that
        # runs along the template body's edge, then keep whatever still touches the lenses.
        rim_ink = (mx < 95) & (silhouette_edge(path) <= 5)
        cand = (a > 0.5) & ~magenta & ~brown & ~rim_ink
        seed = ndi.binary_opening(cand & (mx >= 45), iterations=1)
        lab, n = ndi.label(cand)
        hits = ndi.sum(seed, lab, range(1, n + 1)) if n else []
        # The glasses are one big piece; anything far smaller is the template's own highlights.
        big = max(hits) if n else 0
        keep = ndi.binary_fill_holes(np.isin(lab, [i + 1 for i, h in enumerate(hits) if h >= max(speck, big * 0.1)]))
        # Glasses lie in one band across the face. Ink that runs up or down out of it is template.
        rows = np.nonzero(seed & keep)[0]
        if len(rows):
            band = np.zeros_like(keep)
            band[max(0, int(np.percentile(rows, 2)) - 20):int(np.percentile(rows, 98)) + 20] = True
            keep &= band
        keep &= ~brown
    else:
        seed = (a > 0.5) & ~magenta & (mx >= 95) & ~brown
        # Anti-aliased fringes of the template's ink are thin lines; real art is thicker.
        seed = ndi.binary_opening(seed, iterations=1)
        lab, n = ndi.label(seed)
        if n:
            size = ndi.sum(seed, lab, range(1, n + 1))
            seed = np.isin(lab, [i + 1 for i, s in enumerate(size) if s >= speck])
        keep = ndi.binary_fill_holes(ndi.binary_dilation(seed, iterations=grow))
    keep &= ~magenta
    alpha = a * keep
    # Neutralise any magenta tint left on anti-aliased edges.
    spill = np.clip(np.minimum(r, b) - g, 0, None)
    near = ndi.distance_transform_edt(keep) <= 3
    out = rgb.copy()
    out[..., 0] = np.where(near, r - spill, r)
    out[..., 2] = np.where(near, b - spill, b)
    rgba = np.dstack([out, alpha * 255]).clip(0, 255).astype("uint8")
    Image.fromarray(rgba, "RGBA").save(path, "WEBP", quality=92, method=6, alpha_quality=95)
    ys, xs = np.nonzero(alpha > 0.5)
    print(path, "kept %d px" % len(xs), "bbox", (xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) else None)


if __name__ == "__main__":
    # --lens for glasses: their dark lenses must survive.
    lens = "--lens" in sys.argv
    garment = "--garment" in sys.argv
    for p in sys.argv[1:]:
        if not p.startswith("--"):
            strip(p, lens=lens, garment=garment)
