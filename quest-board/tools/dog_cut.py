"""Cut a painted dog sheet (four poses on flat green) into the room's dog frames.

  dog_cut.py <sheet.png> <name> [<stand height px>]

Finds the four dogs, orders them stand, walk, sit, sleep (reading order: a 2x2 grid or one row), keys out the green and
saves art/app/dgx_<name>_<0..3>.webp, all four at one scale so the standing frame is <stand height> px tall (default 300).
Adds them to data/rsart.json. 20_loft.js (lfDogSpr) draws them; without them rooms keep the pixel dog.
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
    out[..., 1] = np.minimum(g, np.maximum(r, b) + 10)  # despill
    alpha = ndi.median_filter(1 - green, 3)
    return out.astype(np.uint8), alpha


def main():
    sheet, name = sys.argv[1], sys.argv[2]
    th = int(sys.argv[3]) if len(sys.argv) > 3 else 300
    rgb, alpha = key(np.asarray(Image.open(sheet).convert("RGB")))
    solid = alpha > .5
    lab, n = ndi.label(ndi.binary_dilation(solid, iterations=6))
    sizes = ndi.sum(solid, lab, range(1, n + 1))
    keep = [i + 1 for i in np.argsort(sizes)[::-1][:4]]
    sl = ndi.find_objects(lab)
    # a loose ear tip or tail wisp is its own component: it joins the dog whose box (plus a margin) holds its centre
    for j in range(1, n + 1):
        if j in keep or sizes[j - 1] < 40:
            continue
        cy, cx = [(s.start + s.stop) / 2 for s in sl[j - 1]]
        for k in keep:
            ys, xs = sl[k - 1]
            if ys.start - 60 <= cy <= ys.stop + 60 and xs.start - 60 <= cx <= xs.stop + 60:
                lab[lab == j] = k
                break
    boxes = []
    for k in keep:
        m = (lab == k) & (alpha > .04)
        ys, xs = np.nonzero(m)
        boxes.append((ys.min(), xs.min(), ys.max() + 1, xs.max() + 1, k))
    order = sorted(boxes, key=lambda b: b[1])
    # one row unless two dogs share most of a column (a 2x2 grid; a tail overlapping the next dog does not count); a low sleeping dog is still in the row
    if any(order[i][3] - order[i + 1][1] > .5 * min(order[i][3] - order[i][1], order[i + 1][3] - order[i + 1][1]) for i in range(3)):
        rows = sorted(boxes, key=lambda b: (b[0] + b[2]) / 2)
        order = sorted(rows[:2], key=lambda b: b[1]) + sorted(rows[2:], key=lambda b: b[1])
    k = th / (order[0][2] - order[0][0])
    data_p = os.path.join(ROOT, "data", "rsart.json")
    rs = json.load(open(data_p))
    for i, (y0, x0, y1, x1, lk) in enumerate(order):
        a = np.where(lab[y0:y1, x0:x1] == lk, alpha[y0:y1, x0:x1], 0)
        im = Image.fromarray(np.dstack([rgb[y0:y1, x0:x1], (a * 255).astype(np.uint8)]), "RGBA")
        im = im.resize((max(1, round((x1 - x0) * k)), max(1, round((y1 - y0) * k))), Image.LANCZOS)
        nm = "dgx_%s_%d" % (name, i)
        im.save(os.path.join(ROOT, "art", "app", nm + ".webp"), quality=90, method=6)
        rs[nm] = {"h": im.size[1], "w": im.size[0]}
        print(nm, im.size)
    json.dump(dict(sorted(rs.items())), open(data_p, "w"), indent=0)


if __name__ == "__main__":
    main()
