"""Art pipeline: turn raw generator output into clean transparent layers.

  art.py base <raw.png> <out.png> <silhouette.png>   key green, write silhouette
  art.py layer <raw.png> <out.png> [silhouette.png]   key green AND magenta
  art.py check <raw.png> <silhouette.png> [limit]     exit 3 if art strays off the body
  art.py preview <out.png> <a.png> [b.png ...]        side-by-side check sheet

Every layer keeps the raw canvas size so all layers of a view stay registered.
Set QB_FINE=1 when processing faces. QB_MINFRAC raises the size below which loose
shapes are dropped, relative to the largest shape; use 0.06 for hair.
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

GREEN = np.array([0, 255, 0], float)
MAGENTA = np.array([255, 0, 255], float)


def key_score(rgb, kind):
    """0 = pure art, 1 = pure key colour."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    if kind == "green":
        d = g - np.maximum(r, b)
    else:
        # Only near-pure magenta is background: pink clothes must survive.
        d = np.minimum(r, b) - g
        return np.clip((d - 120) / 70, 0, 1)
    return np.clip((d - 40) / 90, 0, 1)


def clean_alpha(alpha, min_area, erode, fine=False):
    """Drop specks and pull the edge in so no key colour survives on the rim."""
    solid = alpha > 0.5
    labels, n = ndi.label(solid)
    if n:
        sizes = ndi.sum(solid, labels, range(1, n + 1))
        floor = min_area if fine else max(min_area, sizes.max() * float(os.environ.get("QB_MINFRAC", "0.03")))
        solid = np.isin(labels, [i + 1 for i, s in enumerate(sizes) if s >= floor])
    solid = ndi.binary_fill_holes(solid) if erode < 0 else solid
    if erode > 0:
        solid = ndi.binary_erosion(solid, iterations=erode)
    # Soft 1px edge from the eroded solid mask.
    return np.clip(ndi.gaussian_filter(solid.astype(float), 0.8), 0, 1) * (alpha > 0.02)


def despill(rgb):
    """Neutralise green and magenta contamination left in edge pixels."""
    out = rgb.copy()
    r, g, b = out[..., 0], out[..., 1], out[..., 2]
    out[..., 1] = np.minimum(g, np.maximum(r, b))
    mag = np.minimum(r, b) - g
    spill = np.clip(mag, 0, None)
    out[..., 0] = r - spill
    out[..., 2] = b - spill
    return out


def key(path, kinds, erode=2, min_area=400, fine=False):
    rgb = np.asarray(Image.open(path).convert("RGB"), float)
    score = np.zeros(rgb.shape[:2])
    for k in kinds:
        score = np.maximum(score, key_score(rgb, k))
    alpha = clean_alpha(1 - score, min_area, erode, fine)
    return rgb, alpha


def save(rgb, alpha, path):
    # Key colour only ever contaminates the rim. Inside, pinks and greens are real art.
    near_edge = ndi.distance_transform_edt(alpha > 0.5) <= 7
    # QB_NEUTRAL: dark lenses can pick up the template's magenta all the way through.
    clean = despill(rgb) if os.environ.get("QB_NEUTRAL") == "1" else np.where(near_edge[..., None], despill(rgb), rgb)
    rgba = np.dstack([clean, alpha * 255]).clip(0, 255).astype("uint8")
    Image.fromarray(rgba, "RGBA").save(path)
    ys, xs = np.nonzero(alpha > 0.5)
    box = (xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) else None
    print(path.rsplit("/", 1)[-1], "coverage %.1f%%" % (100 * (alpha > 0.5).mean()), "bbox", box)


def cmd_base(raw, out, sil):
    rgb, alpha = key(raw, ["green"])
    save(rgb, alpha, out)
    solid = ndi.binary_fill_holes(alpha > 0.5)
    canvas = np.zeros(rgb.shape, "uint8")
    canvas[..., 1] = 255
    canvas[solid] = (255, 0, 255)
    Image.fromarray(canvas).save(sil)


def drop_edge_ghosts(alpha, sil, reach=16):
    """Remove stray lines that only trace the silhouette's edge, not real art."""
    body = key_score(np.asarray(Image.open(sil).convert("RGB"), float), "green") < 0.5
    rim = ndi.binary_dilation(body, iterations=reach) & ~ndi.binary_erosion(body, iterations=reach)
    labels, n = ndi.label(alpha > 0.1)
    if not n:
        return alpha
    ids = list(range(1, n + 1))
    size = ndi.sum(alpha > 0.1, labels, ids)
    on_rim = ndi.sum(rim & (alpha > 0.1), labels, ids)
    ghosts = [i for i, s, r in zip(ids, size, on_rim) if r / s > 0.8]
    return alpha * ~np.isin(labels, ghosts)


def biggest_only(alpha, frac):
    labels, n = ndi.label(alpha > 0.3)
    if not n:
        return alpha
    ids = list(range(1, n + 1))
    sizes = ndi.sum(alpha > 0.3, labels, ids)
    return alpha * np.isin(labels, [i for i, s in zip(ids, sizes) if s >= sizes.max() * frac])


def cmd_layer(raw, out, sil=None):
    # Faces are made of small marks (a smile, a nose dot), so keep small shapes.
    fine = os.environ.get("QB_FINE") == "1"
    rgb, alpha = key(raw, ["green", "magenta"], erode=1 if fine else 2, min_area=60 if fine else 400, fine=fine)
    # Shop items: hairline strays and crumbs go. Real edges and chain links are thicker.
    if os.environ.get("QB_ITEM") == "1":
        solid = alpha > 0.5
        core = ndi.binary_dilation(ndi.binary_opening(solid, iterations=3), iterations=5) & solid
        alpha = biggest_only(alpha * ndi.binary_dilation(core, iterations=1), 0.04)
    save(rgb, drop_edge_ghosts(alpha, sil) if sil else alpha, out)


def cmd_check(raw, sil, limit="0.02", margin=140):
    """Reject a generation that drew outside the body it was asked to trace.
    Hair is meant to extend past the body, so it passes a looser limit."""
    limit = float(limit)
    rgb = np.asarray(Image.open(raw).convert("RGB"), float)
    drawn = key_score(rgb, "green") < 0.5
    body = np.asarray(Image.open(sil).convert("RGB"), float)
    allowed = ndi.binary_dilation(key_score(body, "green") < 0.5, iterations=margin)
    stray = (drawn & ~allowed).sum() / max(1, drawn.sum())
    print("stray %.2f%%" % (100 * stray), "REJECT" if stray > limit else "ok")
    if stray > limit:
        sys.exit(3)


def cmd_preview(out, paths):
    H = 520
    ims = []
    for p in paths:
        im = Image.open(p).convert("RGBA")
        ims.append(im.resize((im.width * H // im.height, H), Image.LANCZOS))
    sheet = Image.new("RGBA", (sum(i.width for i in ims), H), (120, 120, 135, 255))
    x = 0
    for i in ims:
        sheet.alpha_composite(i, (x, 0))
        x += i.width
    sheet.convert("RGB").save(out)


if __name__ == "__main__":
    c = sys.argv[1]
    if c == "base":
        cmd_base(*sys.argv[2:5])
    elif c == "layer":
        cmd_layer(*sys.argv[2:5])
    elif c == "check":
        cmd_check(*sys.argv[2:5])
    elif c == "preview":
        cmd_preview(sys.argv[2], sys.argv[3:])
