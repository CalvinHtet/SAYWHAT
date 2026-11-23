#!/bin/bash
# LEAD's ship (docs/RELEASING.md): a QA-passed release commit to Live and the Test channel, with the checks on the way. Kept in the repo.
#   bash quest-board/rigtest/lead/release/ship.sh <commit> <APPV>
# Clean web build in a worktree, the build checks, QA's Live check (rigtest/qa/wlive.js), deploy to Live and to the Test channel, then
# every built file compared with what each site serves. Stops before deploying if a check fails. The Test channel's address is looked
# up from Firebase and never printed.
R=$(git -C "$(dirname "$0")" rev-parse --show-toplevel) || exit 1
HERE="$R/quest-board/rigtest/lead/release"
C=$(git -C "$R" rev-parse "$1") || exit 1
WANT=$2
[ -n "$WANT" ] || { echo "usage: ship.sh <commit> <APPV>"; exit 1; }
WT=${TMPDIR:-/tmp}/qb_ship_$WANT
LIVEURL=https://saywhat-b7ae8.web.app
FB="npx -y firebase-tools@15.35.0"
git -C "$R" worktree add -q --detach "$WT" "$C" || exit 1
cd "$WT/quest-board" || exit 1
QB_TARGET=web python3 tools/build.py | tail -1
echo "$C" > dist-web/version.txt
echo "checks: noTest $(grep -c 'noTest: true' dist-web/config.js) (1), $(grep -oE 'APPV=[0-9]+' dist-web/app.js | head -1) (want $WANT), $(grep -oE 'QB_EPOCH=[0-9]+' dist-web/app.js | head -1), files $(find dist-web -type f | wc -l)"
grep -q "APPV=$WANT" dist-web/app.js || { echo "STOP: APPV is not $WANT"; cd "$R" && git worktree remove --force "$WT"; exit 1; }
cd dist-web || exit 1
python3 -m http.server 8812 --bind 127.0.0.1 >/dev/null 2>&1 &
SRV=$!
sleep 2
cd "$WT/quest-board" || exit 1
BASE=http://127.0.0.1:8812 DIST="$WT/quest-board/dist-web" APPV="$WANT" CHROME_PORT=9374 node rigtest/qa/wlive.js > "$WT.wlive.txt" 2>&1
T=$?
kill "$SRV" 2>/dev/null
wait "$SRV" 2>/dev/null
tail -3 "$WT.wlive.txt" | cut -c1-200
[ "$T" = "0" ] || { echo "STOP: Live check failed, nothing deployed (log $WT.wlive.txt)"; cd "$R" && git worktree remove --force "$WT"; exit 1; }
TU=$($FB hosting:channel:list --project saywhat-b7ae8 --json 2>/dev/null | python3 -c "import json,sys;d=json.load(sys.stdin);print([c['url'] for c in d['result']['channels'] if c['name'].endswith('/channels/test')][0])")
[ -n "$TU" ] || { echo "STOP: could not find the Test channel"; cd "$R" && git worktree remove --force "$WT"; exit 1; }
echo "Live before: $(curl -s -m 20 "$LIVEURL/version.txt?cb=$RANDOM" | cut -c1-7)"
$FB deploy --only hosting --project saywhat-b7ae8 --non-interactive -m "APPV $WANT ${C:0:7}" 2>&1 | grep -E 'Deploy complete|Error' | cut -c1-160
$FB hosting:channel:deploy test --expires 30d --project saywhat-b7ae8 --json 2>&1 | grep -c '"status": "success"' | sed 's/^/Test channel success lines: /'
sleep 20
echo "Live $(curl -s -m 20 "$LIVEURL/version.txt?cb=$RANDOM" | cut -c1-7)  Test $(curl -s -m 20 "$TU/version.txt?cb=$RANDOM" | cut -c1-7)  (want ${C:0:7})"
python3 -I "$HERE/livecmp.py" "$WT/quest-board/dist-web" "$LIVEURL"
python3 -I "$HERE/livecmp.py" "$WT/quest-board/dist-web" "$TU"
cd "$R" && git worktree remove --force "$WT"
echo finished
