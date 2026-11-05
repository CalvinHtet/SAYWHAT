"""Make a painted wall shell in each of a room's Room style colours, so painted walls keep the colour options.

  shell_styles.py <painting.png> <W> <D> <H> <tex_dir> <out_prefix> <paint walls: L,R | L:3-9,R | ...> <styles.json> [tol]

The painting is a wall-and-floor shell in the frame of tools/shell_guide.py (5:4, any size, stretched to the frame like the
game does). Every pixel is mapped back to the room: floor (x, y), the left wall (y, z) or the back-right wall (x, z).

<paint walls> names the walls whose painted surface is plain paint (a slat or panel wall is left alone). On those walls,
the pixels close in colour to the wall's own paint are the paint; a style repaints them in its colour and keeps the
painting's light and shade (the colour scaled by each pixel's brightness against the wall's median).

styles.json is a list of {"id", "wc", "wcr", "fl", "acc"} like LFDS in 20_loft.js:
  wc / wcr  left / right paint colour (no wc: keep the painted colours)
  fl        floor: "keep", a texture name (f_<fl>.jpg in tex_dir, laid like the game lays it, under the painting's light), or
            "tone:<name>" (the painted planks recoloured to the texture's colours)
  acc       {"w": "L"|"R", "a", "b", "c": colour | "tex": name}: a band of the wall from a to b in another colour or texture
Writes <out_prefix>_<id>.webp at 2x game size (no _<id> for the style named "mid", which is the painting itself).
"""
import json
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from shell_guide import frame  # noqa: E402

SX, SY, OUTK = 26, 13, 2


def hexrgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float)


def lum(a):
    return a[..., 0] * .299 + a[..., 1] * .587 + a[..., 2] * .114


def tile(tex, u, v, tw, th):
    """Sample a texture laid like lfPat: tw x th units per image, mirrored tiling."""
    t = np.asarray(tex.convert("RGB")).astype(float)
    h, w = t.shape[:2]
    fu = np.mod(u / tw, 2.0)
    fv = np.mod(v / th, 2.0)
    fu = np.where(fu > 1, 2 - fu, fu)
    fv = np.where(fv > 1, 2 - fv, fv)
    return t[np.clip((fv * (h - 1)).astype(int), 0, h - 1), np.clip((fu * (w - 1)).astype(int), 0, w - 1)]


def main():
    src, W, D, H, tex_dir, out_prefix, paint, styles = sys.argv[1:9]
    # optional 9th: how far (RGB distance) a paint pixel's brightness may stray from the wall's median; raise it for
    # walls washed by strong light (a cove strip), keep it low where trim and paint are close in colour
    tol = float(sys.argv[9]) if len(sys.argv) > 9 else 70
    W, D, H = float(W), float(D), float(H)
    # "L,R" or with a range along the wall where the plain paint is: "L:4.5-9,R"
    rng = {}
    for p in paint.split(","):
        k, _, r = p.partition(":")
        rng[k] = tuple(map(float, r.split("-"))) if r else None
    paint = list(rng)
    styles = json.load(open(styles))
    left, top, fw, fh = frame(W, D)
    ow, oh = round(fw * OUTK), round(fh * OUTK)
    img = np.asarray(Image.open(src).convert("RGB").resize((ow, oh), Image.LANCZOS)).astype(float)
    gy, gx = np.mgrid[0:oh, 0:ow].astype(float)
    gx = gx / OUTK + left
    gy = gy / OUTK + top
    # floor
    fx = (gx / SX + gy / SY) / 2
    fy = (gy / SY - gx / SX) / 2
    floor = (fx >= 0) & (fx <= W) & (fy >= 0) & (fy <= D)
    # left wall x=0: gx=-y*26, gy=y*13-z
    ly = -gx / SX
    lz = ly * SY - gy
    lwall = (ly >= 0) & (ly <= D) & (lz >= 0) & (lz <= H) & (gx <= 0)
    # back-right wall y=0: gx=x*26, gy=x*13-z
    rx = gx / SX
    rz = rx * SY - gy
    rwall = (rx >= 0) & (rx <= W) & (rz >= 0) & (rz <= H) & (gx >= 0)
    light = ndi.gaussian_filter(lum(img), 10 * OUTK / 2)

    def paint_mask(region):
        px = img[region]
        med = np.median(px, axis=0)
        d = np.sqrt(((img - med) ** 2).sum(-1))
        dc = np.abs((img - img.mean(-1, keepdims=True)) - (med - med.mean())).sum(-1)
        w = np.clip(1.6 - dc / (14 * max(1, tol / 70) ** .7), 0, 1) * np.clip(1.6 - d / tol, 0, 1) * region
        w = ndi.median_filter(w, 3)
        return ndi.gaussian_filter(w, .8), med

    masks = {}
    if "L" in paint:
        r = rng["L"]
        masks["L"] = paint_mask(lwall & ((ly >= r[0]) & (ly <= r[1]) if r else True))
    if "R" in paint:
        r = rng["R"]
        masks["R"] = paint_mask(rwall & ((rx >= r[0]) & (rx <= r[1]) if r else True))
    fmed_l = np.median(lum(img[floor]))

    for st in styles:
        out = img.copy()
        if st.get("wc"):
            for k, col in (("L", st["wc"]), ("R", st.get("wcr") or st["wc"])):
                if k not in masks:
                    continue
                m, med = masks[k]
                target = hexrgb(col)[None, None, :] * (lum(img) / max(1, lum(med)))[..., None]
                out = out * (1 - m[..., None]) + target * m[..., None]
        acc = st.get("acc")
        if acc and acc["w"] in masks:
            m, med = masks[acc["w"]]
            pos, z = (ly, lz) if acc["w"] == "L" else (rx, rz)
            band = ((pos >= acc["a"]) & (pos <= acc["b"])).astype(float)
            band = ndi.gaussian_filter(band, .8) * m
            if acc.get("tex"):
                t = tile(Image.open("%s/w_%s.jpg" % (tex_dir, acc["tex"])), pos, H - z, 6, 104)
                shade = (lum(img) / max(1, lum(med)))[..., None]
                target = t * np.clip(shade, .5, 1.3)
            else:
                target = hexrgb(acc["c"])[None, None, :] * (lum(img) / max(1, lum(med)))[..., None]
            out = out * (1 - band[..., None]) + target * band[..., None]
        fl = st.get("fl", "keep")
        if fl != "keep":
            fm = ndi.gaussian_filter(floor.astype(float), .8)[..., None]
            if fl.startswith("tone:"):
                t = np.asarray(Image.open("%s/f_%s.jpg" % (tex_dir, fl[5:])).convert("RGB")).astype(float).reshape(-1, 3)
                px = img[floor]
                target = (img - px.mean(0)) / (px.std(0) + 1e-6) * t.std(0) * 1.1 + t.mean(0)
            else:
                t = tile(Image.open("%s/f_%s.jpg" % (tex_dir, fl)), fx, fy, 4, 2.667)
                target = t * np.clip(light / fmed_l, .55, 1.35)[..., None]
            out = out * (1 - fm) + target * fm
        name = out_prefix if st["id"] == "mid" else "%s_%s" % (out_prefix, st["id"])
        Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(name + ".webp", quality=86, method=6)
        print(name + ".webp", (ow, oh))


if __name__ == "__main__":
    main()
