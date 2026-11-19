"""Cut a painted pet sheet (12 cells, 4 columns x 3 rows on flat green) into the pet's frames and its bed.

  pet_cut.py <sheet.png> <pet> <frame-0 height px> [--flip 2,9] [--float 2,3] [--edgefix 4] [--out DIR]

Cells, reading order: 0-1 idle A/B, 2-3 move A/B, 4 sit, 5 sleep in its bed, 6 fun move, 7 = the empty bed alone,
8-11 crying. Saved as pgx_<pet>_<0..10>.webp (LEAD's 11 frames: 0-1 idle, 2-3 move, 4 sit, 5 sleep, 6 fun, 7-10 crying)
and pbed_<pet>.webp. All 11 frames share one canvas and one ground line (the bottom row of the canvas), one scale
(frame 0 is <height> px tall) and are placed by their mass centre, so clothing anchors measured once per frame hold.
Every frame stands on the ground line, except --float cells (hover, bounce), which keep their height above their
row's first cell's feet. --flip mirrors cells that face left
(cell numbers as above). --edgefix N cleans a green rim off glow edges and recolours olive or khaki spill (only for a pet with no
colour whose green beats its blue: the slime). The bed uses the same scale, trimmed tight.
"""
import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def key(rgb):
    a = rgb.astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    green = np.clip((g - np.maximum(r, b) - 30) / 60, 0, 1)
    out = a.copy()
    out[..., 1] = np.minimum(g, np.maximum(r, b))  # despill (no green cast left on smoke, mist or glow edges)
    alpha = ndi.median_filter(1 - green, 3)
    return out.astype(np.uint8), alpha


def main():
    args = sys.argv[1:]
    opt = {}
    pos = []
    i = 0
    while i < len(args):
        if args[i].startswith("--"):
            opt[args[i][2:]] = args[i + 1]
            i += 2
        else:
            pos.append(args[i])
            i += 1
    sheet, pet, th = pos[0], pos[1], int(pos[2])
    flip = {int(x) for x in opt.get("flip", "").split(",") if x}
    float_ = {int(x) for x in opt.get("float", "").split(",") if x}
    out = opt.get("out", os.path.join(ROOT, "art", "app"))
    rgb, alpha = key(np.asarray(Image.open(sheet).convert("RGB")))
    if "edgefix" in opt:
        # glow blended into the green screen leaves a yellow-green rim: within N px of the background, fade out pixels
        # whose green beats their blue (pink, violet and cyan never do) and pull their green down to the blue
        n = int(opt["edgefix"])
        band = ndi.binary_dilation(alpha < .5, iterations=n) & (alpha >= .5)
        a = rgb.astype(float)
        spill = np.clip((a[..., 1] - a[..., 2] - 10) / 70, 0, 1) * band
        alpha = alpha * (1 - spill)
        a[..., 1] = np.where(band, np.minimum(a[..., 1], a[..., 2]), a[..., 1])
        # olive: pink blended with green reads khaki once green is capped; within 2N px of the background, a pixel whose
        # green still beats its blue takes the colour of the nearest clean solid pixel (alpha stays)
        o = rgb.astype(float)
        bad = (alpha > .02) & (((o[..., 1] > o[..., 2] + 8) & ndi.binary_dilation(alpha < .5, iterations=2 * n))
               | ((o[..., 1] >= o[..., 2] - 12) & (o[..., 0] > o[..., 2] + 30) & ndi.binary_dilation(alpha < .5, iterations=2 * n)) | (o[..., 1] > o[..., 2] + 12) | ((o[..., 1] >= o[..., 2] - 5) & (o[..., 0] > o[..., 2] + 25)))  # near the edge, or olive, khaki or tan anywhere
        good = (alpha >= .5) & ~bad
        _, (iy, ix) = ndi.distance_transform_edt(~good, return_indices=True)
        a[bad] = a[iy[bad], ix[bad]]
        alpha = np.where(bad & (alpha < .8), 0, alpha)  # a faint smudge (green floor shadow under a glow) goes
        rgb = a.astype(np.uint8)
    H, W = alpha.shape
    solid = alpha > .5
    lab, n = ndi.label(ndi.binary_dilation(solid, iterations=3))
    sizes = ndi.sum(solid, lab, range(1, n + 1))
    coms = ndi.center_of_mass(solid, lab, range(1, n + 1))
    cw, ch = W / 4, H / 3
    cellmask = [np.zeros_like(solid) for _ in range(12)]
    for j in range(n):
        if sizes[j] < 60:  # specks
            continue
        cy, cx = coms[j]
        c = min(2, int(cy // ch)) * 4 + min(3, int(cx // cw))
        cellmask[c] |= lab == j + 1
    # drop specks: a small piece (under 3% of the cell's main figure) that does not touch the main figure within 20 px
    for c in range(12):
        m = cellmask[c]
        cl, cn = ndi.label(m)
        if cn < 2:
            continue
        cs = ndi.sum(solid, cl, range(1, cn + 1))
        big = int(np.argmax(cs)) + 1
        near = ndi.binary_dilation(cl == big, iterations=20)
        for j in range(1, cn + 1):
            if j != big and cs[j - 1] < .03 * cs[big - 1] and not (near & (cl == j)).any():
                m[cl == j] = False
    # ground line per row: the bottom of the row's first cell (standing idle, sit, first crying frame)
    bottoms = []
    for c in range(12):
        ys = np.nonzero(cellmask[c].any(1))[0]
        bottoms.append(ys.max() + 1)
    ground = [bottoms[r * 4] for r in range(3)]
    k = th / (bottoms[0] - np.nonzero(cellmask[0].any(1))[0].min())
    frames = []
    for c in range(12):
        m = cellmask[c]
        a = np.where(m, alpha, 0)
        ys, xs = np.nonzero(a > .04)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        im = Image.fromarray(np.dstack([rgb[y0:y1, x0:x1], (a[y0:y1, x0:x1] * 255).astype(np.uint8)]))
        cx = ndi.center_of_mass(a[y0:y1, x0:x1])[1]
        if c in flip:
            im = im.transpose(Image.FLIP_LEFT_RIGHT)
            cx = (x1 - x0) - cx
        im = im.resize((max(1, round((x1 - x0) * k)), max(1, round((y1 - y0) * k))), Image.LANCZOS)
        lift = max(0, (ground[c // 4] - y1) * k) if c in float_ else 0  # only --float cells leave the ground
        frames.append((im, cx * k, lift))
    bed = frames.pop(7)[0]
    # one canvas: centre column at the mass centre, bottom row = ground
    left = max(f[1] for f in frames)
    right = max(f[0].size[0] - f[1] for f in frames)
    top = max(f[0].size[1] + f[2] for f in frames)
    CW, CH = int(np.ceil(left + right)) + 4, int(np.ceil(top)) + 2
    meta = {}
    for i, (im, cx, lift) in enumerate(frames):
        can = Image.new("RGBA", (CW, CH))
        can.alpha_composite(im, (int(round(left - cx)) + 2, int(round(CH - lift - im.size[1]))))
        nm = "pgx_%s_%d" % (pet, i)
        can.save(os.path.join(out, nm + ".webp"), quality=90, method=6)
        meta[nm] = {"h": CH, "w": CW, "cx": int(round(left)) + 2}  # cx: the column every frame's mass centre sits on
    nm = "pbed_%s" % pet
    bed.save(os.path.join(out, nm + ".webp"), quality=90, method=6)
    meta[nm] = {"h": bed.size[1], "w": bed.size[0]}
    print(json.dumps(meta))


if __name__ == "__main__":
    main()
