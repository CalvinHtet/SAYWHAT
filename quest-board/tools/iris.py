"""Finish a face layer: add a soft blush and split out the iris.

  iris.py <face.png> [iris_out.png smile_donor_face.png blush_out.png]

Faces are generated as linework only. The two shapes with the most dark linework
are the eyes. A soft blush goes under each one on its own layer, so it follows the
skin tone at runtime and can never merge with the eye. Warm mid-tones inside the
eyes become a neutral iris layer; pupils, lashes and highlights stay in the face.
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

BLUSH = np.array([246, 150, 150]) / 255

path = sys.argv[1]
face = np.asarray(Image.open(path).convert("RGBA"), float) / 255
rgb, alpha = face[..., :3], face[..., 3]
lum = rgb @ np.array([0.299, 0.587, 0.114])

solid = alpha > 0.5
labels, n = ndi.label(solid)
ids = list(range(1, n + 1))
dark = ndi.sum(solid & (lum < 0.3), labels, ids)
top = [i for _, i in sorted(zip(dark, ids))[-2:]]
eyes = np.isin(labels, top)

soft = np.zeros(alpha.shape)
for i in top:
    ys, xs = np.nonzero(labels == i)
    cx, h, w = xs.mean(), ys.max() - ys.min(), xs.max() - xs.min()
    # Closed eyes are short arcs, so size the cheek from the eye's width.
    cy = ys.max() + max(h * 0.25, w * 0.32)
    yy, xx = np.ogrid[: alpha.shape[0], : alpha.shape[1]]
    soft += np.exp(-(((xx - cx) / (w * 0.42)) ** 2 + ((yy - cy) / (w * 0.2)) ** 2))
soft = np.clip(soft, 0, 1) * 0.5


def find_mouth(lab, ids_, eye_ids):
    """The smile is the widest mark below the eyes."""
    bottom = max(np.nonzero(lab == i)[0].max() for i in eye_ids)
    below = [(np.ptp(np.nonzero(lab == i)[1]), i) for i in ids_ if i not in eye_ids and np.nonzero(lab == i)[0].min() > bottom]
    return lab == max(below)[1] if below else None


# A donor face from the same sheet can lend its smile when this one drew it too small.
smile = find_mouth(labels, ids, top)
if len(sys.argv) > 3 and smile is not None:
    alpha = alpha * ~ndi.binary_dilation(smile, iterations=3)
    donor = np.asarray(Image.open(sys.argv[3]).convert("RGBA"), float)[..., 3] / 255
    dlabels, dn = ndi.label(donor > 0.5)
    dids = list(range(1, dn + 1))
    # The donor is already finished: its blush is soft, so only its marks remain solid.
    dsize = ndi.sum(donor > 0.5, dlabels, dids)
    dtop = [i for _, i in sorted(zip(dsize, dids))[-2:]]
    smile = find_mouth(dlabels, dids, dtop)
if smile is not None:
    thick = np.clip(ndi.gaussian_filter(ndi.binary_dilation(smile, iterations=4).astype(float), 1.4) * 1.3, 0, 1)
    rgb = np.where((thick > alpha)[..., None], np.array([92, 44, 44]) / 255, rgb)
    alpha = np.maximum(alpha, thick)
    print(path.rsplit("/", 1)[-1], "smile width", int(np.ptp(np.nonzero(smile)[1])))

Image.fromarray((np.dstack([rgb, alpha]).clip(0, 1) * 255).astype("uint8")).save(path)
if len(sys.argv) > 4:
    blush = np.dstack([np.broadcast_to(BLUSH, rgb.shape), soft])
    Image.fromarray((blush.clip(0, 1) * 255).astype("uint8")).save(sys.argv[4])

if len(sys.argv) > 2:
    filled = ndi.binary_fill_holes(eyes)
    maxc, minc = rgb.max(axis=2), rgb.min(axis=2)
    sat = (maxc - minc) / np.maximum(maxc, 1e-4)
    iris = filled & (rgb[..., 0] >= rgb[..., 2]) & (sat > 0.12) & (lum > 0.13) & (lum < 0.82)
    iris = ndi.binary_opening(iris, iterations=1)
    edge = np.clip(ndi.gaussian_filter(iris.astype(float), 1.0), 0, 1)
    grey = np.clip(lum, 0, 1)
    Image.fromarray((np.dstack([grey, grey, grey, edge * alpha]) * 255).astype("uint8")).save(sys.argv[2])
    ys, xs = np.nonzero(iris)
    print(sys.argv[2].rsplit("/", 1)[-1], "iris bbox", (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())) if len(xs) else None)
