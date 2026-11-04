"""Assemble the app into dist/, ready to serve or publish.

  build.py            run from anywhere

app/src/*.js are joined in filename order into one file because the app shares a
single closure. Character art and data files sit next to the page so they never
count against the page's size limit.
"""
import glob
import json
import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
DIST = os.path.join(ROOT, "dist")


def read(*path):
    with open(os.path.join(*path), encoding="utf-8") as f:
        return f.read()


os.makedirs(os.path.join(DIST, "art"), exist_ok=True)

code = "".join(read(p) for p in sorted(glob.glob(os.path.join(APP, "src", "*.js"))))
with open(os.path.join(DIST, "app.js"), "w", encoding="utf-8") as f:
    f.write(code)

data = {name: json.loads(read(ROOT, "data", name + ".json")) for name in ("rig", "bodies", "poses", "creator", "loft", "items", "rsart")}
with open(os.path.join(DIST, "qbdata.js"), "w", encoding="utf-8") as f:
    f.write("window.QBDATA=" + json.dumps(data, separators=(",", ":")) + ";\n")

for name in ("rig.js", "look.js", "creator.js", "loft_bridge.js"):
    shutil.copy(os.path.join(ROOT, "src", name), os.path.join(DIST, name))
shutil.copy(os.path.join(APP, "blobs.js"), os.path.join(DIST, "blobs.js"))
for art in glob.glob(os.path.join(ROOT, "art", "app", "*.webp")):
    shutil.copy(art, os.path.join(DIST, "art", os.path.basename(art)))

tags = "".join('<script src="%s"></script>\n' % s for s in ("blobs.js", "qbdata.js", "rig.js", "look.js", "creator.js", "loft_bridge.js", "app.js"))
page = read(APP, "index.html").replace("<!--APP-SCRIPTS-->", tags)
with open(os.path.join(DIST, "index.html"), "w", encoding="utf-8") as f:
    f.write(page)

size = sum(os.path.getsize(os.path.join(d, n)) for d, _, ns in os.walk(DIST) for n in ns)
print("dist %.1f MB, page %.0f KB, app.js %.0f KB" % (size / 1e6, len(page) / 1e3, len(code) / 1e3))
