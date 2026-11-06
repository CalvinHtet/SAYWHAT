"""Cut a dressed display stand into a bare stand plus one layer per piece, all the same size, so the game can stack
whichever pieces the player owns, in any order.

  trophy_layers.py <dressed.png> <bare.png> <out_prefix> <height> <regions.json> [sheet.png]

dressed: the stand wearing every piece. bare: the same stand with nothing on it (an edit of the dressed picture). Both
on flat magenta. The bare picture is lined up to the dressed one by the plinth (its width and its bottom), since the
generator moves things a little when it edits.

regions.json: {"draw": ["greaves", ...], "pieces": {"helm": [[x, y], ...], ...}} with each piece's rough outline as
fractions of the dressed picture. Where outlines overlap, the piece listed LAST in "draw" (drawn on top) keeps the
pixels. A piece's layer holds only dressed pixels inside its outline that are not plain wood and differ from the bare
stand. With "nowood": true it also leaves out plain wood, for a bare stand that does not line up with the dressed one.

Writes <out_prefix>.webp (the bare stand) and <out_prefix>_<piece>.webp, all cropped to one box and scaled to <height>.
With sheet.png, also draws every combination (2^pieces) side by side to check them.
"""
import itertools
import json
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi


def key(im, tol=60):
    """alpha for a picture on flat magenta, plus the despilled colours"""
    border = np.concatenate([im[:8].reshape(-1, 3), im[-8:].reshape(-1, 3), im[:, :8].reshape(-1, 3), im[:, -8:].reshape(-1, 3)])
    bg = np.median(border, 0)
    d = np.sqrt(((im - bg) ** 2).sum(-1))
    lab, _ = ndi.label(d < tol)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bgm = ndi.binary_opening(np.isin(lab, list(edge)), iterations=1)
    rim = ndi.binary_dilation(bgm, iterations=3) & ~bgm
    alpha = np.where(bgm, 0.0, 1.0)
    alpha = np.where(rim, np.clip((d - tol * .45) / (tol * .8), 0, 1), alpha)
    # magenta leaning pixels (R and B well over G) fade out too
    lean = np.minimum(im[..., 0], im[..., 2]) - im[..., 1]
    alpha *= 1 - np.clip((lean - 45) / 30, 0, 1)
    alpha = ndi.gaussian_filter(alpha, .7)
    out = im.copy()
    spill = ndi.binary_dilation(rim, iterations=5)
    for k in (0, 2):
        out[..., k] = np.where(spill, np.minimum(out[..., k], out[..., 1] + 10), out[..., k])
    # the clear backdrop takes the outline's dark colour, so resizing never bleeds magenta into the edge
    out[alpha < .5] = (38, 30, 28)
    return out, alpha


def plinth(alpha):
    """left, right and bottom of the plinth: the widest rows in the bottom fifth"""
    ys = np.where(alpha.max(1) > .5)[0]
    y0, y1 = ys[0], ys[-1]
    xs = [np.where(alpha[y] > .5)[0] for y in range(int(y1 - (y1 - y0) * .2), y1 + 1)]
    left = np.percentile([x[0] for x in xs if len(x)], 5)
    right = np.percentile([x[-1] for x in xs if len(x)], 95)
    return left, right, y1


def woodish(im):
    """dark brown wood, as opposed to grey iron, gold, green gems and the grey stone"""
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    sat = im.max(-1) - im.min(-1)
    return np.clip(((r - b) - 14) / 14, 0, 1) * np.clip((150 - im.max(-1)) / 30, 0, 1) * np.clip((sat - 18) / 10, 0, 1) \
        * np.clip((r - g + 4) / 8, 0, 1) * np.clip(1 - ((r - g) - 45) / 20, 0, 1)


def main():
    a = sys.argv[1:]
    dressed, bare, prefix, H, regions = a[0], a[1], a[2], int(a[3]), json.load(open(a[4]))
    sheet = a[5] if len(a) > 5 else None
    F = np.asarray(Image.open(dressed).convert("RGB")).astype(float)
    h, w = F.shape[:2]
    Fc, Fa = key(F)
    fl, fr, fb = plinth(Fa)

    def aligned(path, label):
        """another picture of the stand, keyed and lined up with the dressed one by the plinth"""
        c0, a0 = key(np.asarray(Image.open(path).convert("RGB").resize((w, h), Image.LANCZOS)).astype(float))
        bl, br, bb = plinth(a0)
        s = (fr - fl) / (br - bl)
        tx, ty = fl - bl * s, fb - bb * s
        print("%s: scale %.4f, shift %.1f, %.1f px" % (label, s, tx, ty))
        q = Image.fromarray(np.dstack([c0, a0 * 255]).clip(0, 255).astype(np.uint8))
        q = np.asarray(q.transform((w, h), Image.AFFINE, (1 / s, 0, -tx / s, 0, 1 / s, -ty / s), Image.BICUBIC)).astype(float)
        return q[..., :3], q[..., 3] / 255

    def differ(c1, a1, c0, a0):
        d = np.sqrt(((c1 - c0) ** 2).sum(-1)) * a0 + 255 * (1 - a0)
        return np.clip((ndi.gaussian_filter(d, 1.5) - 28) / 30, 0, 1) * a1

    Bc, Ba = aligned(bare, "bare stand")
    # each piece: inside its outline, not wood, and not the same as the bare stand there
    # wood that only the dressed picture shows (a face behind a visor) belongs to the piece too, unless asked: nowood
    armour = differ(Fc, Fa, Bc, Ba) * (np.clip(1 - woodish(Fc), 0, 1) if regions.get("nowood") else 1)
    order = regions["draw"]
    # "own": {"sword": "with_sword.png"}: a piece the dressed picture leaves out, painted in its own picture of the
    # dressed stand; its layer is whatever that picture adds, and it claims nothing from the other pieces
    own = regions.get("own", {})
    taken = np.zeros((h, w), bool)
    layers, colour, extra = {}, {}, [Fa, Ba]
    for name in reversed(order):  # the top piece claims overlaps first
        m = Image.new("L", (w, h), 0)
        ImageDraw.Draw(m).polygon([(x * w, y * h) for x, y in regions["pieces"][name]], fill=255)
        inside = np.asarray(m) > 127
        if name in own:
            Oc, Oa = aligned(own[name], name)
            src, c = differ(Oc, Oa, Fc, Fa), Oc
            extra.append(Oa)
        else:
            inside &= ~taken
            taken |= inside
            src, c = armour, Fc
        soft = ndi.gaussian_filter(inside.astype(float), 2)
        al = ndi.gaussian_filter(src, .6) * soft
        layers[name], colour[name] = np.where(al > .9, 1, al), c
    box = Image.fromarray((np.max(extra, 0) * 255).astype(np.uint8)).getbbox()
    W2 = round((box[2] - box[0]) * H / (box[3] - box[1]))
    out = lambda c, al: Image.fromarray(np.dstack([c, al * 255]).clip(0, 255).astype(np.uint8)).crop(box).resize((W2, H), Image.LANCZOS)
    imgs = {"": out(Bc, Ba)}
    imgs[""].save(prefix + ".webp", quality=88, method=6)
    for name in order:
        imgs[name] = out(colour[name], layers[name])
        imgs[name].save(prefix + "_" + name + ".webp", quality=88, method=6)
    print(prefix, (W2, H), "pieces", order)
    if sheet:
        combos = [c for n in range(len(order) + 1) for c in itertools.combinations(order, n)]
        cols = 8
        S = Image.new("RGB", (cols * W2, -(-len(combos) // cols) * (H + 18)), (24, 22, 34))
        d = ImageDraw.Draw(S)
        for i, c in enumerate(combos):
            t = imgs[""].copy()
            for name in order:
                if name in c:
                    t.alpha_composite(imgs[name])
            x, y = (i % cols) * W2, (i // cols) * (H + 18)
            S.paste(t, (x, y + 18), t)
            d.text((x + 3, y + 3), "+".join(n[:2] for n in c) or "bare", fill=(230, 230, 230))
        S.save(sheet)
        print(sheet, S.size, len(combos), "combinations")


if __name__ == "__main__":
    main()
