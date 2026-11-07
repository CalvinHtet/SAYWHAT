"""Cut a painted-pose sheet (both bodies side by side, 16:9) into the rig's two frame-sized layers.

  yawn_cut.py body <sheet.png> <template_body.png> <out_dir> [<name>]
  yawn_cut.py item <sheet.png> <template_body.png> <out_dir> <id> [--pastel]

--pastel keys only low-green magenta, for garments with pink highlights the default key would thin and grey (cr_trench).
--regreen turns a light grey background (the generator sometimes keeps the design's) into green before keying (cr_mesh).

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


def key(rgb, magenta, pastel=False):
    a = rgb.astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    green = np.clip((g - np.maximum(r, b) - 30) / 60, 0, 1)
    alpha = 1 - green
    if magenta:
        mag = np.clip((np.minimum(r, b) - g - 60) / 60, 0, 1)
        if pastel:
            # garments with pink highlights (holographic, candy): the mannequin's flat magenta and its dark outline both have
            # little green, a pastel pink has plenty, so only low-green magenta is keyed (fades out between g 70 and 100)
            mag = mag * np.clip((100 - g) / 30, 0, 1)
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


def regreen(rgb):
    """For a sheet painted on the design's light grey instead of green: flood the border-connected background to pure green,
    and fade its light, unsaturated antialias ring (3 px) toward green so no pale halo survives the key."""
    from scipy import ndimage as ndi
    im = rgb.astype(float)
    bg = np.median(np.concatenate([im[:20].reshape(-1, 3), im[-20:].reshape(-1, 3)]), axis=0)
    lab, _ = ndi.label(np.abs(im - bg).max(-1) < 28)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    mask = np.isin(lab, list(edge))
    mx, mn = im.max(-1), im.min(-1)
    ring = ndi.binary_dilation(mask, iterations=3) & ~mask & (mx > 120) & ((mx - mn) < 40)
    t = np.clip((mx - 90) / 120, 0, 1)[..., None]
    green = np.array([0.0, 255.0, 0.0])
    im[mask] = green
    im[ring] = im[ring] * (1 - t[ring]) + green * t[ring]
    return im.astype(np.uint8)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    pastel = "--pastel" in sys.argv
    mode, sheet, tmpl, out_dir = args[:4]
    name = args[4] if len(args) > 4 else "base"
    im = Image.open(sheet).convert("RGB").resize((FW * 2 + 2 * PAD, FH), Image.LANCZOS)
    im = im.crop((PAD, 0, PAD + FW * 2, FH))
    src = np.asarray(im)
    if "--regreen" in sys.argv:
        src = regreen(src)
    rgb, alpha = key(src, mode == "item", pastel)
    t = np.asarray(Image.open(tmpl).convert("RGBA"))[..., 3] > 40
    for i, body in enumerate(("m", "f")):
        sl = slice(i * FW, (i + 1) * FW)
        a, tm = alpha[:, sl], t[:, sl]
        if mode == "body":
            ys, xs = np.nonzero(a > 128)
            yt, xt = np.nonzero(tm)
            print(body, "silhouette drift (px at 4x): left %d right %d top %d bottom %d" % (xs.min() - xt.min(), xs.max() - xt.max(), ys.min() - yt.min(), ys.max() - yt.max()))
        else:
            # the generator keeps a faint trace of the mannequin's outline: thin lines that survive keying. Keep only what is
            # thick enough to be cloth (survives an opening), plus a margin for the garment's own edges and drawstrings.
            solid = ndi.binary_opening(a > 60, iterations=6)
            keep = ndi.gaussian_filter(ndi.binary_dilation(solid, iterations=8).astype(float), 1.5)
            a = (a * keep).astype(np.uint8)
            inside = (a > 128) & tm
            print(body, "garment px %d, share on the body %.0f%%" % ((a > 128).sum(), 100 * inside.sum() / max(1, (a > 128).sum())))
        layer = Image.fromarray(np.dstack([rgb[:, sl], a]).astype(np.uint8), "RGBA").resize(OUT, Image.LANCZOS)
        path = "%s/%s_%s_yawn.webp" % (out_dir, body, name)
        layer.save(path, quality=90, method=6)
        print(path, layer.size)


if __name__ == "__main__":
    main()
