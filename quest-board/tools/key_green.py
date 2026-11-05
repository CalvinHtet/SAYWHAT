"""Key a painting off its flat green background and save it at a given size as a game webp.

  key_green.py <in.png> <out.webp> <width> <height>

Green becomes transparent with a soft edge, green spill on the edge is pulled back to neutral, and the result is resized
(non-uniformly if the size asks for it, which is how a 1:1 painting is matched to a room frame that is not quite square).
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def key(im):
    a = np.asarray(im.convert("RGB")).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    green = np.clip((g - np.maximum(r, b) - 40) / 60, 0, 1)
    alpha = ndi.median_filter(1 - green, 3)
    a[..., 1] = np.minimum(g, np.maximum(r, b) + 12)
    return Image.fromarray(np.dstack([a.astype(np.uint8), (alpha * 255).astype(np.uint8)]))


def main():
    src, out, w, h = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    im = key(Image.open(src)).resize((w, h), Image.LANCZOS)
    im.save(out, quality=88, method=6)
    print(out, im.size, im.getbbox())


if __name__ == "__main__":
    main()
