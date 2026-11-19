"""Pet Shop clothes: painting templates and cutting the painted pieces (ROOMS 2026-11-18).

  pet_wear.py template <pet> <frames> <out.png> [fit]    e.g. template wolf 0 sheet.png   or   template wolf 0,6,4,5 sheet.png
                                                         (fit 0.55: the pet smaller, room round it for an aura)
  pet_wear.py cut <sheet.png> <piece id> <kind> [--append]  (--append adds cells after the existing ones) kind: head | neck | body | base | aura (base: the slime's base band pieces,
                                                         cells by the body fit, placed on the neck anchor)
  pet_wear.py check <piece id> <out.png>                 the piece worn on every frame, as the game places it
  pet_wear.py headaura <piece id>                        an aura placed on the head anchor (mass centre where the head is null)

A template is a 2048 x 2048 flat green sheet with the given frames of the pet (pgx_<pet>_<f>, or the dogs' dgx_<dog>_<f> when
<pet> is chopstick or pluto, or "dogs" for both dogs' frames) in a grid, every frame at one scale, each frame turned into a single
key colour that keeps its shading, so the painter sees the pet's ears, eyes and shape. The key colour is one the pet's own clothing
line never uses: magenta for the wolf and the wyvern, cyan for the slime and the dogs (their lines use pink). Nothing is green.
The layout is saved next to the sheet (<out>.json).

Cutting keys out the green and the key colour, cuts each grid cell, scales it back to the frame's own pixels and saves
art/app/ppc_<id>_<n>.webp (n = cell index; auras give two cells: 0 back half, 1 front half) plus data/pet_clothes.json:
{id: {kind, pet, cells: [{frame, w, h, pivot: [x, y]}]}}. pivot is the point of the cell that goes on the frame's anchor (head,
neck or body anchor from data/pet_art.json, aura: the mass centre), so a cell drawn with pivot on the anchor sits exactly where it
was painted.
"""
import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
APP = os.path.join(ROOT, "art", "app")
KEY = {"wolf": (255, 0, 255), "wyvern": (255, 0, 255), "slime": (0, 255, 255), "chopstick": (0, 255, 255),
       "pluto": (0, 255, 255), "dogs": (0, 255, 255)}
SIZE = 2048
GREEN = (0, 255, 0)


def frame_list(pet, frames):
    if pet == "dogs":
        return [("chopstick", int(f)) for f in frames] + [("pluto", int(f)) for f in frames]
    return [(pet, int(f)) for f in frames]


def frame_img(pet, f):
    name = ("dgx_%s_%d" if pet in ("chopstick", "pluto") else "pgx_%s_%d") % (pet, f)
    return Image.open(os.path.join(APP, name + ".webp")).convert("RGBA")


def template(pet, frames, out, fit=1.0):
    fl = frame_list(pet, frames.split(","))
    ims = [frame_img(p, f) for p, f in fl]
    n = len(ims)
    cols = 1 if n == 1 else 2 if n <= 4 else 3
    rows = -(-n // cols)
    cw, ch = SIZE // cols, SIZE // rows
    mw, mh = max(i.size[0] for i in ims), max(i.size[1] for i in ims)
    k = min((cw - 60) / mw, (ch - 60) / mh) * fit  # fit < 1 leaves room round the pet (auras)
    key = np.array(KEY[pet], float)
    sheet = np.zeros((SIZE, SIZE, 3), np.uint8)
    sheet[...] = GREEN
    lay = {"pet": pet, "scale": k, "cells": []}
    for i, ((p, f), im) in enumerate(zip(fl, ims)):
        w, h = im.size
        big = im.resize((round(w * k), round(h * k)), Image.LANCZOS)
        a = np.asarray(big).astype(float)
        lum = (a[..., :3] @ [.3, .59, .11]) / 255
        tint = key[None, None] * (.3 + .7 * lum[..., None])
        al = a[..., 3:4] / 255
        x0 = (i % cols) * cw + (cw - big.size[0]) // 2
        y0 = (i // cols) * ch + (ch - big.size[1]) // 2
        reg = sheet[y0:y0 + big.size[1], x0:x0 + big.size[0]].astype(float)
        sheet[y0:y0 + big.size[1], x0:x0 + big.size[0]] = (tint * al + reg * (1 - al)).astype(np.uint8)
        lay["cells"].append({"pet": p, "frame": f, "x": x0, "y": y0, "w": w, "h": h, "box": [(i % cols) * cw, (i // cols) * ch, cw, ch]})
    Image.fromarray(sheet).save(out)
    json.dump(lay, open(out + ".json", "w"), indent=1)
    print(out, n, "frames, scale %.2f" % k)


def keyed(rgb, pet):
    a = rgb.astype(float) / 255
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    sat = (mx - mn) / (mx + 1e-6)
    grn = (g > r + .2) & (g > b + .2)
    if KEY[pet] == (255, 0, 255):
        tpl = (r > g + .1) & (b > g + .1) & (np.abs(r - b) < .32) & (sat > .3)
    else:
        tpl = (g > r + .1) & (b > r + .1) & (np.abs(g - b) < .3) & (sat > .3)
        tpl |= (g > r + .06) & (b > r + .12) & (mx < .45)  # the cyan template in shadow (dark teal)
        # deeper shadow (slate teal, greener than navy and duller): only where it joins the template itself
        slate = (g > r + .015) & (b > r + .09) & (b < r + .2) & (mx < .45) & (sat < .5)
        lab, n = ndi.label(slate | tpl)
        if n:
            tpl |= np.isin(lab, np.unique(lab[tpl])) & slate
    dark = mx < .3
    # dark outline pixels squeezed between key colour and green belong to the template, not the piece
    edge = dark & ndi.binary_dilation(tpl, iterations=6) & ndi.binary_dilation(grn, iterations=6)
    # a white sticker border the painter sometimes draws round the figure: near-white, colourless, between key and green
    cand = (mx > .78) & (sat < .2) & ndi.binary_dilation(tpl, iterations=34) & ndi.binary_dilation(grn, iterations=34)
    lab, n = ndi.label(cand)
    rim = np.zeros_like(cand)
    if n:
        sz = ndi.sum(cand, lab, range(1, n + 1))
        rim = np.isin(lab, 1 + np.flatnonzero(sz > 20000))  # only a band round the whole figure, never a piece's white part
    return grn | tpl | edge | rim


def anchor(pet, f, kind):
    kind = "neck" if kind == "base" else kind
    if pet in ("chopstick", "pluto"):
        d = json.load(open(os.path.join(ROOT, "data", "pet_art.json")))["dogs"]["dgx_%s_%d" % (pet, f)]
        k = {"body": "back"}.get(kind, kind)
        return d[k][:2] if d.get(k) else None
    a = json.load(open(os.path.join(ROOT, "data", "pet_art.json")))["pets"][pet]["anchors"][f]
    return a[kind][:2] if a.get(kind) else None


def cut(sheet, pid, kind, append=False):
    lay = json.load(open(sheet + ".json"))
    rgb = np.asarray(Image.open(sheet).convert("RGB"))
    pet = lay["pet"]
    gone = keyed(rgb, pet)
    # despill: no line uses green, so green never rises above red or blue (thin lines and edges blended with the screen)
    rgb = rgb.copy()
    rgb[..., 1] = np.minimum(rgb[..., 1], np.maximum(rgb[..., 0], rgb[..., 2]))
    alpha = np.where(gone, 0, 255).astype(np.uint8)
    alpha = ndi.median_filter(alpha, 3)
    k = lay["scale"]
    p0 = os.path.join(ROOT, "data", "pet_clothes.json")
    d0 = json.load(open(p0)) if os.path.exists(p0) else {}
    out = list(d0[pid]["cells"]) if append and pid in d0 else []  # append: new cells go after the existing ones
    for i, c in enumerate(lay["cells"]):
        bx, by, bw, bh = c["box"]
        a = alpha[by:by + bh, bx:bx + bw]
        lab, n = ndi.label(a > 0)
        if not n:
            continue
        sz = ndi.sum(a > 0, lab, range(1, n + 1))
        ok = sz > max(80, (.01 if kind == "aura" else .05) * sz.max())
        if kind != "aura":
            # a small part on the cell's edge is a sliver of the next cell's painting (cut by the box), not this piece
            rim = np.zeros((bh, bw), bool)
            rim[:3], rim[-3:], rim[:, :3], rim[:, -3:] = True, True, True, True
            edge = np.array([(rim & (lab == j + 1)).any() for j in range(n)])
            ok &= ~(edge & (sz < .25 * sz.max()))
        if kind != "aura":
            # a worn piece touches the pet: drop parts that float free of the template figure (ghost copies the painter adds)
            fa = np.asarray(frame_img(c["pet"], c["frame"]))[..., 3] > 128
            fm = np.zeros((bh, bw), bool)
            fh, fw = fa.shape
            big = np.asarray(Image.fromarray(fa.astype(np.uint8) * 255).resize((round(fw * k), round(fh * k)))) > 127
            oy, ox = c["y"] - by, c["x"] - bx
            fm[oy:oy + big.shape[0], ox:ox + big.shape[1]] = big[:bh - oy, :bw - ox]
            fm = ndi.binary_dilation(fm, iterations=12)
            touch = np.array([(fm & (lab == j + 1)).any() for j in range(n)])
            ok &= touch
        keep = np.isin(lab, 1 + np.flatnonzero(ok))
        ys, xs = np.nonzero(keep)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        piece = np.dstack([rgb[by + y0:by + y1, bx + x0:bx + x1], np.where(keep[y0:y1, x0:x1], a[y0:y1, x0:x1], 0)])
        im = Image.fromarray(piece.astype(np.uint8))
        im = im.resize((max(1, round(im.size[0] / k)), max(1, round(im.size[1] / k))), Image.LANCZOS)
        # where the piece's top-left sits in the frame's own pixels
        fx, fy = (bx + x0 - c["x"]) / k, (by + y0 - c["y"]) / k
        if kind == "aura":
            fa = np.asarray(frame_img(c["pet"], c["frame"]))[..., 3] > 128
            cy, cx = ndi.center_of_mass(fa)
            ref = [cx, cy]
            # back half above the ring's centre line, front half below it
            arr = np.asarray(im).copy()
            mid = int(round(cy - fy))
            back, front = arr.copy(), arr.copy()
            back[mid:, :, 3] = 0
            front[:mid, :, 3] = 0
            parts = [back, front]
        else:
            ref = anchor(c["pet"], c["frame"], kind)
            parts = [np.asarray(im)]
        for j, arr in enumerate(parts):
            idx = len(out)
            name = "ppc_%s_%d" % (pid, idx)
            Image.fromarray(arr).save(os.path.join(APP, name + ".webp"), quality=90, method=6)
            out.append({"cell": idx, "pet": c["pet"], "frame": c["frame"], "w": arr.shape[1], "h": arr.shape[0],
                        "pivot": [round(ref[0] - fx, 1), round(ref[1] - fy, 1)] if ref else None})
            print(name, arr.shape[1], "x", arr.shape[0], "pivot", out[-1]["pivot"])
    p = os.path.join(ROOT, "data", "pet_clothes.json")
    d = json.load(open(p)) if os.path.exists(p) else {}
    keep = {k2: v for k2, v in d.get(pid, {}).items() if k2 not in ("kind", "pet", "cells")} if append else {}
    d[pid] = dict({"kind": kind, "pet": "dogs" if pet in ("chopstick", "pluto") else pet, "cells": out}, **keep)  # a per-dog sheet still makes a dog-line piece
    json.dump(dict(sorted(d.items())), open(p, "w"), indent=1)


def check(pid, out):
    """every frame of the pet with the piece placed as the code will: cell by the fit table, pivot on the frame's anchor,
    turned by the anchor's angle (relative to the frame it was painted on); head hidden in fit.headHide, neck where null."""
    from PIL import ImageDraw
    d = json.load(open(os.path.join(ROOT, "data", "pet_clothes.json")))[pid]
    art = json.load(open(os.path.join(ROOT, "data", "pet_art.json")))
    kind, pet = d["kind"], d["pet"]
    cells = d["cells"]
    pets = ["chopstick", "pluto"] if pet == "dogs" else [pet]
    tiles = []
    for p in pets:
        if p in ("chopstick", "pluto"):
            frames = range(4)
            fit = art.get("dogFit", {})
        else:
            frames = range(11)
            fit = art["pets"][p]["fit"]
        for f in frames:
            fr = frame_img(p, f)
            W, H = fr.size
            can = Image.new("RGBA", (W + 160, H + 160), (214, 212, 222, 255))
            if p in ("chopstick", "pluto"):
                an = art["dogs"]["dgx_%s_%d" % (p, f)]
                anc = {"head": an.get("head"), "neck": an.get("neck"), "body": an.get("back"), "aura": an.get("aura")}
            else:
                anc = art["pets"][p]["anchors"][f]
            mine = [c for c in cells if c["pet"] == p] or cells
            akind = "neck" if kind == "base" else kind
            if kind in ("body", "base"):
                if p in ("chopstick", "pluto"):
                    want = fit.get("body", ["stand", "stand", "sit", "sleep"])[f]
                    order = fit.get("cells", ["stand", "sit", "sleep"])
                else:
                    want, order = fit["body"][f], fit["cells"]
                pick = [mine[order.index(want)]] if order.index(want) < len(mine) else []
            elif kind == "aura":
                pick = mine[:2]
            elif kind == "head" and len(mine) > 1 and fit.get("head"):
                pick = [mine[fit["headCells"].index(fit["head"][f])]]
            else:
                pick = mine[:1]
            hide = (kind == "head" and f in fit.get("headHide", [])) or (kind != "aura" and not anc.get(akind))
            layers = []
            for c in pick:
                if hide or not c.get("pivot"):
                    continue
                im = Image.open(os.path.join(APP, "ppc_%s_%d.webp" % (pid, c["cell"]))).convert("RGBA")
                px, py = c["pivot"]
                if kind == "aura" and d.get("anchor") == "head" and anc.get("head"):
                    a = anc["head"]
                elif kind == "aura":
                    a = list(ndi.center_of_mass(np.asarray(fr)[..., 3] > 128))[::-1]
                    px, py = c.get("pivotAura", c["pivot"])
                else:
                    a = anc[akind]
                deg = (a[2] if len(a) > 2 else 0)
                rk = "head" if (kind == "aura" and d.get("anchor") == "head" and anc.get("head")) else akind
                if c["frame"] is not None and (kind != "aura" or rk == "head") and not (p in ("chopstick", "pluto")):
                    ref = art["pets"][p]["anchors"][c["frame"]].get(rk) or [0, 0, 0]
                    deg -= ref[2] if len(ref) > 2 else 0
                big = Image.new("RGBA", (im.size[0] * 3, im.size[1] * 3))
                big.alpha_composite(im, (im.size[0], im.size[1]))
                rot = big.rotate(-deg, center=(im.size[0] + px, im.size[1] + py), resample=Image.BICUBIC)
                layers.append((rot, a[0] - im.size[0] - px + 80, a[1] - im.size[1] - py + 80))
            if kind == "aura" and layers:
                can.alpha_composite(layers[0][0], (int(layers[0][1]), int(layers[0][2])))
                layers = layers[1:]
            can.alpha_composite(fr, (80, 80))
            for rot, x, y in layers:
                can.alpha_composite(rot, (int(round(x)), int(round(y))))
            ImageDraw.Draw(can).text((4, 4), "%s %d%s" % (p, f, " (hidden)" if hide else ""), fill=(20, 20, 30))
            tiles.append(can)
    cols = 6
    tw, th = max(t.size[0] for t in tiles), max(t.size[1] for t in tiles)
    sheet = Image.new("RGB", (cols * tw, -(-len(tiles) // cols) * th), (255, 255, 255))
    for i, t in enumerate(tiles):
        sheet.paste(t, ((i % cols) * tw, (i // cols) * th))
    sheet.save(out)
    print(out, len(tiles), "frames")


def headaura(pid):
    """an aura that belongs above the head (LEAD 2026-11-18): "anchor": "head", pivot on the frame's head anchor (turned by
    the head-angle delta); where the head anchor is null (sleep) it falls back to the mass centre with pivotAura."""
    p = os.path.join(ROOT, "data", "pet_clothes.json")
    d = json.load(open(p))
    e = d[pid]
    assert e["kind"] == "aura"
    for c in e["cells"]:
        fr = np.asarray(frame_img(c["pet"], c["frame"]))[..., 3] > 128
        cy, cx = ndi.center_of_mass(fr)
        h = anchor(c["pet"], c["frame"], "head")
        pa = c.get("pivotAura", c["pivot"])
        c["pivotAura"] = pa
        c["pivot"] = [round(pa[0] + h[0] - cx, 1), round(pa[1] + h[1] - cy, 1)]
    e["anchor"] = "head"
    json.dump(dict(sorted(d.items())), open(p, "w"), indent=1)
    print(pid, "head-anchored", [c["pivot"] for c in e["cells"]])


if __name__ == "__main__":
    if sys.argv[1] == "template":
        template(sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]) if len(sys.argv) > 5 else 1.0)
    elif sys.argv[1] == "headaura":
        headaura(sys.argv[2])
    elif sys.argv[1] == "check":
        check(sys.argv[2], sys.argv[3])
    else:
        cut(sys.argv[2], sys.argv[3], sys.argv[4], "--append" in sys.argv)
