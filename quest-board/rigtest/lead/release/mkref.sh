#!/bin/bash
# A frozen build of any commit, served for side-by-side checks (the plain build, not the web one).
#   bash quest-board/rigtest/lead/release/mkref.sh <commit> <port>     then open http://127.0.0.1:<port>/dist/index.html
R=$(git -C "$(dirname "$0")" rev-parse --show-toplevel) || exit 1
C=$1; PORT=${2:-8839}
OUT=${TMPDIR:-/tmp}/qb_ref_$PORT
WT=${TMPDIR:-/tmp}/qb_refwt_$PORT
git -C "$R" worktree add -q --detach "$WT" "$C" || exit 1
(cd "$WT/quest-board" && python3 tools/build.py | tail -1)
rm -rf "$OUT" && mkdir -p "$OUT"
cp -R "$WT/quest-board/dist" "$OUT/dist" && cp -R "$WT/quest-board/art" "$OUT/art"
git -C "$R" worktree remove --force "$WT"
(cd "$OUT" && nohup python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &)
sleep 1
curl -s -o /dev/null -w "ref $C on $PORT: %{http_code}\n" "http://127.0.0.1:$PORT/dist/index.html"
