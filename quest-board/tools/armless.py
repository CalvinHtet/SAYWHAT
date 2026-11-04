"""Make a template with the arms removed, for art that hangs behind them.

  armless.py <bodies.json> <body> <view> <silhouette.png> <out.png>

Long hair traced around a silhouette's arms comes out with arm-shaped holes that
show when the arm moves. Without arms in the template the art comes out whole.
"""
import json
import sys

import numpy as np
from PIL import Image

bodies, body, view, sil, out = sys.argv[1:6]
joints = json.load(open(bodies))[body][view]["joints"]
im = np.asarray(Image.open(sil).convert("RGB")).copy()
H, W = im.shape[:2]
yy, xx = np.mgrid[0:H, 0:W]


def capsule(a, b, r):
    ax, ay = a
    vx, vy = b[0] - ax, b[1] - ay
    t = np.clip(((xx - ax) * vx + (yy - ay) * vy) / max(vx * vx + vy * vy, 1), 0, 1)
    return np.hypot(xx - ax - vx * t, yy - ay - vy * t) < r


arm = np.zeros((H, W), bool)
for side in "NF":
    chain = [joints["shoulder" + side], joints["elbow" + side], joints["wrist" + side], joints["hand" + side]]
    for a, b in zip(chain, chain[1:]):
        arm |= capsule(a, b, 125)
# The torso stays: only what lies outside it is arm.
torso = capsule(joints["pelvis"], joints["neck"], 235)
head = capsule(joints["headC"], joints["headC"], 480)
im[arm & ~torso & ~head] = (0, 255, 0)
Image.fromarray(im).save(out)
