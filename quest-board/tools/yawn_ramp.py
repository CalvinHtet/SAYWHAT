"""Make a painted-pose layer of a starter top (creator.json: tee, hoodie, bomber) ready for the colour ramp.

  yawn_ramp.py <art dir> <id> [<pose>]       e.g. yawn_ramp.py art/app tee      (pose defaults to yawn)

Starter tops are neutral grey art that the rig recolours with a three-tone ramp (white, grey, black: clothColors a/b/c),
and a painted layer goes through the same ramp. So the painting (cut as usual with yawn_cut.py item) is turned to grey
and its brightness is matched, percentile by percentile, to the top's own <m|f>_<id>_front.webp, so every colour comes
out as it does on the rest-pose art. Rewrites <m|f>_<id>_<pose>.webp in place.
"""
import sys

import numpy as np
from PIL import Image


def lum(rgb):
    return rgb[..., 0] * 0.299 + rgb[..., 1] * 0.587 + rgb[..., 2] * 0.114


def main():
    d, top = sys.argv[1:3]
    pose = sys.argv[3] if len(sys.argv) > 3 else "yawn"
    for body in ("m", "f"):
        ref = np.asarray(Image.open("%s/%s_%s_front.webp" % (d, body, top)).convert("RGBA")).astype(float)
        path = "%s/%s_%s_%s.webp" % (d, body, top, pose)
        lay = np.asarray(Image.open(path).convert("RGBA")).astype(float)
        rl = lum(ref[..., :3])[ref[..., 3] > 128]
        ll = lum(lay[..., :3])
        src = ll[lay[..., 3] > 128]
        q = np.linspace(0, 100, 101)
        mapped = np.interp(ll, np.percentile(src, q), np.percentile(rl, q))
        out = np.dstack([mapped, mapped, mapped, lay[..., 3]]).clip(0, 255).astype(np.uint8)
        Image.fromarray(out).save(path, quality=90, method=6)
        print(path, "brightness 5/50/95%%: %s -> %s" % (np.percentile(src, [5, 50, 95]).round(), np.percentile(rl, [5, 50, 95]).round()))


if __name__ == "__main__":
    main()
