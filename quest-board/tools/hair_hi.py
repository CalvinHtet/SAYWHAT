"""Highlight streak layers for a hairstyle (Cal 2026-11-23: "allow for highlights in the hair as well"; ROOMS).

  hair_hi.py <sheet.png> <body:style> [...]      e.g. hair_hi.py hi_h1.png m:h1 f:h1     (2x2 sheet: m front, m back, f front, f back)
                                                       hair_hi.py hi_h4.png m:h4                (2-view sheet: front, back)

The sheet is that style's own hair sheet, repainted by Higgsfield with a few strand-following streaks in flat pure cyan and
nothing else changed (checked: same place to the pixel, every streak inside the hair). The cyan is the streak mask: softened,
widened a touch, kept inside the hair layer, and painted in the hair's own grey texture lifted into the light end of the ramp,
so the rig's tint shows the highlight colour's light tones and the strand shading still reads. Writes art/layers/<b>_<style>hi_<view>.png
and the packed art/app/<b>_<style>hi_<view>.webp. Transparent everywhere else.
"""
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
GROW = 2  # px at layer size: the generator's streaks are a hair thinner than a strand


def main():
    sheet, specs = sys.argv[1], sys.argv[2:]
    views = [(b, s, v) for b, s in (x.split(":") for x in specs) for v in ("front", "back")]
    tmp = tempfile.mkdtemp()
    outs = [os.path.join(tmp, "%s_%s_%s.png" % x) for x in views]
    subprocess.check_call([sys.executable, "-W", "ignore", "-I", os.path.join(HERE, "sheet2v.py"), "split", sheet] + outs)
    lay_tmp = tempfile.mkdtemp()
    for (b, s, v), o in zip(views, outs):
        im = np.asarray(Image.open(o).convert("RGB")).astype(float) / 255
        r, g, bl = im[..., 0], im[..., 1], im[..., 2]
        cyan = np.clip((np.minimum(g, bl) - r - .15) / .3, 0, 1) * (np.abs(g - bl) < .3)
        cyan = np.maximum(cyan, ndi.grey_dilation(cyan, size=(2 * GROW + 1, 2 * GROW + 1)) * .85)
        hair = np.asarray(Image.open(os.path.join(ROOT, "art", "layers", "%s_%s_%s.png" % (b, s, v))).convert("RGBA")).astype(float) / 255
        a = cyan * hair[..., 3]
        l = hair[..., :3] @ [.299, .587, .114]
        lo, hi = np.percentile(l[hair[..., 3] > .5], [5, 95])
        t = np.clip((l - lo) / max(1e-3, hi - lo), 0, 1)
        grey = .62 + .33 * t  # the light end of the ramp, keeping the strand texture
        out = np.dstack([grey, grey, grey, a])
        name = "%s_%shi_%s" % (b, s, v)
        Image.fromarray((out * 255 + .5).astype(np.uint8)).save(os.path.join(ROOT, "art", "layers", name + ".png"))
        Image.fromarray((out * 255 + .5).astype(np.uint8)).save(os.path.join(lay_tmp, name + ".png"))
        print(name, "streak px", int((a > .5).sum()), "of hair", int((hair[..., 3] > .5).sum()))
    subprocess.check_call([sys.executable, os.path.join(HERE, "pack.py"), lay_tmp, os.path.join(ROOT, "art", "app")])


if __name__ == "__main__":
    main()
