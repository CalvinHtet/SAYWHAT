"""Face tattoo or scar layer from a Higgsfield edit of the two-head template (ROOMS 2026-11-24).

  mark_cut.py <template.png> <meta.json> <edited.png> <id> [--ink] [--min 40] [--out <dir>]

The template is both heads (m left, f right) cut from <b>_base_front + <b>_face_front, scaled up, on light grey (meta.json says
where: box on the 848x1264 canvas, scale, offset in the template). Higgsfield returns the same picture with a mark added.
Per head: the edit is aligned to the template (brute-force shift and scale on the outlines), the difference is measured, and
only skin pixels of the template that changed count (eyes, brows, mouth, outline and background are never taken). The
change becomes a layer on the 848x1264 front canvas: art/app/<b>_mark_<id>_front.webp, normal blend, no tint
(LEAD 70f91a89, rig slots markS/markT).
  --ink   a tattoo: the colour is the edit's own dark ink, alpha from how much darker the skin got.
  default a scar: colour and alpha from the edit as painted (it can be lighter or darker than the skin).
"""
import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
APP = os.path.join(ROOT, "art", "app")
W, H = 848, 1264


def edges(g):
    gx, gy = np.gradient(g)
    return np.hypot(gx, gy)


def _dark(img):
    return (img.mean(2) < 120).astype(float)


def align(T, ed_full, ox, oy, n):
    """Find how template panel pixel (x, y) maps into the whole edit: (x*sx + X0, y*sy + Y0). Scale searched in steps,
    translation by FFT cross-correlation of dark-line masks at quarter size, then refined at full size."""
    q = 4
    Ed = _dark(np.asarray(ed_full).astype(float))
    cx0 = max(0, ox - 160)
    Eq = Ed[:, cx0:min(Ed.shape[1], ox + n + 160)][::q, ::q]
    best = None
    for sx in np.arange(0.90, 1.101, 0.01):
        for sy in np.arange(0.90, 1.101, 0.01):
            tw, th = int(n * sx / q), int(n * sy / q)
            Tq = np.asarray(Image.fromarray((_dark(T) * 255).astype(np.uint8)).resize((tw, th), Image.BILINEAR)).astype(float) / 255
            F = np.fft.rfft2(Eq) * np.conj(np.fft.rfft2(Tq, Eq.shape))
            c = np.fft.irfft2(F, Eq.shape)
            i = np.unravel_index(np.argmax(c), c.shape)
            v = c[i] / max(Tq.sum(), 1)
            if best is None or v > best[0]:
                best = (v, sx, sy, i[1] * q + cx0, i[0] * q)
    _, sx, sy, X0, Y0 = best
    # refine at full size around the coarse answer
    Td = _dark(T)
    ys, xs = np.nonzero(Td)
    r2 = None
    for dsx in np.arange(-0.01, 0.0101, 0.0025):
        for dsy in np.arange(-0.01, 0.0101, 0.0025):
            for dy in range(-4, 5):
                for dx in range(-4, 5):
                    X = np.clip((xs * (sx + dsx) + X0 + dx).round().astype(int), 0, Ed.shape[1] - 1)
                    Y = np.clip((ys * (sy + dsy) + Y0 + dy).round().astype(int), 0, Ed.shape[0] - 1)
                    v = Ed[Y, X].mean()
                    if r2 is None or v > r2[0]:
                        r2 = (v, sx + dsx, sy + dsy, X0 + dx, Y0 + dy)
    return r2[1:], r2[0]


def main():
    a = sys.argv[1:]
    tpl_p, meta_p, ed_p, mid = a[:4]
    ink = "--ink" in a
    mn = int(a[a.index("--min") + 1]) if "--min" in a else 40
    out = a[a.index("--out") + 1] if "--out" in a else APP
    meta = json.load(open(meta_p))
    tpl = Image.open(tpl_p).convert("RGB")
    edfull = Image.open(ed_p).convert("RGB")
    edfull = edfull.resize((edfull.width * 1600 // edfull.width, int(edfull.height * 1600 / edfull.width)), Image.LANCZOS)
    for b in "mf":
        M = meta[b]
        ox, oy = M["off"]
        x0, y0, x1, y1 = M["box"]
        S = M["scale"]
        n = int(round((x1 - x0) * S))
        T = np.asarray(tpl.crop((ox, oy, ox + n, oy + n))).astype(float)
        lum = T.mean(2)
        skin = (np.abs(T[..., 0] - T[..., 2]) > 25) & (lum > 150) & (T[..., 0] > 200)
        skin = ndi.binary_erosion(skin, iterations=3)
        (sx, sy, X0, Y0), fit = align(T, edfull, ox, oy, n)
        yy, xx = np.mgrid[0:n, 0:n]
        X = np.clip((xx * sx + X0).round().astype(int), 0, edfull.width - 1)
        Y = np.clip((yy * sy + Y0).round().astype(int), 0, edfull.height - 1)
        E = np.asarray(edfull).astype(float)[Y, X]
        dx, dy, s = X0, Y0, (sx, sy)
        d = np.abs(E - T).sum(2)
        chg = skin & (d > mn)
        lab, k = ndi.label(chg)
        sizes = ndi.sum(chg, lab, range(1, k + 1))
        keep = np.isin(lab, [i + 1 for i, z in enumerate(sizes) if z >= 25])
        soft = ndi.binary_dilation(keep, iterations=3) & skin
        if ink:
            el, tl = E.mean(2), T.mean(2)
            inkc = np.median(E[keep & (el < np.percentile(el[keep], 30))], 0) if keep.any() else np.array([25, 25, 45.0])
            alpha = np.clip((tl - el) / np.maximum(tl - inkc.mean(), 1), 0, 1) * soft
            rgb = np.broadcast_to(inkc, E.shape)
        else:
            alpha = np.clip(d / 90, 0, 1) * soft
            rgb = E
        layer = np.dstack([rgb, alpha * 255]).astype(np.uint8)
        im = Image.fromarray(layer).resize((x1 - x0, y1 - y0), Image.LANCZOS)
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        canvas.paste(im, (x0, y0))
        p = os.path.join(out, "%s_mark_%s_front.webp" % (b, mid))
        canvas.save(p, "WEBP", quality=92, alpha_quality=95, method=6)
        print(p, "align", dx, dy, [round(v, 3) for v in s], "fit", round(fit, 3), "pixels", int(keep.sum()), "ink" if ink else "paint")


def icon(mid, out):
    """icon_mark_<id>.webp, 320x320: the bare m head with the mark, cropped on the head (what the mirror shows)"""
    im = Image.open(os.path.join(APP, "m_base_front.webp")).convert("RGBA")
    im.alpha_composite(Image.open(os.path.join(out, "m_mark_%s_front.webp" % mid)).convert("RGBA"))
    im.alpha_composite(Image.open(os.path.join(APP, "m_face_front.webp")).convert("RGBA"))
    # centred on the mark, so a thin scar still reads at the 92 px mirror (QA 11-25); never smaller than 300 px of canvas
    al = np.asarray(Image.open(os.path.join(out, "m_mark_%s_front.webp" % mid)))[..., 3]
    ys, xs = np.nonzero(al > 60)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    side = max(300, 1.5 * max(xs.max() - xs.min(), ys.max() - ys.min()))
    box = tuple(int(round(v)) for v in (cx - side / 2, cy - side / 2, cx + side / 2, cy + side / 2))
    head = im.crop(box).resize((320, 320), Image.LANCZOS)
    p = os.path.join(out, "icon_mark_%s.webp" % mid)
    head.save(p, "WEBP", quality=90, alpha_quality=92, method=6)
    print(p)


if __name__ == "__main__":
    if sys.argv[1] == "--icon":
        icon(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else APP)
        sys.exit()
    main()
