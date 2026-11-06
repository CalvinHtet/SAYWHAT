"""Split a side-by-side pair (man on the left, woman on the right) into two portrait pictures.

  split_pair.py <in.png> <out_prefix> <width> <height>

Writes <out_prefix>_m.webp and <out_prefix>_f.webp. Each half is cut 10 px clear of the middle (generators often leave a
thin divider there) and a few px off the outer edges, then cropped to the target shape around its centre and scaled.
"""
import sys

from PIL import Image


def main():
    src, pre, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    im = Image.open(src).convert("RGB")
    w, h = im.size
    m = 10 * w // 2048 + 10
    e = m // 2  # and a little off the outer edges, which can carry a light rim too
    for k, box in (("m", (e, e, w // 2 - m, h - e)), ("f", (w // 2 + m, e, w - e, h - e))):
        half = im.crop(box)
        hw, hh = half.size
        r = W / H
        if hw / hh > r:
            nw = int(hh * r)
            half = half.crop(((hw - nw) // 2, 0, (hw - nw) // 2 + nw, hh))
        else:
            nh = int(hw / r)
            half = half.crop((0, (hh - nh) // 2, hw, (hh - nh) // 2 + nh))
        out = "%s_%s.webp" % (pre, k)
        half.resize((W, H), Image.LANCZOS).save(out, quality=86, method=6)
        print(out)


if __name__ == "__main__":
    main()
