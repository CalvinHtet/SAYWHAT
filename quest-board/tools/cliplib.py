"""The hats' hair clip line, shared by tools/items.py and tools/clip_lines.py (LEAD 664d24f3; Cal 11-26: "no weird gaps ... natural").

Per column of a hat layer: under the hat, the hat's lower edge tucked a little under it; past the hat, flat at the brim's height on
that side, never lower, so long hair, a ponytail and hair hanging behind stay whole. src/rig.js fades the hair over a short band above
the line. One height per column, 0..1 of the layer height.
"""
import numpy as np

COLUMNS = 64  # must match CLIP_COLUMNS in src/rig.js


def trim_line(hat):
    h, w = hat.shape
    bottom = np.full(w, -1.0)
    for x in np.nonzero(hat.any(axis=0))[0]:
        rows = np.nonzero(hat[:, x])[0]
        gaps = np.nonzero(np.diff(rows) > 40)[0]
        end = rows[gaps[0]] if len(gaps) else rows[-1]
        bottom[x] = end - min(0.25 * (end - rows[0]), 40)
    covered = np.nonzero(bottom >= 0)[0]
    lo, hi = covered.min(), covered.max()
    # the brim's height at each side: the lower edge over the outer eighth of the hat
    span = max(8, (hi - lo) // 8)
    left_y = float(np.median(bottom[lo:lo + span][bottom[lo:lo + span] >= 0]))
    right_y = float(np.median(bottom[hi - span + 1:hi + 1][bottom[hi - span + 1:hi + 1] >= 0]))
    line = np.zeros(w)
    for x in range(w):
        if bottom[x] >= 0:
            line[x] = bottom[x]
        elif x < lo:
            line[x] = left_y
        elif x > hi:
            line[x] = right_y
        else:  # a strap gap inside the hat: the lower of its neighbours
            l = bottom[:x][bottom[:x] >= 0]
            r = bottom[x:][bottom[x:] >= 0]
            line[x] = min(l[-1] if len(l) else 0, r[0] if len(r) else 0)
    edges = np.linspace(0, w, COLUMNS, endpoint=False).astype(int)
    step = w // COLUMNS
    return [round(float(line[e:e + step].min()) / h, 4) for e in edges]
