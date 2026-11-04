"""Remove short stray ticks from the edge of item art.

  detick.py <layer.png> [...]

Generated sheets leave small spikes where a shape meets the template's corners. A tick is
thin, short, and joined to the art at one spot; laces, straps and chains are longer or join
at both ends, so they stay.
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ni

THICK, MAX_LONG = 5, 46
for path in sys.argv[1:]:
    im = np.asarray(Image.open(path).convert("RGBA")).copy()
    solid = im[..., 3] > 30
    core = ni.binary_opening(solid, ni.generate_binary_structure(2, 2), iterations=THICK)
    near = ni.binary_dilation(core, iterations=2)
    rest, n = ni.label(solid & ~near, structure=np.ones((3, 3)))
    gone = 0
    for i, box in enumerate(ni.find_objects(rest), 1):
        h, w = box[0].stop - box[0].start, box[1].stop - box[1].start
        if max(h, w) > MAX_LONG:
            continue
        y0, y1 = max(0, box[0].start - 3), box[0].stop + 3
        x0, x1 = max(0, box[1].start - 3), box[1].stop + 3
        area = rest[y0:y1, x0:x1] == i
        contact, joins = ni.label(ni.binary_dilation(area, iterations=2) & near[y0:y1, x0:x1], structure=np.ones((3, 3)))
        if joins > 1:
            continue
        im[y0:y1, x0:x1, 3][area] = 0
        gone += 1
    Image.fromarray(im, "RGBA").save(path)
    print(path.split("/")[-1], "ticks", gone)
