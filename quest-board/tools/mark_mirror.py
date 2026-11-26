"""Move a face mark to the other eye (ROOMS 2026-11-25; Cal via LEAD: "put all the scar options on the other eye since the
tattoos are on the same side as the scars which cover them up").

  mark_mirror.py <src dir> <out dir> <mark id> [...]

The front face is a three-quarter view, so the far eye is narrower than the near one. Each mark is mirrored about the eyes and
squeezed by the eye-width ratio: a point at the near eye's centre lands on the far eye's centre, and a point d px outside the
near eye lands d*k px outside the far eye (k = far eye width / near eye width). Eye boxes come from <b>_faceclosed_front.webp
(brows, eyes, nose, mouth are its separate parts; the eyes are the second row of parts).
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
APP = os.path.join(ROOT, "art", "app")


def eyes(b):
    a = np.asarray(Image.open(os.path.join(APP, "%s_faceclosed_front.webp" % b)).convert("RGBA"))[..., 3] > 40
    lab, n = ndi.label(a, structure=np.ones((3, 3)))
    parts = [(sl[0].start, sl[1].start, sl[1].stop, (lab[sl] == i + 1).sum()) for i, sl in enumerate(ndi.find_objects(lab))]
    parts = [p for p in parts if p[3] > 500]
    parts.sort()
    eye = sorted(parts[2:4], key=lambda p: p[1])  # brows first (top), then the two eyes
    (_, a0, a1, _), (_, b0, b1, _) = eye
    return (a0 + a1) / 2, (b0 + b1) / 2, (b1 - b0) / (a1 - a0)


def main():
    src, out, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
    for b in "mf":
        ca, cb, k = eyes(b)
        for mid in ids:
            im = Image.open(os.path.join(src, "%s_mark_%s_front.webp" % (b, mid))).convert("RGBA")
            # output x' = cb - (x - ca) * k  <=>  x = ca + (cb - x') / k
            m = im.transform(im.size, Image.AFFINE, (-1 / k, 0, ca + cb / k, 0, 1, 0), resample=Image.BICUBIC)
            p = os.path.join(out, "%s_mark_%s_front.webp" % (b, mid))
            m.save(p, "WEBP", quality=92, alpha_quality=95, method=6)
            al = np.asarray(m)[..., 3]
            ys, xs = np.nonzero(al > 30)
            print(b, mid, "eyes %.0f -> %.0f k %.2f" % (ca, cb, k), "new box", xs.min(), ys.min(), xs.max(), ys.max())


if __name__ == "__main__":
    main()
