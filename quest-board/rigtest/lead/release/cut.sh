#!/bin/bash
# LEAD's release cut (docs/RELEASING.md). Kept in the repo: the scratchpad copies were lost when /tmp was cleared (2026-11-23).
#   bash quest-board/rigtest/lead/release/cut.sh <prev> <new> <APPV> "<message>" [source ref, default qa-local]
# Makes release/<new> from release/<prev> with quest-board/{app,src,data,art,tools} as they are on the source ref (files deleted there
# are deleted too; web/, firestore rules and the release-only noTest config stay as the previous release had them), sets APPV, and,
# with EPOCH=<n> in the environment, QB_EPOCH (only when Cal has asked for a reset of everyone). Then: what differs from the source
# (should be APPV/QB_EPOCH only), artcheck, and the rollback build moved to APPV+1. Nothing is pushed or deployed.
R=$(git -C "$(dirname "$0")" rev-parse --show-toplevel) || exit 1
PREV=$1; NEW=$2; V=$3; MSG=$4; SRC=${5:-qa-local}
[ -n "$PREV" ] && [ -n "$NEW" ] && [ -n "$V" ] && [ -n "$MSG" ] || { echo "usage: cut.sh <prev> <new> <APPV> <message> [src]"; exit 1; }
TMP=${TMPDIR:-/tmp}/qb_cut_$NEW
cd "$R" || exit 1
git worktree add -q -b "release/$NEW" "$TMP" "refs/heads/release/$PREV" || exit 1
cd "$TMP" || exit 1
P="quest-board/app quest-board/src quest-board/data quest-board/art quest-board/tools"
git checkout -q "$SRC" -- $P || { echo "STOP: checkout from $SRC failed"; exit 1; }
git diff --name-only --diff-filter=D "refs/heads/release/$PREV" "$SRC" -- $P > "$TMP.del"
while read -r f; do [ -n "$f" ] && git rm -q "$f"; done < "$TMP.del"
rm -f "$TMP.del"
python3 - "$V" "$EPOCH" <<'EOF'
import re, sys
v, ep = sys.argv[1], sys.argv[2]
p = 'quest-board/app/src/30_app_b.js'; s = open(p).read(); s2 = re.sub(r'APPV=\d+', 'APPV=' + v, s, count=1)
assert s2 != s or ('APPV=' + v) in s; open(p, 'w').write(s2)
if ep:
    p = 'quest-board/app/src/00_clock.js'; s = open(p).read(); s2 = re.sub(r'var QB_EPOCH=\d+;', 'var QB_EPOCH=' + ep + ';', s, count=1)
    assert s2 != s; open(p, 'w').write(s2)
EOF
git add -A quest-board/app quest-board/src quest-board/data quest-board/art quest-board/tools
git commit -q -m "$NEW: APPV $V${EPOCH:+, QB_EPOCH $EPOCH} ($MSG)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || { echo "STOP: nothing to commit"; exit 1; }
echo "--- differs from $SRC (want APPV${EPOCH:+ and QB_EPOCH} only):"
git diff --stat "$SRC" HEAD -- $P | cat
echo "--- vs release/$PREV:"; git diff --stat "refs/heads/release/$PREV" HEAD -- $P | tail -1
python3 -I "$R/quest-board/rigtest/lead/artcheck.py" "$TMP/quest-board"
cd "$R" && git worktree remove "$TMP"
[ -n "$DRY" ] && { echo "DRY: rollback not moved; delete the branch with: git branch -D release/$NEW"; exit 0; }
RB=${TMPDIR:-/tmp}/qb_rb_$NEW
git worktree add -q "$RB" refs/heads/rollback-v0.80 && cd "$RB" && git checkout -q rollback-v0.80 \
  && python3 -c "import re;p='quest-board/app/src/30_app_b.js';s=open(p).read();open(p,'w').write(re.sub(r'APPV=\d+','APPV=$((V+1))',s,count=1))" \
  && { [ -z "$EPOCH" ] || python3 -c "import re;p='quest-board/app/src/00_clock.js';s=open(p).read();open(p,'w').write(re.sub(r'var QB_EPOCH=\d+;','var QB_EPOCH=$EPOCH;',s,count=1))"; } \
  && git commit -qam "Rollback build: APPV $((V+1))${EPOCH:+, QB_EPOCH $EPOCH (a rollback carries the epoch of the saves)}, above $NEW

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git log --oneline -1 | cat
cd "$R" && git worktree remove "$RB"
echo "release/$NEW $(git rev-parse --short "refs/heads/release/$NEW")  rollback $(git rev-parse --short refs/heads/rollback-v0.80)"
