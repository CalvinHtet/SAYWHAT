"""Shrink working layers into the runtime art the app loads.

  pack.py <layers dir> <out dir>

Runtime art is half the working size: the app never draws a character larger
than this. Quality stays high because edges are what people notice.
"""
import os
import sys

from PIL import Image

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
total = 0
for name in sorted(os.listdir(src)):
    if not name.endswith(".png"):
        continue
    dst = os.path.join(out, name[:-4] + ".webp")
    if os.path.exists(dst) and os.path.getmtime(dst) > os.path.getmtime(os.path.join(src, name)):
        total += os.path.getsize(dst)
        continue
    im = Image.open(os.path.join(src, name)).convert("RGBA")
    im = im.resize((im.width // 2, im.height // 2), Image.LANCZOS)
    im.save(dst, "WEBP", quality=92, method=6, alpha_quality=95)
    total += os.path.getsize(dst)
print("runtime art: %.1f MB" % (total / 1e6))
