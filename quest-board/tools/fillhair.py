"""Close the arm-shaped holes a generator leaves in long hair.

  fillhair.py <bodies.json> <body> <view> <layer.png>

Hair traced around a template's arms has holes that show when the arm moves.
Inside each arm's reach, gaps with hair beside them are filled from the nearest
hair, sampled from well inside the mass so the old outline doesn't get copied in.
"""
import json
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

bodies, body, view, path = sys.argv[1:5]
joints = json.load(open(bodies))[body][view]["joints"]
SCALE = 4  # masks are worked out small: this is about shape, not detail

im = np.asarray(Image.open(path).convert("RGBA"), float) / 255
rgb, alpha = im[..., :3], im[..., 3]
H, W = alpha.shape
yy, xx = np.mgrid[0:H, 0:W]


def capsule(a, b, r):
    vx, vy = b[0] - a[0], b[1] - a[1]
    t = np.clip(((xx - a[0]) * vx + (yy - a[1]) * vy) / max(vx * vx + vy * vy, 1), 0, 1)
    return np.hypot(xx - a[0] - vx * t, yy - a[1] - vy * t) < r


zone = np.zeros((H, W), bool)
for side in "NF":
    chain = [joints["shoulder" + side], joints["elbow" + side], joints["wrist" + side], joints["hand" + side]]
    for a, b in zip(chain, chain[1:]):
        zone |= capsule(a, b, 125)
zone &= ~capsule(joints["headC"], joints["headC"], 470)

solid = alpha > 0.5
small = solid[::SCALE, ::SCALE]
closed = ndi.binary_closing(np.pad(small, 40), iterations=30)[40:-40, 40:-40]
closed = np.kron(closed, np.ones((SCALE, SCALE), bool))[:H, :W]
# A rim of the old outline goes too, so the fill meets clean hair on every side.
fill = closed & zone
fill = ndi.binary_dilation(fill & ~solid, iterations=16) & zone

source = ndi.binary_erosion(solid & ~fill, iterations=14)
idx = ndi.distance_transform_edt(~source, return_distances=False, return_indices=True)
sampled = rgb[idx[0], idx[1]]
# Vertical blur reads as falling strands rather than radial smears.
sampled = ndi.gaussian_filter(sampled, sigma=(22, 2, 0))

edge = np.clip(ndi.gaussian_filter(fill.astype(float), 2.0) * 1.4, 0, 1)
out_rgb = rgb * (1 - edge[..., None]) + sampled * edge[..., None]
out_a = np.maximum(alpha, edge)
Image.fromarray((np.dstack([out_rgb, out_a]).clip(0, 1) * 255).astype("uint8")).save(path)
print(path.rsplit("/", 1)[-1], "filled px", int(fill.sum()))
