"""Cut a generated sheet of icons in a grid into separate game icons on transparent.

  grid_icons.py <sheet.png> <cols> <rows> <size> <name,name,...> [key_bg option]

Names go left to right, top to bottom; each becomes art/app/<name>.webp, the item keyed off its cell's own backdrop
(tools/key_bg.py, so cells may differ in shade), centred on a transparent square of <size> px with a small margin.
"""
import os
import subprocess
import sys
import tempfile

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    sheet, cols, rows, size, names = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5].split(",")
    opt = sys.argv[6:7]
    im = Image.open(sheet).convert("RGB")
    w, h = im.size
    cw, ch = w // cols, h // rows
    tmp = tempfile.mkdtemp()
    for k, n in enumerate(names):
        c, r = k % cols, k // cols
        cell = im.crop((c * cw + 6, r * ch + 6, (c + 1) * cw - 6, (r + 1) * ch - 6))
        cp, kp = os.path.join(tmp, n + ".png"), os.path.join(tmp, n + ".webp")
        cell.save(cp)
        subprocess.run([sys.executable, os.path.join(HERE, "key_bg.py"), cp, kp, str(int(size * .9)), "38"] + opt, check=True, capture_output=True)
        it = Image.open(kp).convert("RGBA")
        s = size * .9 / max(it.size)
        it = it.resize((max(1, round(it.width * s)), max(1, round(it.height * s))), Image.LANCZOS)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.alpha_composite(it, ((size - it.width) // 2, (size - it.height) // 2))
        path = os.path.join("art", "app", n + ".webp")
        out.save(path, quality=90, method=6)
        print(path)


if __name__ == "__main__":
    main()
