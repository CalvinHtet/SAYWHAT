"""Item sheets: one generation holds every view an item needs, side by side.

  sheet2v.py make <out.png> <W> <H> <sil1.png> [sil2.png ...]
  sheet2v.py split <raw_sheet.png> <out1.png> [out2.png ...]

Each cell holds a full view canvas scaled to fit and centred, so splitting
restores registration with the base layers. The cell count is the number of
outputs, in the same reading order the silhouettes were given.
"""
import math
import sys

from PIL import Image

VIEW = (1696, 2528)


def cell_box(sheet_w, sheet_h, count, i):
    """Pixel box of view canvas i. The grid shape follows the sheet's aspect."""
    cols = max(1, min(count, round(math.sqrt(count * sheet_w / sheet_h * VIEW[1] / VIEW[0]))))
    rows = math.ceil(count / cols)
    cw, ch = sheet_w / cols, sheet_h / rows
    s = min(cw / VIEW[0], ch / VIEW[1])
    w, h = VIEW[0] * s, VIEW[1] * s
    x = cw * (i % cols) + (cw - w) / 2
    y = ch * (i // cols) + (ch - h) / 2
    return round(x), round(y), round(x + w), round(y + h)


def make(out, W, H, *sils):
    W, H = int(W), int(H)
    canvas = Image.new("RGB", (W, H), (0, 255, 0))
    for i, p in enumerate(sils):
        x0, y0, x1, y1 = cell_box(W, H, len(sils), i)
        canvas.paste(Image.open(p).convert("RGB").resize((x1 - x0, y1 - y0), Image.NEAREST), (x0, y0))
    canvas.save(out)


def split(raw, *outs):
    im = Image.open(raw).convert("RGB")
    for i, p in enumerate(outs):
        im.crop(cell_box(im.width, im.height, len(outs), i)).resize(VIEW, Image.LANCZOS).save(p)


if __name__ == "__main__":
    {"make": make, "split": split}[sys.argv[1]](*sys.argv[2:])
