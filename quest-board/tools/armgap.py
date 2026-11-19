"""Cut a clean gap between the upper arm and the torso on the bare body bases (Cal 2026-11-18, "Yes, repaint", via LEAD).

  armgap.py [--dry] [--out DIR]

The arm is painted touching the torso, sharing one outline from the armpit down to where the arm leaves the body, so the
rig cannot tell arm from torso there and tears a ragged edge in arms-up poses. For each join this traces that shared line
row by row from the armpit (a hand-placed start point below), fits a smooth curve through its middle and carries it down
into the opening where the arm leaves the body. Along that curve it widens the line a little (each side keeps a full
outline in the line's own colour), cuts a transparent gap (GAP px, about 3.5 px in the packed art) down its middle,
anti-aliased, and shades the torso's new edge softly. Gap and line taper shut at the armpit. Everything else (silhouette,
hands, legs, canvas, skin colours) is untouched.

Her four bases share the torso: the cut is measured once on f_base_<view> and applied to f_base, f_base_heel, f_base_bare
and f_base_bare_heel, so all four match. His is measured on m_base_<view>. Edits art/layers/*.png in place (or --out DIR);
run tools/pack.py on them afterwards.
"""
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
GAP, SHADE, TAPER = 7, 10, 40

# (start x, start y at the armpit, torso side: +1 right of the line / -1 left, last row) in 1696 x 2528 layer px
JOINS = {
    "f_front": [(692, 1405, 1, 1700), (1095, 1445, -1, 1700)],
    "f_back": [(668, 1380, 1, 1700), (1000, 1362, -1, 1700)],
    "m_front": [(706, 1295, 1, 1560), (1107, 1265, -1, 1545)],
    "m_back": [(662, 1240, 1, 1560), (1033, 1295, -1, 1555)],
}
FILES = {"f": ["f_base", "f_base_heel", "f_base_bare", "f_base_bare_heel"], "m": ["m_base"]}


def runs(row_dark):
    r, x = [], 0
    n = len(row_dark)
    while x < n:
        if row_dark[x]:
            s = x
            while x < n and row_dark[x]:
                x += 1
            r.append((s, x - 1))
        x += 1
    return r


def trace(a, x0, y0, side, yend):
    """rows: y -> (left x, right x) of the shared dark line, from the armpit down until the arm leaves the torso."""
    rgb, al = a[..., :3].astype(int), a[..., 3]
    dark = (rgb.mean(2) < 95) & (al > 128)
    out, c = {}, x0
    for y in range(y0, yend + 1):
        cand = [(abs((s + e) / 2 - c), s, e) for s, e in runs(dark[y, c - 30:c + 31]) if 3 <= e - s + 1 <= 34]
        if not cand:
            break
        _, s, e = min(cand)
        s, e = s + c - 30, e + c - 30
        if abs((s + e) / 2 - c) > 15:
            break
        # stop where the torso side is already open (the arm has left the body)
        # stop where either side is already open: the arm has left the body, and the line is no longer shared
        right, left = al[y, e + 4:e + 30], al[y, max(0, s - 30):s - 3]
        if ((right < 128).any() or (left < 128).any()) and y > y0 + 3:
            break
        out[y] = (s, e)
        c = (s + e) // 2
    return out


def plan(a, joins):
    """per pixel ops measured on the reference base: gap (alpha factor), line (outline cover), lcol, shade (factor).
    A smooth curve is fitted through the traced middle of the shared line and carried down into the opening where the arm
    leaves the body. Along it: a wider stroke in the line's colour (each side keeps a full outline), then the gap cut down
    its middle, both anti-aliased; a soft shadow inside the torso's new edge."""
    H, W = a.shape[:2]
    al = a[..., 3]
    gapc = np.zeros((H, W))
    linec = np.zeros((H, W))
    lcol = np.zeros((H, W, 3), np.uint8)
    shade = np.ones((H, W))
    rep = []
    for x0, y0, side, yend in joins:
        rows = trace(a, x0, y0, side, yend)
        if not rows:
            rep.append((x0, y0, None, None))
            continue
        ys = np.array(sorted(rows))
        w = np.array([rows[y][1] - rows[y][0] + 1 for y in ys])
        ok = w <= 1.7 * np.median(w)
        cx = np.array([(rows[y][0] + rows[y][1]) / 2 for y in ys])
        fit = np.polyfit(ys[ok], cx[ok], 3 if ok.sum() > 40 else 1)
        col = np.median(np.concatenate([a[y, rows[y][0]:rows[y][1] + 1, :3] for y in ys[ok]]), axis=0).astype(np.uint8)
        # carry on below the trace (slope of the last part) until the curve's middle reaches the opening
        tail = np.polyfit(ys[-12:], cx[-12:], 1)
        y1 = ys[-1]
        for y in range(ys[-1] + 1, ys[-1] + 40):
            xc = np.polyval(tail, y)
            y1 = y
            xi = int(round(xc))
            if al[y, xi - 6:xi + 7].min() < 64:  # the gap's edge reaches the opening
                break
        rep.append((x0, y0, int(ys[0]), int(y1)))
        for y in range(y0, y1 + 3):
            xc = np.polyval(fit, y) if y <= ys[-1] else np.polyval(tail, y)
            slope = np.polyval(np.polyder(fit), y) if y <= ys[-1] else tail[0]
            k = 1 / np.sqrt(1 + slope * slope)  # horizontal distance to perpendicular
            t = min(1.0, (y - y0) / TAPER)
            rg = GAP / 2 * t
            rw = rg + 6.0 * min(1.0, (y - y0) / 20, max(0.0, (y1 + 2 - y) / 12))  # the widened line fades in and out: no flat ends
            xs = np.arange(int(xc - 30), int(xc + 31))
            d = (xs - xc) * k
            gapc[y, xs] = np.maximum(gapc[y, xs], np.clip(rg - np.abs(d) + .5, 0, 1))
            cov = np.clip(rw - np.abs(d) + .5, 0, 1)
            linec[y, xs] = np.maximum(linec[y, xs], cov)
            lcol[y, xs] = col
            sd = d * side  # positive on the torso side
            sh = np.where((sd > rw) & (sd < rw + SHADE), 1 - .14 * t * (1 - (sd - rw) / SHADE), 1.0)
            shade[y, xs] = np.minimum(shade[y, xs], sh)
    return gapc, linec, lcol, shade, rep


def apply(path_in, path_out, ops):
    gapc, linec, lcol, shade = ops
    a = np.asarray(Image.open(path_in).convert("RGBA")).astype(float)
    opaque = a[..., 3] > 0
    m = (shade < 1) & opaque & (linec == 0)
    a[m, :3] *= shade[m, None]
    lc = (linec * opaque)[..., None]
    a[..., :3] = a[..., :3] * (1 - lc) + lcol * lc
    a[..., 3] = a[..., 3] * (1 - gapc)
    Image.fromarray(np.clip(a + .5, 0, 255).astype(np.uint8)).save(path_out)


def main():
    dry = "--dry" in sys.argv
    out = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else os.path.join(ROOT, "art", "layers")
    lay = os.path.join(ROOT, "art", "layers")
    for key, joins in JOINS.items():
        body, view = key.split("_")
        ref = np.asarray(Image.open(os.path.join(lay, "%s_base_%s.png" % (body, view))).convert("RGBA"))
        gap, line, lcol, shade, rep = plan(ref, joins)
        print(key, "joins (start x, start y, first row, last row):", rep, "gap px", int((gap > .5).sum()))
        if dry:
            continue
        for f in FILES[body]:
            apply(os.path.join(lay, "%s_%s.png" % (f, view)), os.path.join(out, "%s_%s.png" % (f, view)), (gap, line, lcol, shade))


if __name__ == "__main__":
    main()
