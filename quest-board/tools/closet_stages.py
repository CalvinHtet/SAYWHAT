"""Make the Closet's earlier stages from its finished painting (art/app/clx_room.webp).

  closet_stages.py [--check out.png]

Cal wants every stage to be the same room as the glass closet, only less finished. No new art can be made in a cloud
session, so the stages are cut from the painting itself:

  clx_st0  closed walnut doors over every glass pane and over the open shoe wall, bare floor (no island, no rug)
  clx_st1  as st0, with the shoe and bag wall open
  clx_st2  as st1, with the island and rug back

The doors take their wood from the upper cabinets directly above each pane (the grain runs straight down, so each
column of the door repeats that column's wood), keeping the black frames and handles. The bare floor is the floor's
own light, filled in smoothly from the boundary, plus plank texture copied from clean floor on either side.

These are stand-ins. When Cal is next generating, an image edit of clx_room.webp per stage ("same room, same camera,
remove the island and the rug", and so on) can replace each file with no code change.
"""
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

SRC = "art/app/clx_room.webp"
OUT = "art/app/%s.webp"

# The two walls in painting pixels: top and bottom of the glass band, and the frames between doors.
TL = lambda x: 250 - (x - 62) * 0.58
BL = lambda x: 446 - (x - 60) * 0.565
TR = lambda x: 120 + (x - 321) * 0.6
BR = lambda x: 312 + (x - 305) * 0.555
PANES_L = [(58, 88), (100, 132), (141, 174), (183, 216), (225, 255), (266, 299)]
PANES_R = [(307, 340), (351, 381), (473, 506), (517, 548)]
SHOE = (389, 466)


def band(x):
    return (TL(x), BL(x)) if x < 302 else (TR(x), BR(x))


def wood_doors(im, panes, shoe):
    """Cover glass panes (and the shoe wall) with the wood of the cabinet above each column."""
    a = im.copy()
    H = a.shape[0]
    cols = [x for p in panes for x in range(p[0], p[1] + 1)]
    if shoe:
        cols += list(range(shoe[0], shoe[1] + 1))
    for x in cols:
        t, b = band(x)
        t0, b0 = int(round(t)) + 2, int(round(b)) - 1
        if shoe and shoe[0] <= x <= shoe[1]:
            b0 += 8  # the open shelf runs a little lower than the doors beside it
        # wood source: the upper cabinet face above this column, clear of its top and bottom trim
        s1, s0 = int(t) - 8, int(t) - 52
        win = a[max(0, s0):s1, x].copy()
        if len(win) < 10:
            continue
        # keep the longest run of rows that are plain wood: no trim line or seam between two upper cabinets
        lum = win.mean(-1)
        ok = np.abs(lum - np.median(lum)) < 16
        best, cur, start = (0, 0), 0, 0
        for r, v in enumerate(ok):
            cur, start = (cur + 1, start) if v else (0, r + 1)
            if cur > best[1] - best[0]:
                best = (start, start + cur)
        src = win[best[0]:best[1]] if best[1] - best[0] >= 8 else win
        n = b0 - t0
        reps = np.resize(src, (n, 3)) if n > 0 else src[:0]
        # repeat the column's wood down the door, mirrored at each repeat so no seam shows, and shade it gently
        k = np.arange(n)
        idx = k % (2 * len(src))
        idx = np.where(idx < len(src), idx, 2 * len(src) - 1 - idx)
        col = src[idx]
        shade = (1.0 - 0.10 * (k / max(1, n)))[:, None]
        a[t0:b0, x] = np.clip(col * shade, 0, 255)
    # a seam and a pair of handles down the middle of the shoe wall, like the doors beside it
    if shoe:
        mx = (shoe[0] + shoe[1]) // 2
        for x in range(mx - 1, mx + 2):
            t, b = band(x)
            a[int(t) + 2:int(b) + 7, x] = [24, 18, 14]
        for dx in (-4, 3):
            t, b = band(mx + dx)
            y = int((t + b) / 2)
            a[y - 7:y + 7, mx + dx:mx + dx + 2] = [32, 26, 20]
    return a


def floor_mask(shape):
    m = Image.new("L", (shape[1], shape[0]), 0)
    d = ImageDraw.Draw(m)
    d.ellipse((154, 369, 459, 578), fill=255)  # the rug
    d.polygon([(201, 396), (328, 326), (410, 366), (410, 458), (288, 530), (201, 482)], fill=255)  # the island
    return ndi.binary_dilation(np.asarray(m) > 0, iterations=4)


def floor_region(shape):
    """The floor inside the walls (painting pixels), where texture may be copied from."""
    m = Image.new("L", (shape[1], shape[0]), 0)
    ImageDraw.Draw(m).polygon([(62, 452), (300, 318), (548, 456), (300, 598)], fill=255)
    return np.asarray(m) > 0


def harmonic_fill(img, hole, iters=3000):
    """Smooth colour across the hole, from its edge (low frequencies only)."""
    f = 4
    small = img[::f, ::f].copy()
    hs = hole[::f, ::f]
    for _ in range(iters):
        avg = (np.roll(small, 1, 0) + np.roll(small, -1, 0) + np.roll(small, 1, 1) + np.roll(small, -1, 1)) / 4
        small[hs] = avg[hs]
    up = np.asarray(Image.fromarray(np.clip(small, 0, 255).astype("uint8")).resize((img.shape[1], img.shape[0]), Image.BICUBIC)).astype(float)
    return ndi.gaussian_filter(up, sigma=(4, 4, 0))


# The painted floor is a herringbone laid at 45 degrees to the walls: on screen its boards run straight across and
# straight up, about 28 x 8 px and 14 x 16 px (the floor is seen at 30 degrees, so depth is squashed by 0.577).
SQ = 0.577
PLANK_W, PLANK_N = 14.0, 2  # board width in painting px (before the squash), length in widths


def herringbone(X, Y):
    """Which board each point is on (an id, 1 for the upright ones) and how far it is from the board's edge, in widths."""
    n = PLANK_N
    x, y = X / PLANK_W, Y / PLANK_W
    t1, t2 = np.array([1.0, 1.0]), np.array([n, -n])
    M = np.linalg.inv(np.array([t1, t2]).T)
    ab = np.tensordot(M, np.stack([x, y]), 1)
    best_id = np.full(x.shape, -1, dtype=np.int64)
    kind = np.zeros(x.shape, dtype=np.int8)
    edge = np.zeros(x.shape)
    for di in range(-n - 1, 2):
        for dj in range(-1, 2):
            i = np.floor(ab[0]) + di
            j = np.floor(ab[1]) + dj
            rx = x - (i * t1[0] + j * t2[0])
            ry = y - (i * t1[1] + j * t2[1])
            inH = (rx >= 0) & (rx < n) & (ry >= 0) & (ry < 1)
            inV = (rx >= n) & (rx < n + 1) & (ry >= 1 - n) & (ry < 1)
            hit = (inH | inV) & (best_id < 0)
            if not hit.any():
                continue
            pid = ((i * 7919 + j * 104729) * 2 + inV).astype(np.int64)
            best_id[hit] = pid[hit]
            kind[hit] = inV[hit]
            eh = np.minimum(np.minimum(rx, n - rx), np.minimum(ry, 1 - ry) / SQ)
            ev = np.minimum(np.minimum(rx - n, n + 1 - rx), np.minimum(ry - (1 - n), 1 - ry) / SQ)
            edge[hit] = np.where(inV, ev, eh)[hit]
    return best_id, kind, edge


def floor_pixels(a, hole, alpha):
    """The painted floor, column by column: from under the cabinet plinth down to the front edge of the floor slab."""
    H, W = alpha.shape
    L = a.mean(-1)
    m = np.zeros((H, W), bool)
    tops, bots = np.full(W, -1.0), np.full(W, -1.0)
    for x in range(30, W - 30):
        col = np.nonzero(alpha[:, x] > 0)[0]
        if not len(col):
            continue
        y = int(BL(x) if x < 302 else BR(x))
        while y < H - 1 and L[y, x] < 75:
            y += 1  # down through the plinth
        yb = col.max()
        while yb > y and L[yb, x] < 75:
            yb -= 1  # up through the slab's edge
        tops[x], bots[x] = y, yb
    ok = tops >= 0
    xs = np.arange(W)[ok]
    # straight edges, as painted: smooth the per-column scan
    t = ndi.median_filter(tops[ok], 9)
    bt = ndi.median_filter(bots[ok], 15)
    for x, y0, y1 in zip(xs, t, bt):
        m[int(y0):int(y1) + 1, x] = True
    return m


def bare_floor(im, alpha):
    a = im.copy()
    hole = ndi.binary_dilation(floor_mask(a.shape), iterations=3)
    flo = floor_pixels(a, hole, alpha)
    hole &= flo
    good = flo & ~hole
    # the floor's light: blurred from clean floor only (normalised, so the rug does not bleed in), then carried across
    g = good.astype(float)
    num = np.stack([ndi.gaussian_filter(a[..., c] * g, 7) for c in range(3)], -1)
    den = ndi.gaussian_filter(g, 7)[..., None]
    light = np.where(den > 0.05, num / np.maximum(den, 1e-6), 0)
    _, (iy, ix) = ndi.distance_transform_edt(~good, return_indices=True)
    light = light[iy, ix]
    low = harmonic_fill(light, hole)
    low[good] = light[good]
    # boards over the whole floor, so new and old cannot be told apart: each a little lighter or darker, with grain
    ys, xs = np.nonzero(flo)
    pid, kind, edge = herringbone(xs.astype(float), ys / SQ)
    rng = np.random.default_rng(7)
    ids, inv = np.unique(pid, return_inverse=True)
    var = rng.uniform(0.88, 1.10, len(ids))[inv]
    along = np.where(kind == 1, xs, ys / SQ * 0 + ys).astype(float)
    grain = 1 + 0.05 * np.sin(along * 1.9 + (pid % 17)) * np.sin(along * 0.37 + (pid % 5))
    seam = np.where(edge < 0.06, 0.66, np.where(edge < 0.11, 0.88, 1.0))
    f = var * grain * seam
    f = f / f.mean()
    out = a.copy()
    out[ys, xs] = np.clip(low[ys, xs] * f[:, None], 0, 255)
    w = ndi.gaussian_filter(flo.astype(float), 0.8)[..., None]
    return np.clip(out * w + a * (1 - w), 0, 255)


def main():
    src = Image.open(SRC).convert("RGBA")
    rgb = np.asarray(src)[..., :3].astype(float)
    alpha = np.asarray(src)[..., 3:]
    bare = bare_floor(rgb, np.asarray(src)[..., 3])
    st0 = wood_doors(bare, PANES_L + PANES_R, SHOE)
    st1 = wood_doors(bare, PANES_L + PANES_R, None)
    st2 = wood_doors(rgb, PANES_L + PANES_R, None)
    outs = {"clx_st0": st0, "clx_st1": st1, "clx_st2": st2}
    for k, v in outs.items():
        Image.fromarray(np.concatenate([np.clip(v, 0, 255).astype("uint8"), alpha], -1), "RGBA").save(OUT % k, "WEBP", quality=90, method=6)
        print("wrote", OUT % k)
    if "--check" in sys.argv:
        path = sys.argv[sys.argv.index("--check") + 1]
        ims = [Image.open(OUT % k) for k in outs] + [src]
        sheet = Image.new("RGBA", (src.width * 4, src.height), (40, 40, 50, 255))
        for i, m in enumerate(ims):
            sheet.paste(m, (i * src.width, 0), m)
        sheet.save(path)


if __name__ == "__main__":
    main()
