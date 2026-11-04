"""Bring generated shop items in: one sheet per item, read from a list of pairs.

  ingest_items.py <file_stem> <item> [<file_stem> <item> ...]

Reads each item's slot from data/items.json so small jewelry keeps its fine detail
and front-only pieces drop their empty rear art. A stem of "-" reprocesses the sheet
already downloaded. Failures are reported, not hidden.
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
items = json.load(open(os.path.join(ROOT, "data", "items.json")))
args = sys.argv[1:]
failed = []
for stem, art in zip(args[0::2], args[1::2]):
    meta = items[art]
    env = dict(os.environ)
    env["QB_ITEM"] = "1"
    if meta.get("neutral"):
        env["QB_NEUTRAL"] = "1"
    if meta["slot"] in ("glasses", "mask", "neck"):
        env["QB_FINE"] = "1"
    if meta["slot"] == "hat":
        env["QB_STRAY"] = "0.08"  # hats are meant to sit wider than the bald template head
    r = subprocess.run(["bash", os.path.join(ROOT, "tools", "ingest4.sh"), stem, art], env=env, capture_output=True, text=True)
    bad = [l for l in r.stdout.splitlines() if "REJECT" in l]
    if r.returncode or bad:
        failed.append(art)
        print("REJECT", art, bad[:1], r.stderr[-120:])
        continue
    if meta.get("frontOnly"):
        for b in "mf":
            p = os.path.join(ROOT, "art", "layers", f"{b}_{art}_back.png")
            if os.path.exists(p):
                os.remove(p)
    made = [os.path.join(ROOT, "art", "layers", f"{b}_{art}_{v}.png") for b in "mf" for v in ("front", "back")]
    subprocess.run([env.get("QB_PY", "python3"), "-W", "ignore", "-I", os.path.join(ROOT, "tools", "detick.py")] + [m for m in made if os.path.exists(m)], capture_output=True)
    print("ok", art)
print("failed:", failed)
