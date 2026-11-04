"""Back a mesh panel with solid cloth, so a head never shows through a hat.

  fill_mesh.py <layer.png> [...]

Generated mesh comes out with its gaps keyed away with the template colour. Everything
inside the hat's outline is filled and given a fine lattice, except a strap opening.
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ni

BASE, LINE = (216, 150, 182), (178, 104, 146)
SPACING, WIDTH = 30, 5
for path in sys.argv[1:]:
    im = np.asarray(Image.open(path).convert("RGBA")).astype(float)
    solid = im[..., 3] > 40
    inside = ni.binary_fill_holes(solid)
    holes, n = ni.label(inside & ~solid)
    ys, xs = np.nonzero(solid)
    top, height = ys.min(), ys.max() - ys.min()
    for i, box in enumerate(ni.find_objects(holes), 1):
        area = (holes[box] == i).sum()
        # A strap opening is a large hole in the lower half; a mesh window starts up high.
        if box[0].start > top + 0.55 * height and area > 0.004 * inside.sum():
            inside[holes == i] = False
    yy, xx = np.mgrid[0:im.shape[0], 0:im.shape[1]]
    lattice = ((xx + yy) % SPACING < WIDTH) | ((xx - yy) % SPACING < WIDTH)
    fill = np.where(lattice[..., None], LINE, BASE)
    a = im[..., 3:] / 255
    rgb = im[..., :3] * a + fill * (1 - a)
    # The template's green can stain the mesh yellow; shift those pixels back to the cloth.
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    stained = inside & (g > 0.9 * r) & ((r - b > 12) | (g - b > 12))
    light = (rgb @ [0.299, 0.587, 0.114]) / (np.array(BASE) @ [0.299, 0.587, 0.114])
    rgb = np.where(stained[..., None], np.clip(np.array(BASE) * light[..., None], 0, 255), rgb)
    out = np.where(inside[..., None], np.dstack([rgb, np.full(a.shape, 255.0)]), im)
    Image.fromarray(out.round().astype("uint8"), "RGBA").save(path)
    print(path.split("/")[-1], "holes", n)
