"""Split the bare body bases into an arms layer and a torso layer (LEAD 2026-11-18, after the arm gap could not fix the rig's
armpit tear: the arm and torso share one mesh, so the arms must ride the "arms" slot as their own picture).

  armsplit.py [--src DIR] [--out DIR]

Reads the original bases (default: shots/pending_art/armgap/orig_layers), applies tools/armgap.py's cut in memory, then for
each arm:
- the cap curve: from the start of the gap, up the arm's inner line (its spike) to T, then a rounded arc over the shoulder to
  S on the outer silhouette. The arm is everything on the hand's side of the cap curve and the gap. Its edge along the arc is
  feathered (FEATHER px), so at rest it melts into the identical skin under it.
- the torso curve: from the gap start through T to S2, further out on the shoulder, meeting the silhouette along it (a round
  shoulder, no point). The torso keeps
  everything on the body's side of it (its full shoulder, under the arm's cap) and gets a new outline there (LINE px, the
  line colour, anti-aliased) with a soft shadow inside.
Writes <b>_basearms_<view> (hers once: her arms are identical on all four bases) and <b>_basetorso[_bare][_heel]_<view>.
Today's <b>_base_* files stay as they are (the rig learns the limbs from them).
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import armgap  # noqa: E402

ROOT = os.path.join(HERE, "..")
FEATHER, LINE, SHADE = 12, 10, 10

# per view, per join in armgap.JOINS order: T (top of the arm's inner line), S (cap end on the silhouette, toward the neck),
# S2 (torso curve end on the silhouette, toward the arm), seed (a point inside the arm, low down), the cap arc's bulge toward
# the body (small on her: the tank's armhole already bounds the arm). 1696 x 2528 layer px.
ARMS = {
    "m_front": [((730, 1232), (680, 1095), (610, 1142), (520, 1500), 28), ((1080, 1168), (1045, 1070), (1130, 1128), (1235, 1450), 28)],
    "m_back": [((660, 1205), (675, 1088), (615, 1136), (520, 1500), 28), ((1015, 1240), (1080, 1092), (1130, 1125), (1230, 1450), 22)],
    "f_front": [((720, 1320), (692, 1160), (630, 1190), (520, 1550), 8), ((1105, 1410), (1028, 1166), (1078, 1200), (1230, 1500), 0)],
    "f_back": [((648, 1310), (690, 1158), (630, 1195), (520, 1550), 8), ((988, 1320), (1010, 1160), (1070, 1190), (1240, 1550), 8)],
}
VARIANTS = {"m": [("m_base", "m_basetorso")],
            "f": [("f_base", "f_basetorso"), ("f_base_heel", "f_basetorso_heel"), ("f_base_bare", "f_basetorso_bare"),
                  ("f_base_bare_heel", "f_basetorso_bare_heel")]}


def bezier(p0, p1, bulge, toward, n=80):
    """quadratic arc p0 -> p1 bulging `bulge` px to the side of the line facing point `toward`."""
    p0, p1, tw = np.array(p0, float), np.array(p1, float), np.array(toward, float)
    m = (p0 + p1) / 2
    d = p1 - p0
    nrm = np.array([-d[1], d[0]]) / np.hypot(*d)
    if np.dot(tw - m, nrm) < 0:
        nrm = -nrm
    c = m + bulge * nrm
    t = np.linspace(0, 1, n)[:, None]
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * c + t ** 2 * p1


def shoulder_arc(alpha, T, S2, arm_pt, n=80):
    """arc from T to S2 that meets the silhouette at S2 along it (no point, no flap): the control point lies on the
    silhouette's tangent at S2, on the arm's side."""
    T, S2, ap = np.array(T, float), np.array(S2, float), np.array(arm_pt, float)
    edge = (alpha > 0) & ~ndi.binary_erosion(alpha > 0)
    yy, xx = np.nonzero(edge[int(S2[1]) - 25:int(S2[1]) + 26, int(S2[0]) - 25:int(S2[0]) + 26])
    pts = np.stack([xx + S2[0] - 25, yy + S2[1] - 25], 1)
    pts = pts[np.hypot(*(pts - S2).T) < 25]
    u = np.linalg.svd(pts - pts.mean(0))[2][0]
    if np.dot(ap - S2, u) < 0:
        u = -u
    c = S2 + u * .45 * np.hypot(*(T - S2))
    t = np.linspace(0, 1, n)[:, None]
    arc = (1 - t) ** 2 * T + 2 * (1 - t) * t * c + t ** 2 * S2
    # close it outward: on to the nearest see-through pixel and a little past it
    yy, xx = np.mgrid[int(S2[1]) - 40:int(S2[1]) + 41, int(S2[0]) - 40:int(S2[0]) + 41]
    hole = alpha[yy, xx] == 0
    k = np.argmin(np.where(hole, (yy - S2[1]) ** 2 + (xx - S2[0]) ** 2, 1e9))
    h = np.array([xx.flat[k], yy.flat[k]], float)
    return np.vstack([arc, h, h + (h - S2) / max(1.0, np.hypot(*(h - S2))) * 12])


def clean(alpha, near, r=5):
    """drop slivers thinner than about 2r px (a leftover strip of the other layer's outline) near the cut."""
    solid = alpha > 0
    opened = ndi.binary_dilation(ndi.binary_erosion(solid, iterations=r), iterations=r + 1) & solid
    return solid & (opened | ~near)


def extend(pts, px=30):
    """carry the end of a curve px further along its last direction (past the silhouette, so it closes)."""
    d = pts[-1] - pts[-4]
    return np.vstack([pts, pts[-1] + d / np.hypot(*d) * px])


def raster(shape, pts, width=3):
    im = Image.new("L", (shape[1], shape[0]))
    ImageDraw.Draw(im).line([tuple(p) for p in pts], fill=255, width=width)
    return np.asarray(im) > 0


def region(alpha, barrier, seed):
    free = (alpha > 0) & ~barrier
    lab, _ = ndi.label(free)
    k = lab[seed[1], seed[0]]
    assert k, "seed %s is not inside the arm" % (seed,)
    return lab == k


def main():
    args = sys.argv[1:]
    src = args[args.index("--src") + 1] if "--src" in args else os.path.join(ROOT, "..", "shots", "pending_art", "armgap", "orig_layers")
    out = args[args.index("--out") + 1] if "--out" in args else os.path.join(ROOT, "art", "layers")
    for key, joins in armgap.JOINS.items():
        body, view = key.split("_")
        ref = np.asarray(Image.open(os.path.join(src, "%s_base_%s.png" % (body, view))).convert("RGBA"))
        armgap.CURVES.clear()
        gapc, linec, lcol, shade, rep = armgap.plan(ref, joins)
        curves = list(armgap.CURVES)
        H, W = ref.shape[:2]

        def cut(a):
            a = a.astype(float)
            opaque = a[..., 3] > 0
            m = (shade < 1) & opaque & (linec == 0)
            a[m, :3] *= shade[m, None]
            lc = (linec * opaque)[..., None]
            a[..., :3] = a[..., :3] * (1 - lc) + lcol * lc
            a[..., 3] = a[..., 3] * (1 - gapc)
            return a

        r = cut(ref)
        arms = np.zeros((H, W), bool)
        feather = np.ones((H, W))
        remove = np.zeros((H, W), bool)
        tline = np.zeros((H, W))
        tshade = np.ones((H, W))
        col = None
        nearcut = np.zeros((H, W), bool)
        for (x0, y0, side, yend), (T, S, S2, seed, bulge), curve in zip(joins, ARMS[key], curves):
            g = np.array(curve)
            body_pt = (x0 + 200 * side, y0 - 150)  # a point well inside the body
            spike = np.linspace([x0, y0], T, 30)
            cap = extend(bezier(T, S, bulge, body_pt)) if bulge else extend(np.linspace(T, S, 80))
            tor = shoulder_arc(ref[..., 3], T, S2, seed)
            # close the gap's end onto the opening: a line from the curve's end to the nearest see-through pixel of the art
            ex, ey = g[-1]
            yy, xx = np.mgrid[int(ey) - 30:int(ey) + 31, int(ex) - 30:int(ex) + 31]
            hole = ref[yy, xx, 3] == 0
            gl = [g]
            if hole.any():
                k = np.argmin(np.where(hole, (yy - ey) ** 2 + (xx - ex) ** 2, 1e9))
                hx, hy = xx.flat[k], yy.flat[k]
                gl.append(np.array([[ex, ey], [hx, hy], [hx + (hx - ex) * .3, hy + (hy - ey) * .3]]))
            gapline = ndi.binary_dilation(raster((H, W), np.vstack(gl), 3), iterations=1)
            # the arm: hand side of gap + spike + cap arc
            arm = region(r[..., 3], gapline | ndi.binary_dilation(raster((H, W), np.vstack([spike, cap]), 3), iterations=1), seed)
            arm = ndi.binary_dilation(arm, iterations=3) & (r[..., 3] > 0)
            arms |= arm
            nearcut |= ndi.binary_dilation(gapline | raster((H, W), np.vstack([spike, cap, tor]), 3), iterations=30)
            dcap = ndi.distance_transform_edt(~raster((H, W), cap, 1))
            feather = np.minimum(feather, np.clip(dcap / FEATHER, 0, 1))
            # the torso: drop what lies on the hand side of gap + spike + torso arc
            rm = region(r[..., 3], gapline | ndi.binary_dilation(raster((H, W), np.vstack([spike, tor]), 3), iterations=1), seed)
            remove |= ndi.binary_dilation(rm, iterations=2) & (r[..., 3] > 0)
            dt = ndi.distance_transform_edt(~raster((H, W), np.vstack([spike, tor]), 1))
            tline = np.maximum(tline, np.clip(LINE - dt + .5, 0, 1))
            tshade = np.minimum(tshade, np.where((dt > LINE) & (dt < LINE + SHADE), .88 + .12 * (dt - LINE) / SHADE, 1))
            if col is None:
                sy, sx = int(T[1]) + 10, int(T[0])
                win = ref[sy - 6:sy + 6, sx - 12:sx + 12, :3].reshape(-1, 3)
                dk = win[win.mean(1) < 95]
                col = np.median(dk, axis=0) if len(dk) else np.array([20, 10, 10])
        # arms layer (one for her: arms are identical on all four bases)
        A = r.copy()
        A[..., 3] = np.where(arms, A[..., 3] * feather, 0)
        if body == "f":
            # her arms layer is shared by the tank and bare bases: no tank cloth in it (light, colourless pixels)
            rgbA = A[..., :3]
            cloth = (rgbA.max(2) - rgbA.min(2) < 22) & (rgbA.mean(2) > 110)
            A[..., 3] = np.where(cloth & nearcut, 0, A[..., 3])
        A[..., 3] = np.where(clean(A[..., 3], nearcut), A[..., 3], 0)
        Image.fromarray(np.clip(A + .5, 0, 255).astype(np.uint8)).save(os.path.join(out, "%s_basearms_%s.png" % (body, view)))
        for base, name in VARIANTS[body]:
            a = cut(np.asarray(Image.open(os.path.join(src, "%s_%s.png" % (base, view))).convert("RGBA")))
            a[remove, 3] = 0
            a[..., 3] = np.where(clean(a[..., 3], nearcut), a[..., 3], 0)
            keep = a[..., 3] > 0
            lc = (tline * keep)[..., None]
            a[..., :3] = a[..., :3] * (1 - lc) + col * lc
            m = (tshade < 1) & keep & (tline == 0)
            a[m, :3] *= tshade[m, None]
            Image.fromarray(np.clip(a + .5, 0, 255).astype(np.uint8)).save(os.path.join(out, "%s_%s.png" % (name, view)))
        print(key, "arms px", int(arms.sum()), "torso removed px", int(remove.sum()))


if __name__ == "__main__":
    main()
