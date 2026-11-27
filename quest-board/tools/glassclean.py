"""glassclean.py <layer.png...> [--clear]: keep only the glasses on a template-made layer: whatever lies within a few px of the
frame/lens colour or is enclosed by it (dark lenses stay); the mannequin's outline strokes and stubs go. With --clear the inside
of the light frame becomes an even see-through lens."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
clear = '--clear' in sys.argv
nofill = '--nofill' in sys.argv
nodark = '--nodark' in sys.argv   # with --nofill: the piece has no dark parts of its own, so thick dark areas (a shaded head) go too   # necklaces and scarves: a chain loop encloses the chest, so nothing inside is filled
for p in [a for a in sys.argv[1:] if not a.startswith('--')]:
    im = np.asarray(Image.open(p).convert('RGBA')).copy().astype(int)
    al = im[..., 3]; lum = im[..., :3].mean(-1)
    green = (im[..., 1] > im[..., 0] + 15) & (im[..., 1] > im[..., 2] + 15)
    C = (al > 60) & (lum >= 70) & ~green
    lab, n = ndi.label(C, structure=np.ones((3, 3))); sz = ndi.sum(C, lab, range(1, n + 1))
    C = np.isin(lab, [i + 1 for i, v in enumerate(sz) if v >= 0.02 * sz.max()])       # the glasses' own coloured parts
    keep = ndi.binary_closing(ndi.binary_dilation(C, iterations=7), iterations=8)
    if not nofill:
        keep = ndi.binary_fill_holes(keep)
    else:   # scarves and chains: thick dark parts (a black stripe) stay; only thin dark strokes away from the colour go
        dark = (al > 60) & (lum < 70)
        thick = ndi.binary_dilation(ndi.binary_opening(dark, structure=np.ones((15, 15))), iterations=2)
        if not nodark:
            keep = keep | thick
    im[~keep | green, 3] = 0
    a = im[..., 3] > 20; lab, n = ndi.label(a, structure=np.ones((3, 3)))
    sz = ndi.sum(a, lab, range(1, n + 1)); im[~np.isin(lab, [i + 1 for i, v in enumerate(sz) if v >= 0.08 * sz.max()]), 3] = 0   # every sizeable part (a towel has two ends)
    if clear:
        warm = (im[..., 3] > 100) & (lum >= 120) & (im[..., 0] > im[..., 2] + 28) & (im[..., 0] >= im[..., 1])
        lab4, n4 = ndi.label(warm); sz4 = ndi.sum(warm, lab4, range(1, n4 + 1))
        warm = np.isin(lab4, [i + 1 for i, v in enumerate(sz4) if v >= 0.05 * sz4.max()])
        ring = ndi.binary_dilation(warm, iterations=3)
        lens = ndi.binary_fill_holes(ndi.binary_closing(ring, iterations=10)) & ~ring & (im[..., 3] > 0)
        im[lens, :3] = [200, 205, 215]; im[lens, 3] = 55
    elif not nofill:
        solid = im[..., 3] > 100
        holes = ndi.binary_fill_holes(solid) & ~solid
        _, (iy, ix) = ndi.distance_transform_edt(holes, return_indices=True)
        im[holes] = im[iy[holes], ix[holes]]
    Image.fromarray(im.clip(0, 255).astype(np.uint8)).save(p); print(p.split('/')[-1], int((im[..., 3] > 20).sum()))
