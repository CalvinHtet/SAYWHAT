"""Fit painted wall-shell tiers to a room's outline and lay them out side by side, labeled, for Cal's approval.

  shell_sheet.py <W> <D> <H> <title> <out.png> <tier.png> [<tier.png> ...]

Each painting is scaled to the guide frame (shell_guide.py), cut to the room's exact outline (walls, wall tops and
floor), and set on a dark card labeled Tier 1, Tier 2 and so on, in the order given. Also prints how far each painting's
own room edge sits from the guide outline, so a tier that drifted shows up before anyone sees it.
"""
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from shell_guide import K, SX, SY, TH, frame  # noqa: E402


def outline(W, D, H):
    """The room's silhouette in guide pixels: floor, both walls and their tops."""
    left, top, w, h = frame(W, D)
    p = lambda x, y, z=0: (((x - y) * SX - left) * K, ((x + y) * SY - z - top) * K)
    pts = [p(-TH, D, 0), p(W, D, 0), p(W, -TH, 0), p(W, -TH, H), p(-TH, -TH, H), p(-TH, D, H)]
    size = (round(w * K), round(h * K))
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    # floor diamond plus the two wall slabs, so the union is exactly the room
    d.polygon([p(0, 0), p(W, 0), p(W, D), p(0, D)], fill=255)
    d.polygon([p(-TH, -TH, 0), p(-TH, D, 0), p(0, D, 0), p(0, D, H), p(-TH, D, H), p(-TH, -TH, H)], fill=255)
    d.polygon([p(-TH, -TH, H), p(-TH, D, H), p(0, D, H), p(0, 0, H), p(W, 0, H), p(W, -TH, H)], fill=255)
    d.polygon([p(-TH, -TH, 0), p(W, -TH, 0), p(W, -TH, H), p(-TH, -TH, H)], fill=255)
    d.polygon([p(0, 0, 0), p(0, D, 0), p(0, D, H), p(0, 0, H)], fill=255)
    d.polygon([p(0, 0, 0), p(W, 0, 0), p(W, 0, H), p(0, 0, H)], fill=255)
    d.polygon([p(W, -TH, 0), p(W, 0, 0), p(W, 0, H), p(W, -TH, H)], fill=255)
    return size, m


def drift(img, mask):
    """Mean distance in guide px between the painting's non-green silhouette and the guide's, at each edge."""
    a = np.asarray(img.convert("RGB")).astype(int)
    green = (a[..., 1] > 150) & (a[..., 0] < 150) & (a[..., 2] < 150)
    room = ~green
    g = np.asarray(mask) > 0
    out = []
    for name, arr in (("painting", room), ("guide", g)):
        ys, xs = np.nonzero(arr)
        out.append((xs.min(), xs.max(), ys.min(), ys.max()))
    (a0, a1, a2, a3), (b0, b1, b2, b3) = out
    return dict(left=int(a0 - b0), right=int(a1 - b1), top=int(a2 - b2), bottom=int(a3 - b3))


def main():
    W, D, H, title, out = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), sys.argv[4], sys.argv[5]
    tiers = sys.argv[6:]
    size, mask = outline(W, D, H)
    cw = 900
    ch = round(cw * size[1] / size[0])
    try:
        f1 = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 34)
        f2 = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 22)
    except OSError:
        f1 = f2 = ImageFont.load_default()
    cols = min(len(tiers), 2)
    rows = (len(tiers) + cols - 1) // cols
    pad, lab = 24, 50
    sheet = Image.new("RGB", (pad + cols * (cw + pad), 90 + rows * (ch + lab + pad)), (22, 22, 30))
    d = ImageDraw.Draw(sheet)
    d.text((pad, 22), title, font=f1, fill=(240, 240, 245))
    for i, path in enumerate(tiers):
        img = Image.open(path).convert("RGB").resize(size, Image.LANCZOS)
        print(path, "edge drift vs guide (px at 4x):", drift(img, mask))
        card = Image.new("RGB", size, (34, 34, 46))
        card.paste(img, (0, 0), mask)
        card = card.resize((cw, ch), Image.LANCZOS)
        x = pad + (i % cols) * (cw + pad)
        y = 90 + (i // cols) * (ch + lab + pad)
        d.rounded_rectangle((x, y, x + 120, y + 38), 8, fill=(200, 255, 80))
        d.text((x + 12, y + 6), "Tier %d" % (i + 1), font=f2, fill=(20, 30, 10))
        sheet.paste(card, (x, y + lab))
    sheet.save(out)
    print(out, sheet.size)


if __name__ == "__main__":
    main()
