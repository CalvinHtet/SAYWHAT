#!/usr/bin/env bash
# One generated item sheet -> clean registered layers for every view on it.
#   ingest.sh <hf_file_stem> <item> <view> [view ...]
#   ingest.sh hf_2026_x hoodie m_front m_back f_front f_back
# Writes art/raw/<item>.png and art/layers/<body>_<item>_<side>.png
# Exits non-zero, writing nothing, if a view strays off the body it should trace.
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
PY="${QB_PY:-python3}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
STEM="$1"; ITEM="$2"; shift 2
# A stem of "-" reprocesses the sheet already in art/raw.
[ "$STEM" = "-" ] || bash "$HERE/tools/fetch.sh" "$STEM" "$ITEM"
OUTS=(); for v in "$@"; do OUTS+=("$TMP/$v.png"); done
"$PY" -W ignore -I "$HERE/tools/sheet2v.py" split "$HERE/art/raw/$ITEM.png" "${OUTS[@]}"
for v in "$@"; do "$PY" -W ignore -I "$HERE/tools/art.py" check "$TMP/$v.png" "$HERE/art/sil/$v.png" "${QB_STRAY:-0.02}"; done
for v in "$@"; do "$PY" -W ignore -I "$HERE/tools/art.py" layer "$TMP/$v.png" "$HERE/art/layers/${v%%_*}_${ITEM}_${v##*_}.png" "$HERE/art/sil/$v.png"; done
