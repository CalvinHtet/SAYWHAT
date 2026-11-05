"""Make the painted-pose BODY layers registration-exact: the rig's own render of the body everywhere, the painting only where
that render tears (around the shoulders and armpits).

  yawn_body_mix.py <painted sheet.png> <template body.png> <out_dir>

The template is rigtest/template.html's body-only render (2880x1656, man left, woman right, transparent). The painted sheet
is the generator's repaint of it, padded to 16:9 (see yawn_cut.py). A pure painted body sits a pixel or two off the mesh
drawn over it (trousers, shoes, hair), which shows as a faint double outline; this keeps the mesh's own pixels there.
The tear zone is where the painting has body and the render does not, widened by 34 px and feathered.
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from yawn_cut import FH, FW, OUT, PAD, key  # noqa: E402


def main():
    sheet, tmpl, out_dir = sys.argv[1:4]
    im = Image.open(sheet).convert("RGB").resize((FW * 2 + 2 * PAD, FH), Image.LANCZOS).crop((PAD, 0, PAD + FW * 2, FH))
    prgb, pa = key(np.asarray(im), False)
    t = np.asarray(Image.open(tmpl).convert("RGBA")).astype(float)
    ta = t[..., 3]
    tear = (pa > 128) & (ta < 40)
    tear = ndi.binary_opening(tear, iterations=2)
    zone = ndi.binary_dilation(tear, iterations=34).astype(float)
    zone = ndi.gaussian_filter(zone, 6)
    out_rgb = t[..., :3] * (1 - zone[..., None]) + prgb.astype(float) * zone[..., None]
    out_a = ta * (1 - zone) + pa.astype(float) * zone
    for i, body in enumerate(("m", "f")):
        sl = slice(i * FW, (i + 1) * FW)
        print(body, "painted share of the body: %.0f%%" % (100 * (zone[:, sl] * (out_a[:, sl] > 128)).sum() / max(1, (out_a[:, sl] > 128).sum())))
        layer = Image.fromarray(np.dstack([out_rgb[:, sl], out_a[:, sl]]).clip(0, 255).astype(np.uint8), "RGBA").resize(OUT, Image.LANCZOS)
        path = "%s/%s_base_yawn.webp" % (out_dir, body)
        layer.save(path, quality=90, method=6)
        print(path, layer.size)


if __name__ == "__main__":
    main()
