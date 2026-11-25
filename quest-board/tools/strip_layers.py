"""Run tools/strip_mannequin.py on layer PNGs, keeping them PNG (lossless).
  strip_layers.py [--lens] <layer.png> ...   (default --garment)"""
import sys, os
import numpy as np
sys.path.insert(0, os.path.join(os.getcwd(), 'tools'))
from PIL import Image
from scipy import ndimage as ndi
_save = Image.Image.save
def save(self, fp, format=None, **kw):
    if str(fp).endswith('.png'):
        return _save(self, fp, 'PNG')
    return _save(self, fp, format, **kw)
Image.Image.save = save
import strip_mannequin as sm
def sil_edge(path):
    name = path.replace("\\", "/").rsplit("/", 1)[-1]
    body_id, view = name[0], name.rsplit("_", 1)[-1].split(".")[0]
    size = Image.open(path).size
    sil = Image.open(f"{sm.ROOT}/art/sil/{body_id}_{view}.png").convert("RGB").resize(size, Image.NEAREST)
    im = np.asarray(sil).astype(float)
    body = (im[..., 0] > 128) & (im[..., 1] < 128)
    return ndi.distance_transform_edt(~(body ^ ndi.binary_erosion(body, iterations=2)))
sm.silhouette_edge = sil_edge
lens = '--lens' in sys.argv
for p in sys.argv[1:]:
    if not p.startswith('--'):
        sm.strip(p, lens=lens, garment=not lens)
