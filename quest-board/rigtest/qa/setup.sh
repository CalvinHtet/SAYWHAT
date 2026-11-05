#!/bin/bash
# QA: build a clean copy of a commit and serve it on 8769, so half-finished edits in the shared folder never show up as bugs.
#   rigtest/qa/setup.sh [commit]        (default: the latest commit on main)
# Prints the folder it built. Then: QB=<that folder>/quest-board node rigtest/qa/<script>.js
# Never touches the shared working folder's files: it only adds a detached worktree outside it.
set -e
REPO=$(cd "$(dirname "$0")/../../.." && pwd)
REF=${1:-main}
SHA=$(git -C "$REPO" rev-parse --short "$REF")
TMP=${QA_TMP:-${TMPDIR:-/tmp}/qb-qa}
WT="$TMP/wt-$SHA"
mkdir -p "$TMP"
if [ ! -d "$WT" ]; then
  git -C "$REPO" worktree add --detach "$WT" "$SHA" >/dev/null 2>&1
fi
python3 "$WT/quest-board/tools/build.py" >/dev/null
# the copies of rigtest/browser in this temp worktree point at QA's port (the shared scripts are not changed)
sed -i '' -e 's#127\.0\.0\.1:876[0-9]#127.0.0.1:8769#g' "$WT"/quest-board/rigtest/browser/*.js
# one server on 8769, always serving the newest built copy
PID=$(lsof -ti tcp:8769 -sTCP:LISTEN 2>/dev/null || true)
[ -n "$PID" ] && kill $PID && sleep 0.5
(cd "$WT/quest-board" && nohup python3 -m http.server 8769 --bind 127.0.0.1 >"$TMP/server.log" 2>&1 &)
sleep 0.8
curl -sf -o /dev/null http://127.0.0.1:8769/dist/index.html && echo "$WT"
