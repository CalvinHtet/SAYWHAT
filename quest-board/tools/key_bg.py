"""Cut a generated object off its flat background, whatever colour the generator made it, and save it as a game webp.

  key_bg.py <in.png> <out.webp> <height> [tolerance] [strict]

strict: the object has none of the backdrop's colour in it, so every pixel leaning that way goes too (backdrop seen
between chair legs, through glass, or in a cast shadow). strict:N sets how far a pixel may lean first (default 22).
neutral: instead, the backdrop's tint reflected in the object (polished metal) is pulled back to grey everywhere;
strict+neutral does both. holes: also clear backdrop patches the object encloses.

The background colour is the median of the picture's border. Only background that connects to the border is removed, so
parts of the object in a similar colour (a green dragon on a green backdrop) stay. The edge is softened and despilled,
the result is cropped to the object and scaled to <height> px. Prints the size, for data/rsart.json.
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def main():
    src, out, H = sys.argv[1], sys.argv[2], int(sys.argv[3])
    tol = float(sys.argv[4]) if len(sys.argv) > 4 else 38
    strict = len(sys.argv) > 5 and sys.argv[5].startswith("strict")
    lean0 = float(sys.argv[5].split(":")[1]) if strict and ":" in sys.argv[5] else 22
    im = np.asarray(Image.open(src).convert("RGB")).astype(float)
    border = np.concatenate([im[:8].reshape(-1, 3), im[-8:].reshape(-1, 3), im[:, :8].reshape(-1, 3), im[:, -8:].reshape(-1, 3)])
    bg = np.median(border, 0)
    d = np.sqrt(((im - bg) ** 2).sum(-1))
    lab, _ = ndi.label(d < tol)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bgm = ndi.binary_opening(np.isin(lab, list(edge)), iterations=1)
    if len(sys.argv) > 5 and "holes" in sys.argv[5]:
        # backdrop shut in by the object (between rooftop walls, inside a handle): very close in colour, a real patch
        hl, n = ndi.label(d < tol * .6)
        if n:
            sizes = ndi.sum(np.ones_like(d), hl, range(1, n + 1))
            big = [i + 1 for i, z in enumerate(sizes) if z > 400]
            bgm |= ndi.binary_dilation(np.isin(hl, big), iterations=1)
    rim = ndi.binary_dilation(bgm, iterations=3) & ~bgm
    alpha = np.where(bgm, 0.0, 1.0)
    alpha = np.where(rim, np.clip((d - tol * .45) / (tol * .8), 0, 1), alpha)
    # the backdrop's strong channels (green: G; magenta: R and B) against the rest
    hi = [c for c in range(3) if bg[c] > bg.mean()]
    lo = [c for c in range(3) if c not in hi]
    if strict:
        lean = im[..., hi].min(-1) - im[..., lo].max(-1)
        alpha = alpha * (1 - np.clip((lean - lean0) / 26, 0, 1))
    alpha = ndi.gaussian_filter(alpha, .7)
    # pull the backdrop's tint out of the soft edge (out of everything with neutral)
    spill = ndi.binary_dilation(rim, iterations=2)
    if len(sys.argv) > 5 and sys.argv[5] in ("neutral", "strict+neutral"):
        spill = np.ones_like(spill)
    for k in hi:
        im[..., k] = np.where(spill, np.minimum(im[..., k], im[..., lo].max(-1) + 10), im[..., k])
    I = Image.fromarray(np.dstack([im, alpha * 255]).clip(0, 255).astype(np.uint8))
    I = I.crop(I.getbbox())
    I = I.resize((round(I.width * H / I.height), H), Image.LANCZOS)
    I.save(out, quality=88, method=6)
    print(out, I.size, "background", bg.round().tolist())


if __name__ == "__main__":
    main()
