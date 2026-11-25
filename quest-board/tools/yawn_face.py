"""The stretch pose's yawning face (ROOMS 2026-11-25; LEAD 0d64dd6a swaps <b>_faceyawn in for the stretch):
  yawn_face.py <out dir>   (art/app for the real files)
Built from <b>_faceclosed_front.webp: the brows lifted a few px, the smile swapped for an open yawning mouth drawn in the
face's own line colour (4x supersampled), so it stays pixel-aligned with every other face layer."""
import sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
OUT = sys.argv[1]
# per body: mouth centre, oval size (runtime px), brow lift
SPEC = {'m': dict(c=(497, 468), w=42, h=56, lift=9), 'f': dict(c=(500, 503), w=42, h=54, lift=9)}
for b, sp in SPEC.items():
    a = np.asarray(Image.open(f'art/app/{b}_faceclosed_front.webp').convert('RGBA')).copy()
    lab, n = ndi.label(a[..., 3] > 40, structure=np.ones((3, 3)))
    objs = ndi.find_objects(lab)
    big = [(i + 1, sl) for i, sl in enumerate(objs) if (lab[sl] == i + 1).sum() >= 15]
    big.sort(key=lambda t: (t[1][0].start + t[1][0].stop) / 2)
    brows = [i for i, sl in big[:2]]
    mouth = big[-1][0]
    # soft masks that include each part's anti-aliased rim
    def part(i):
        return ndi.binary_dilation(lab == i, iterations=2)
    out = a.copy()
    out[part(mouth)] = 0
    # lift the brows
    for i in brows:
        m = part(i)
        layer = np.where(m[..., None], a, 0)
        out[m] = 0
        shifted = np.roll(layer, -sp['lift'], axis=0)
        sm = shifted[..., 3] > 0
        out[sm] = shifted[sm]
    # draw the yawn mouth at 4x and downsample
    K = 4
    cx, cy = sp['c']; w, h = sp['w'], sp['h']
    big_im = Image.new('RGBA', (120 * K, 120 * K), (0, 0, 0, 0))
    d = ImageDraw.Draw(big_im)
    ox, oy = 60 * K, 60 * K
    line = (91, 43, 44, 255)
    d.ellipse([ox - w / 2 * K, oy - h / 2 * K, ox + w / 2 * K, oy + h / 2 * K], fill=line)
    t = 3.2 * K
    inner = [ox - w / 2 * K + t, oy - h / 2 * K + t, ox + w / 2 * K - t, oy + h / 2 * K - t]
    d.ellipse(inner, fill=(74, 22, 28, 255))
    # tongue in the lower part, clipped to the inner oval
    tongue = Image.new('L', big_im.size, 0)
    ImageDraw.Draw(tongue).ellipse([ox - w * 0.32 * K, oy + h * 0.06 * K, ox + w * 0.32 * K, oy + h * 0.62 * K], fill=255)
    clip = Image.new('L', big_im.size, 0)
    ImageDraw.Draw(clip).ellipse(inner, fill=255)
    tmask = Image.fromarray(np.minimum(np.asarray(tongue), np.asarray(clip)))
    big_im.paste(Image.new('RGBA', big_im.size, (196, 98, 104, 255)), (0, 0), tmask)
    # a soft highlight on the upper lip line
    small = big_im.resize((120, 120), Image.LANCZOS)
    base = Image.fromarray(out)
    base.alpha_composite(small, (cx - 60, cy - 60))
    base.save(f'{OUT}/{b}_faceyawn_front.webp', 'WEBP', quality=92, method=6, alpha_quality=95)
    print(b, 'brows', brows, 'mouth', mouth)
