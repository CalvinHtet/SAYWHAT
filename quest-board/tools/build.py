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
# scripts from the last build go first, so a pack that is now cut into pieces (or no longer cut) leaves nothing behind
for old in glob.glob(os.path.join(DIST, "*.js")):
    os.remove(old)

code = "".join(read(p) for p in sorted(glob.glob(os.path.join(APP, "src", "*.js"))))
with open(os.path.join(DIST, "app.js"), "w", encoding="utf-8") as f:
    f.write(code)

for name in ("rig.js", "look.js", "creator.js", "loft_bridge.js"):
    shutil.copy(os.path.join(ROOT, "src", name), os.path.join(DIST, name))
for art in glob.glob(os.path.join(ROOT, "art", "app", "*.webp")):
    shutil.copy(art, os.path.join(DIST, "art", os.path.basename(art)))

# character layers and icons travel as two packs, so a published page stays under its file limit
import base64
# ui_<name>.webp replaces the built-in picture <name> (a class, coach, rank or reward picture), see docs/HANDOFF.md
# A pack bigger than PIECE is cut into numbered pieces (art_rig.js -> art_rig_1.js, art_rig_2.js ...): a browser keeps small
# files in its cache between visits but not 15 MB ones (QA, c5766ed), and the loading bar moves as each piece lands.
PIECE = 4_500_000
PACKS = {}


def split(name, items, wrap):
    groups, cur, n = [], [], 0
    for it in items:
        if cur and n + len(it) > PIECE:
            groups.append(cur); cur, n = [], 0
        cur.append(it); n += len(it) + 1
    groups.append(cur)
    names = [name] if len(groups) == 1 else [name.replace(".js", "_%d.js" % (i + 1)) for i in range(len(groups))]
    for nm, g in zip(names, groups):
        with open(os.path.join(DIST, nm), "w", encoding="utf-8") as f:
            f.write(wrap(g))
    return names


for pack, prefixes in (("art_rig.js", ("m_", "f_")), ("art_icon.js", ("icon_",)), ("art_ui.js", ("ui_",)), ("art_ex.js", ("ex_",))):
    parts = []
    for art in sorted(glob.glob(os.path.join(DIST, "art", "*.webp"))):
        name = os.path.basename(art)
        if name.startswith(prefixes):
            with open(art, "rb") as f:
                parts.append('"%s":"data:image/webp;base64,%s"' % (name, base64.b64encode(f.read()).decode()))
            os.remove(art)
    PACKS[pack] = split(pack, parts, lambda ps: "window.QBART=Object.assign(window.QBART||{},{" + ",".join(ps) + "});\n")

# app/blobs.js is one array of pictures (window.__B) the code indexes by number; its pieces append to it in order.
_bl = read(APP, "blobs.js").strip()
assert _bl.startswith("window.__B=[") and _bl.endswith("];")
PACKS["blobs.js"] = split("blobs.js", [json.dumps(x) for x in json.loads(_bl[len("window.__B="):-1])],
                         lambda ps: "window.__B=(window.__B||[]).concat([" + ",".join(ps) + "]);\n")

# Every file is asked for with a fingerprint of its content (name?h=...), so a phone that cached the last release still
# fetches whatever changed: a plain name can be served from its cache for a long time.
import hashlib


def fp(path):
    with open(path, "rb") as f:
        return hashlib.sha1(f.read()).hexdigest()[:10]


data = {name: json.loads(read(ROOT, "data", name + ".json")) for name in ("rig", "bodies", "poses", "creator", "loft", "items", "rsart")}
data["arthash"] = {os.path.basename(a): fp(a) for a in sorted(glob.glob(os.path.join(DIST, "art", "*.webp")))}
with open(os.path.join(DIST, "qbdata.js"), "w", encoding="utf-8") as f:
    f.write("window.QBDATA=" + json.dumps(data, separators=(",", ":")) + ";\n")

# The scripts come in through a small loader that adds them as ordinary script tags, in order, and shows how much has arrived
# (the art is about 40 MB, so a phone on mobile data would otherwise stare at a blank page).
SCRIPTS = [n for p in ("art_rig.js", "art_icon.js", "art_ui.js", "art_ex.js", "blobs.js") for n in PACKS[p]] + ["qbdata.js", "rig.js", "look.js", "creator.js", "loft_bridge.js", "app.js"]
files = [["%s?h=%s" % (s, fp(os.path.join(DIST, s))), os.path.getsize(os.path.join(DIST, s))] for s in SCRIPTS]
tags = read(APP, "loader.html").replace("/*FILES*/[]", json.dumps(files))
page = read(APP, "index.html").replace("<!--APP-SCRIPTS-->", tags)
with open(os.path.join(DIST, "index.html"), "w", encoding="utf-8") as f:
    f.write(page)

size = sum(os.path.getsize(os.path.join(d, n)) for d, _, ns in os.walk(DIST) for n in ns)
print("dist %.1f MB, page %.0f KB, app.js %.0f KB" % (size / 1e6, len(page) / 1e3, len(code) / 1e3))
