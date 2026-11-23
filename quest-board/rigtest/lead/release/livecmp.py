"""Compare every file in a built dist-web against what a Firebase Hosting site serves. Prints counts and mismatches only."""
import hashlib, os, sys, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor

root, base = sys.argv[1], sys.argv[2].rstrip("/")
files = []
for d, _, names in os.walk(root):
    for n in names:
        files.append(os.path.relpath(os.path.join(d, n), root))


def check(rel):
    with open(os.path.join(root, rel), "rb") as f:
        want = hashlib.sha256(f.read()).hexdigest()
    url = base + "/" + urllib.parse.quote(rel)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "quest-board-release-check"})
        with urllib.request.urlopen(req, timeout=60) as r:
            got = hashlib.sha256(r.read()).hexdigest()
    except Exception as e:
        return rel, "ERR " + type(e).__name__ + " " + str(e)[:80]
    return rel, "ok" if got == want else "DIFF"


with ThreadPoolExecutor(24) as ex:
    res = list(ex.map(check, files))
bad = [r for r in res if r[1] != "ok"]
print("files", len(res), "identical", len(res) - len(bad), "bad", len(bad))
for r in bad[:25]:
    print(" ", r[0], r[1])
