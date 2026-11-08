"""Draw the exact outline of a room's walls and floor, to give the image generator as the shape to paint over.

  shell_guide.py <W> <D> [H] <out.png> [--notch X,Y] [--zone X0,Y0,X1,Y1]

W and D are the room's size in tiles, H the wall height in game pixels (136 unless the room sets LFWH). The picture is
5:4, four times game size, on flat green. Its frame is the one the wall-shell loader uses (`shellFrame` in 27_rooms.js):
the floor's left and right corners sit 12 game px in from the edges and its front corner 12 px above the bottom.

Floor: light grey with one-tile grid lines. Left wall (x = 0) mid grey, back wall (y = 0) lighter grey, the wall tops
and ends dark, as in the game.
--notch X,Y: no floor where x > X and y > Y (an L-shaped room, like the Restaurant before its patio); left green.
--zone: a second floor area (a kitchen) in a darker tone, so the painting gives it its own material.
"""
import os
import sys

from PIL import Image, ImageDraw

SX, SY, K, M, TH = 26, 13, 4, 12, 0.42


def frame(W, D):
    """Game px: x of the left edge, y of the top edge, width, height. The frame is 5:4 unless QB_SHELL_ASPECT (height over
    width, e.g. 0.88) makes it taller, for rooms whose walls do not fit (the Auditorium's 190 to 300 px walls); the game reads a
    shell's own proportions (lfShellPart), so the painting is saved at the same aspect."""
    w = (W + D) * SX + 2 * M
    h = w * float(os.environ.get("QB_SHELL_ASPECT", "0.8"))
    left = -D * SX - M
    bottom = (W + D) * SY + M
    return left, bottom - h, w, h


def main():
    a, opt = [], {}
    it = iter(sys.argv[1:])
    for v in it:
        if v.startswith("--"):
            opt[v[2:]] = [float(q) for q in next(it).split(",")]
        else:
            a.append(v)
    W, D = float(a[0]), float(a[1])
    H = float(a[2]) if len(a) > 3 else 136
    out = a[-1]
    left, top, w, h = frame(W, D)
    img = Image.new("RGB", (round(w * K), round(h * K)), (0, 255, 0))
    g = ImageDraw.Draw(img)

    def p(x, y, z=0):
        return ((x - y) * SX - left) * K, ((x + y) * SY - z - top) * K

    poly = lambda pts, fill: g.polygon([p(*q) for q in pts], fill=fill, outline=(40, 40, 52))
    poly([(0, 0), (W, 0), (W, D), (0, D)], (214, 214, 214))
    if "zone" in opt:
        x0, y0, x1, y1 = opt["zone"]
        poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], (150, 160, 170))
    for i in range(1, int(W) + 1):
        g.line([p(i, 0), p(i, D)], fill=(178, 178, 178), width=2)
    for j in range(1, int(D) + 1):
        g.line([p(0, j), p(W, j)], fill=(178, 178, 178), width=2)
    if "notch" in opt:
        nx, ny = opt["notch"]
        poly([(nx, ny), (W, ny), (W, D), (nx, D)], (0, 255, 0))
        g.line([p(nx, ny), p(W, ny)], fill=(40, 40, 52), width=3)
        g.line([p(nx, ny), p(nx, D)], fill=(40, 40, 52), width=3)
    poly([(0, 0, 0), (0, D, 0), (0, D, H), (0, 0, H)], (150, 150, 160))
    poly([(0, 0, 0), (W, 0, 0), (W, 0, H), (0, 0, H)], (186, 186, 196))
    poly([(-TH, -TH, H), (-TH, D, H), (0, D, H), (0, 0, H), (W, 0, H), (W, -TH, H)], (70, 70, 84))
    poly([(-TH, D, 0), (0, D, 0), (0, D, H), (-TH, D, H)], (90, 90, 104))
    poly([(W, -TH, 0), (W, 0, 0), (W, 0, H), (W, -TH, H)], (90, 90, 104))
    img.save(out)
    print(out, img.size, "frame", [round(v, 1) for v in (left, top, w, h)])


if __name__ == "__main__":
    main()
