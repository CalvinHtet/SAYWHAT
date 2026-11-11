#!/usr/bin/env bash
# QA's release-candidate run (v0.91, 2026-11-10): a clean worktree of the commit, a Live build (checked by wlive.js) and a sandbox
# build (everything else), then two chains of checks on two Chromes, outputs in $OUT/<name>.txt. Read the results by hand: each
# script prints ok/BAD lines or numbers to compare (docs/QA.md "Release checks").
#   bash rigtest/qa/run_rc.sh <commit> [out folder]      (Windows: needs tools/windows/node.sh; ports 8812 Live, 8817 sandbox)
#   REF=<reference sandbox URL for pricesweep>  APPV=<expected APPV>  LIVEPORT/SBXPORT/CA/CB to change the ports
set -uo pipefail
C=${1:?commit}; QB=$(cd "$(dirname "$0")/../.." && pwd); NODE="bash $QB/tools/windows/node.sh"; WT=${WT:-/c/Users/clvh/qa-wt}/qa-rc-$C
OUT=${2:-${WT}-out}; mkdir -p "$OUT"; LIVEPORT=${LIVEPORT:-8812}; SBXPORT=${SBXPORT:-8817}; CA=${CA:-9374}; CB=${CB:-9375}; APPV=${APPV:-91}
REF=${REF:-http://127.0.0.1:8818}
[ -d "$WT" ] || git -C "$QB" worktree add --detach "$WT" "$C" >/dev/null
bash "$QB/tools/windows/build_web.sh" "$WT/quest-board" | tail -1; rm -rf "$WT/quest-board/dist-live"; cp -r "$WT/quest-board/dist-web" "$WT/quest-board/dist-live"
bash "$QB/tools/windows/build_web.sh" "$WT/quest-board" sandbox | tail -1
serve() { local p; p=$(netstat -ano | grep -E ":$2 .*LISTENING" | awk '{print $5}' | head -1); [ -n "$p" ] && taskkill //PID "$p" //F >/dev/null 2>&1; sleep 1
  ( $NODE "$QB/rigtest/qa/qserve.js" "$1" "$2" > "$OUT/serve$2.log" 2>&1 & ); sleep 3; }
serve "$WT/quest-board/dist-live" $LIVEPORT; serve "$WT/quest-board/dist-web" $SBXPORT
B=http://127.0.0.1:$SBXPORT; cd "$QB"
run() { local name=$1 port=$2; shift 2; echo "$(date +%H:%M) $name" >> "$OUT/progress.log"; ( export CHROME_PORT=$port BASE=$B; "$@" ) > "$OUT/$name.txt" 2>&1; }
(
  run live $CA env BASE=http://127.0.0.1:$LIVEPORT DIST="$WT/quest-board/dist-live" APPV=$APPV timeout 150 $NODE rigtest/qa/wlive.js
  run sweep $CA env REF=$REF timeout 150 $NODE rigtest/qa/pricesweep.js
  run reset $CA env OUT="$OUT/reset/" CASES=adv,oldrest,mid,bedonly,fresh,v89adv,v89mid,adv88 timeout 450 $NODE rigtest/qa/wunlock_reset.js
  run twodev $CA timeout 200 $NODE rigtest/qa/wunlock_twodev.js
  run order $CA env OUT="$OUT/order/" timeout 200 $NODE rigtest/qa/wunlock_order.js
  run goals $CA env OUT="$OUT/goals/" timeout 200 $NODE rigtest/qa/wunlock_goals.js
  run nolevel $CA timeout 200 $NODE rigtest/qa/wnolevel.js
  run story $CA env OUT="$OUT/story/" timeout 200 $NODE rigtest/qa/deadend14.js
  run trainw $CA timeout 220 $NODE rigtest/qa/wtrainw.js
  run trainw_ss $CA env EXID=pushdown timeout 220 $NODE rigtest/qa/wtrainw.js
  run trainw_mi $CA env CEX=1 PLAN=c_cardio EXID=cx_1 W1=3.5 W2=4 LAST=2 timeout 220 $NODE rigtest/qa/wtrainw.js
  run salefix $CA timeout 150 $NODE rigtest/qa/wsale_fix.js
  echo "$(date +%H:%M) chain A done" >> "$OUT/progress.log"
) &
(
  run wsystem $CB env DIST="$WT/quest-board/dist-web" timeout 300 $NODE rigtest/qa/wsystem_lvl.js
  run shopui $CB env OUT="$OUT/shopui/" timeout 400 $NODE rigtest/qa/wshopui.js
  run smoke $CB env OUT="$OUT/smoke" timeout 280 $NODE rigtest/qa/rc089_smoke.js
  run nospoil3check $CB env OUT="$OUT/nospoil3check/" timeout 280 $NODE rigtest/qa/wnospoil3_check.js
  run saledays $CB env OUT="$OUT/sale" timeout 300 $NODE rigtest/qa/wsale_days.js
  run nospoil3play $CB env SRC="$WT/quest-board/app/src" OUT="$OUT/nospoil3play" timeout 1500 $NODE rigtest/qa/nospoil3_play.js
  echo "$(date +%H:%M) chain B done" >> "$OUT/progress.log"
) &
wait; echo "all done: $OUT"
