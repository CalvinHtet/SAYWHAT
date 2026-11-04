"""One-time move: split the legacy single-file page into editable source.

  flatten.py <legacy quest-board.html> <out app dir>

Writes app/index.html (shell and CSS), app/src/*.js (code), and app/blobs.js (every
embedded image, moved out of the code so the code stays readable). Run once; from
then on app/ is the source of truth and tools/build.py assembles it.
"""
import json
import os
import re
import sys

src, out = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(out, "src"), exist_ok=True)
html = open(src, encoding="utf-8").read()

scripts = list(re.finditer(r"<script>(.*?)</script>", html, re.S))
main = max(scripts, key=lambda m: len(m.group(1)))
code = main.group(1)

blobs = []
index = {}


def stash(m):
    uri = m.group(1)
    if uri not in index:
        index[uri] = len(blobs)
        blobs.append(uri)
    return "__B[%d]" % index[uri]


code = re.sub(r'"(data:[^"\\]{200,})"', stash, code)
code = re.sub(r"'(data:[^'\\]{200,})'", stash, code)

# The loft block has clear markers; everything else stays in app.js around it.
begin, end = code.find("/*LOFT-BEGIN*/"), code.find("/*LOFT-END*/")
if begin >= 0 and end > begin:
    parts = {"10_app_a.js": code[:begin], "20_loft.js": code[begin:end], "30_app_b.js": code[end:]}
else:
    parts = {"10_app.js": code}
for name, text in parts.items():
    with open(os.path.join(out, "src", name), "w", encoding="utf-8") as f:
        f.write(text)

with open(os.path.join(out, "blobs.js"), "w", encoding="utf-8") as f:
    f.write("window.__B=" + json.dumps(blobs, separators=(",", ":")) + ";\n")

shell = html[: main.start()] + "<!--APP-SCRIPTS-->" + html[main.end():]
with open(os.path.join(out, "index.html"), "w", encoding="utf-8") as f:
    f.write(shell)

print("blobs", len(blobs), "%.1f MB" % (sum(map(len, blobs)) / 1e6))
for name, text in parts.items():
    print(name, "%.0f KB" % (len(text) / 1e3), "lines", text.count("\n"))
print("shell %.0f KB" % (len(shell) / 1e3))
