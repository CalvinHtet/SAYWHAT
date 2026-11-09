"""Assemble the app into dist/, ready to serve or publish.

  build.py                    run from anywhere: dist/, the Claude build
  QB_TARGET=web build.py      dist-web/, the build that runs off Claude (docs/WEBAPP.md)

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
# The web build (docs/WEBAPP.md) loads Firebase and web/web.js, which answers the game's window.claude calls, and leaves the art
# as loose files that load when first drawn instead of packing them into scripts (the Claude build packs them because a
# published page may hold only so many files).
WEB = os.environ.get("QB_TARGET") == "web"
DIST = os.path.join(ROOT, "dist-web" if WEB else "dist")


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
# Friend portraits (friend_<id>.webp, three poses each) ride in art_ui too since the six new friends (510 loose files, 2026-11-07).
# Brand badges (logo_<id>.webp) ride in art_ui too: each new brand would otherwise add a loose file (505 of 511, 2026-11-06).
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


for pack, prefixes in (("art_rig.js", ("m_", "f_")), ("art_icon.js", ("icon_",)), ("art_ui.js", ("ui_", "logo_", "friend_")), ("art_ex.js", ("ex_",))):
    if WEB:
        PACKS[pack] = []
        continue
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
# every runtime picture by name, packed or loose, for the rig test pages (rigtest/matrix.html; written there, never into dist, so a
# publish carries no extra file), which load art straight from
# art/app and so cannot tell from the packs which pictures exist (QA: the yawn fallback and the hair lock key on that)
with open(os.path.join(ROOT, "rigtest", "artnames.json"), "w", encoding="utf-8") as f:
    json.dump(sorted(os.path.basename(a) for a in glob.glob(os.path.join(ROOT, "art", "app", "*.webp"))), f)
with open(os.path.join(DIST, "qbdata.js"), "w", encoding="utf-8") as f:
    f.write("window.QBDATA=" + json.dumps(data, separators=(",", ":")) + ";\n")

# The scripts come in through a small loader that adds them as ordinary script tags, in order, and shows how much has arrived
# (the art is about 40 MB, so a phone on mobile data would otherwise stare at a blank page).
SCRIPTS = [n for p in ("art_rig.js", "art_icon.js", "art_ui.js", "art_ex.js", "blobs.js") for n in PACKS[p]] + ["qbdata.js", "rig.js", "look.js", "creator.js", "loft_bridge.js", "app.js"]
if WEB:
    # Firebase first, then the project's config; web.js needs qbdata.js (the art list) and must be in place before the game boots
    WEBDIR = os.path.join(ROOT, "web")
    for name in ("firebase-app-compat.js", "firebase-auth-compat.js", "firebase-firestore-compat.js"):
        shutil.copy(os.path.join(WEBDIR, "vendor", name), os.path.join(DIST, name))
    for name in ("config.js", "web.js"):
        shutil.copy(os.path.join(WEBDIR, name), os.path.join(DIST, name))
    if os.environ.get("QB_SANDBOX"):  # the sandbox link: saves stay in this browser, Test tools on (docs/RELEASING.md)
        with open(os.path.join(DIST, "config.js"), "a", encoding="utf-8") as f:
            f.write("\nwindow.QB_WEB.sandbox = true;\n")
    shutil.copy(os.path.join(APP, "lfvar.json"), os.path.join(DIST, "lfvar.json"))
    i = SCRIPTS.index("qbdata.js") + 1
    SCRIPTS = ["firebase-app-compat.js", "firebase-auth-compat.js", "firebase-firestore-compat.js", "config.js"] + SCRIPTS[:i] + ["web.js"] + SCRIPTS[i:]
files = [["%s?h=%s" % (s, fp(os.path.join(DIST, s))), os.path.getsize(os.path.join(DIST, s))] for s in SCRIPTS]
tags = read(APP, "loader.html").replace("/*FILES*/[]", json.dumps(files))
page = read(APP, "index.html").replace("<!--APP-SCRIPTS-->", tags)
if WEB:
    # installable: the manifest and icons for Add to Home Screen (full screen, own icon), and the service worker (web/sw.js)
    for name in ("manifest.webmanifest", "sw.js"):
        shutil.copy(os.path.join(WEBDIR, name), os.path.join(DIST, name))
    shutil.copytree(os.path.join(WEBDIR, "icons"), os.path.join(DIST, "icons"), dirs_exist_ok=True)
    head = ('<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png">'
            '<link rel="icon" href="icons/icon-192.png"><meta name="theme-color" content="#14121c">'
            '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">'
            '<meta name="apple-mobile-web-app-status-bar-style" content="black"><meta name="apple-mobile-web-app-title" content="SAYWHAT">')
    assert page.count("</head>") == 1
    page = page.replace("</head>", head + "</head>").replace("<title>Quest Board</title>", "<title>SAYWHAT</title>")
with open(os.path.join(DIST, "index.html"), "w", encoding="utf-8") as f:
    f.write(page)

# Cal, 2026-11-09: a page left open on an older version reads this and offers "New Update!" with a Refresh (app/src/29q_news.js)
import re
_appv = re.search(r"\bAPPV=(\d+)", read(APP, "src", "30_app_b.js"))
with open(os.path.join(DIST, "version.json"), "w", encoding="utf-8") as f:
    json.dump({"appv": int(_appv.group(1)) if _appv else 0}, f)

size = sum(os.path.getsize(os.path.join(d, n)) for d, _, ns in os.walk(DIST) for n in ns)
print("dist %.1f MB, page %.0f KB, app.js %.0f KB" % (size / 1e6, len(page) / 1e3, len(code) / 1e3))
