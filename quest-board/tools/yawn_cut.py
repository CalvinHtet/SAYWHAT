"""Cut a painted-pose sheet (both bodies side by side, 16:9) into the rig's two frame-sized layers.

  yawn_cut.py body <sheet.png> <template_body.png> <out_dir> [<name>]
  yawn_cut.py item <sheet.png> <template_body.png> <out_dir> <id>

The sheet was painted over a template from rigtest/template.html (?pose=stretch&scale=4: 2880x1656, man left, woman right)
padded 32 px each side to 2944x1656 for the generator's 16:9. It is scaled back to that, unpadded and split.

  body   keeps everything that is not green: <m|f>_base_yawn.webp
  item   the garment was painted on a flat magenta mannequin: keeps what is neither green nor magenta: <m|f>_<id>_yawn.webp

Layers are saved at 2x the rig frame (720x828), which the rig stretches to its frame. Prints how far each painted silhouette
sits from the template's, so a sheet that drifted is caught before anyone sees it.
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

PAD, FW, FH, OUT = 32, 1440, 1656, (720, 828)


def key(rgb, magenta):
    a = rgb.astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    green = np.clip((g - np.maximum(r, b) - 30) / 60, 0, 1)
    alpha = 1 - green
    if magenta:
        mag = np.clip((np.minimum(r, b) - g - 60) / 60, 0, 1)
        alpha = alpha * (1 - mag)
    out = a.copy()
    # despill: green fringe pulled back to neutral
    out[..., 1] = np.minimum(g, np.maximum(r, b) + 10)
    if magenta:
        lim = g + 25
        out[..., 0] = np.where(mag > 0.05, np.minimum(r, lim), r)
        out[..., 2] = np.where(mag > 0.05, np.minimum(b, lim), b)
    alpha = ndi.median_filter(alpha, 3)
    return out.astype(np.uint8), (alpha * 255).astype(np.uint8)


def main():
    mode, sheet, tmpl, out_dir = sys.argv[1:5]
    name = sys.argv[5] if len(sys.argv) > 5 else "base"
    im = Image.open(sheet).convert("RGB").resize((FW * 2 + 2 * PAD, FH), Image.LANCZOS)
    im = im.crop((PAD, 0, PAD + FW * 2, FH))
    rgb, alpha = key(np.asarray(im), mode == "item")
    t = np.asarray(Image.open(tmpl).convert("RGBA"))[..., 3] > 40
    for i, body in enumerate(("m", "f")):
        sl = slice(i * FW, (i + 1) * FW)
        a, tm = alpha[:, sl], t[:, sl]
        if mode == "body":
            ys, xs = np.nonzero(a > 128)
            yt, xt = np.nonzero(tm)
            print(body, "silhouette drift (px at 4x): left %d right %d top %d bottom %d" % (xs.min() - xt.min(), xs.max() - xt.max(), ys.min() - yt.min(), ys.max() - yt.max()))
        else:
            inside = (a > 128) & tm
            print(body, "garment px %d, share on the body %.0f%%" % ((a > 128).sum(), 100 * inside.sum() / max(1, (a > 128).sum())))
        layer = Image.fromarray(np.dstack([rgb[:, sl], a]).astype(np.uint8), "RGBA").resize(OUT, Image.LANCZOS)
        path = "%s/%s_%s_yawn.webp" % (out_dir, body, name)
        layer.save(path, quality=90, method=6)
        print(path, layer.size)


if __name__ == "__main__":
    main()
