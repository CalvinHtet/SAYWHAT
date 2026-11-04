#!/usr/bin/env bash
# Ingest item sheets, then preview their raw art so a person can catch mislabels.
#   QB_PY=... qb_batch.sh <preview.png> <stem> <item> [<stem> <item> ...]
set -uo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$1"; shift
python3 "$HERE/tools/ingest_items.py" "$@"
NAMES=(); i=0
for a in "$@"; do if [ $((i % 2)) -eq 1 ]; then NAMES+=("$a"); fi; i=$((i + 1)); done
"$QB_PY" -W ignore -I - "$HERE/art/raw" "$OUT" "${NAMES[@]}" <<'EOF'
import os, sys
from PIL import Image, ImageDraw
raw, out, names = sys.argv[1], sys.argv[2], sys.argv[3:]
S = 250
sheet = Image.new("RGB", (S * len(names), S + 14), (30, 30, 36))
d = ImageDraw.Draw(sheet)
for i, n in enumerate(names):
    p = f"{raw}/{n}.png"
    if os.path.exists(p):
        sheet.paste(Image.open(p).convert("RGB").resize((S - 2, S)), (i * S, 14))
    d.text((i * S + 3, 1), n, fill=(255, 255, 255))
sheet.save(out)
EOF
