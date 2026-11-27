"""Cover bare scalp that shows past a hat (ROOMS 2026-11-27; Cal 11-26: "Look at the helmet here. There's a gap").

  hat_backfill.py [--views back,front] [--grow N] <item> [<item> ...]

The rig hides the hair under a hat, so any part of the template skull the hat art does not cover shows as bare skin in some
poses (rearStand, dance1). For each layer art/layers/{m,f}_<item>_<view>.png this fills the skull pixels that sit above the
hat's lowest row in that column and are not already covered, with the colour of the nearest hat pixel (so the crown simply
extends), then draws a 3 px dark outline on the new outer edge. --grow N widens the skull mask by N px to cover the rotated
head in turning poses (default 10). Backs up nothing: copy the layers first. Run pack.py and items.py after.
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
args = sys.argv[1:]
views = ["back"]
grow = 10
if "--views" in args:
    i = args.index("--views"); views = args[i + 1].split(","); del args[i:i + 2]
if "--grow" in args:
    i = args.index("--grow"); grow = int(args[i + 1]); del args[i:i + 2]

for item in args:
    for body in "mf":
        for view in views:
            p = os.path.join(ROOT, "art", "layers", "%s_%s_%s.png" % (body, item, view))
            if not os.path.exists(p):
                continue
            im = np.asarray(Image.open(p).convert("RGBA")).copy()
            H, W = im.shape[:2]
            sil = np.asarray(Image.open(os.path.join(ROOT, "art", "sil", "%s_%s.png" % (body, view))).convert("RGB")
                             .resize((W, H), Image.NEAREST)).astype(int)
            skull = (sil[..., 0] > 128) & (sil[..., 1] < 128)
            hat = im[..., 3] > 40
            ys, xs = np.nonzero(hat)
            if not len(ys):
                continue
            # head band only: skull rows from its top down to the hat's lowest row (per column, the hat's bottom)
            top = np.nonzero(skull.any(1))[0].min()
            skull[: top] = False
            bottom = np.full(W, -1)
            for x in np.unique(xs):
                bottom[x] = ys[xs == x].max()
            # columns the hat does not reach: use the hat's typical band row so the skull edge there is covered too
            band = int(np.median(bottom[bottom >= 0]))
            bottom[bottom < 0] = band
            rows = np.arange(H)[:, None]
            region = skull & (rows <= np.minimum(bottom[None, :], band + 40))
            if grow:
                region = ndi.binary_dilation(region, iterations=grow) & (rows <= np.minimum(bottom[None, :], band + 40))
            gap = region & ~hat
            # only fill gaps touching the hat (never paint islands)
            lab, n = ndi.label(gap)
            touch = ndi.binary_dilation(hat, iterations=2)
            keep = np.zeros_like(gap)
            for i in range(1, n + 1):
                comp = lab == i
                if (comp & touch).any():
                    keep |= comp
            if not keep.any():
                print(os.path.basename(p), "no gap")
                continue
            # sample colours from the hat's inside (eroded past its own dark outline), not the outline itself
            inner = ndi.binary_erosion(hat, iterations=8)
            if not inner.any():
                inner = hat
            _, (iy, ix) = ndi.distance_transform_edt(~inner, return_indices=True)
            fill = im[iy, ix]
            im[keep] = fill[keep]
            im[keep, 3] = 255
            new = hat | keep
            edge = new & ~ndi.binary_erosion(new, iterations=3)
            outline = edge & keep
            im[outline, :3] = (28, 24, 32)
            Image.fromarray(im).save(p)
            print(os.path.basename(p), "filled", int(keep.sum()), "px")
