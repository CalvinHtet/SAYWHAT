"""Small head/hand pieces on layer PNGs: drop the template's thin outline without filling holes.
  strip_small.py [--open N] [--purge-purple] <layer.png> ...
Thin template lines vanish under a binary opening; the piece (thick) survives. Keep every component at
least 4% of the biggest, grow back a few px to restore the piece's own outline, never fill holes."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
a = sys.argv[1:]
k = int(a[a.index('--open') + 1]) if '--open' in a else 5
purge = '--purge-purple' in a
paths = [p for p in a if p.endswith('.png')]
for p in paths:
    im = np.asarray(Image.open(p).convert('RGBA')).astype(float)
    rgb, al = im[..., :3], im[..., 3] / 255
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    magenta = (np.minimum(r, b) - g > 25) & (r > 70) & (b > 60)
    mx, mn = rgb.max(-1), rgb.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1)
    brown = (mx < 120) & (r > b + 12) & (sat > 0.25)
    solid = (al > 0.5) & ~magenta & ~brown
    core = ndi.binary_opening(solid, iterations=k)
    lab, n = ndi.label(core)
    if n:
        size = ndi.sum(core, lab, range(1, n + 1))
        core = np.isin(lab, [i + 1 for i, s in enumerate(size) if s >= size.max() * 0.04])
    grown = ndi.binary_dilation(core, iterations=k + 2)
    inner = ndi.binary_fill_holes(ndi.binary_dilation(core, iterations=2))
    keep = ndi.binary_fill_holes(grown) & ~(magenta & ~inner)
    al = al * keep
    solidk = al > 0.5
    holes = ndi.binary_fill_holes(ndi.binary_closing(solidk, iterations=8)) & ~solidk
    if holes.any():
        _, (iy, ix) = ndi.distance_transform_edt(~solidk, return_indices=True)
        rgb = rgb.copy()
        rgb[holes] = rgb[iy[holes], ix[holes]]
        al = np.where(holes, 1.0, al)
    # neutralise magenta spill on the rim (as strip_mannequin.py does)
    spill = np.clip(np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1], 0, None)
    rim = ndi.distance_transform_edt(al > 0.5) <= 4
    if purge:  # pieces with no pink or purple in them: shaded magenta (thumb holes) goes grey everywhere
        rim = np.ones_like(rim)
    rgb = rgb.copy()
    rgb[..., 0] = np.where(rim, rgb[..., 0] - spill, rgb[..., 0])
    rgb[..., 2] = np.where(rim, rgb[..., 2] - spill, rgb[..., 2])
    out = np.dstack([rgb, al * 255]).clip(0, 255).astype('uint8')
    Image.fromarray(out).save(p)
    ys, xs = np.nonzero(keep & (al > 0.5))
    print(p.rsplit('/', 1)[-1], 'kept', len(xs), 'bbox', (xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) else None)
