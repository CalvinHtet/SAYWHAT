#!/usr/bin/env bash
# Stand-in for quest-board/tools/build.py with QB_TARGET=web (plus QB_SANDBOX=1 when $2 is "sandbox"),
# for a machine with no Python. Same steps and the same dist-web/ layout; blobs.js stays one piece.
#   build_web.sh <path to quest-board> [sandbox]
set -euo pipefail
ROOT=$(cd "$1" && pwd); SANDBOX=${2:-}
APP="$ROOT/app"; WEBDIR="$ROOT/web"; DIST="$ROOT/dist-web"
export LC_ALL=C
mkdir -p "$DIST/art"
rm -f "$DIST"/*.js

# app/src/*.js joined in filename order: the app shares one closure
: > "$DIST/app.js"
for f in $(ls -1 "$APP/src" | grep '\.js$' | sort); do cat "$APP/src/$f" >> "$DIST/app.js"; done

for n in rig.js look.js creator.js loft_bridge.js; do cp "$ROOT/src/$n" "$DIST/$n"; done
find "$ROOT/art/app" -maxdepth 1 -name '*.webp' -exec cp -t "$DIST/art/" {} +
cp "$APP/blobs.js" "$DIST/blobs.js"

# qbdata.js: the data files plus a fingerprint of every picture
{
  printf 'window.QBDATA={'
  sep=''
  for n in rig bodies poses creator loft items rsart; do printf '%s"%s":' "$sep" "$n"; cat "$ROOT/data/$n.json"; sep=','; done
  printf ',"arthash":{'
  (cd "$DIST/art" && find . -maxdepth 1 -name '*.webp' -print0 | sort -z | xargs -0 sha1sum) |
    awk 'BEGIN{ORS=""} {n=$2; sub(/^\*/,"",n); sub(/^\.\//,"",n); if (NR>1) print ","; printf "\"%s\":\"%s\"", n, substr($1,1,10)}'
  printf '}};\n'
} > "$DIST/qbdata.js"

for n in firebase-app-compat.js firebase-auth-compat.js firebase-firestore-compat.js; do cp "$WEBDIR/vendor/$n" "$DIST/$n"; done
cp "$WEBDIR/config.js" "$WEBDIR/web.js" "$DIST/"
if [ "$SANDBOX" = sandbox ]; then printf '\nwindow.QB_WEB.sandbox = true;\nwindow.QB_WEB.noTest = false; /* local sandbox: Test tools on, as RELEASING.md says */\n' >> "$DIST/config.js"; fi
cp "$APP/lfvar.json" "$DIST/lfvar.json"

SCRIPTS=(firebase-app-compat.js firebase-auth-compat.js firebase-firestore-compat.js config.js blobs.js qbdata.js web.js
         rig.js look.js creator.js loft_bridge.js app.js)
files='['; sep=''
for s in "${SCRIPTS[@]}"; do
  h=$(sha1sum "$DIST/$s" | cut -c1-10); sz=$(stat -c %s "$DIST/$s")
  files+="$sep[\"$s?h=$h\", $sz]"; sep=', '
done
files+=']'

tags=$(cat "$APP/loader.html")
tags=${tags/"/*FILES*/[]"/"$files"}
page=$(cat "$APP/index.html")
page=${page/"<!--APP-SCRIPTS-->"/"$tags"}

cp "$WEBDIR/manifest.webmanifest" "$WEBDIR/sw.js" "$DIST/"
mkdir -p "$DIST/icons"; cp -r "$WEBDIR/icons/." "$DIST/icons/"
head='<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png"><link rel="icon" href="icons/icon-192.png"><meta name="theme-color" content="#14121c"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black"><meta name="apple-mobile-web-app-title" content="SAYWHAT">'
page=${page/"</head>"/"$head</head>"}
page=${page//"<title>Quest Board</title>"/"<title>SAYWHAT</title>"}
printf '%s\n' "$page" > "$DIST/index.html"
# version.json, as tools/build.py writes it (the "New Update!" check)
appv=$(grep -oE "\bAPPV=[0-9]+" "$APP/src/30_app_b.js" | head -1 | cut -d= -f2)
printf '{"appv": %s}' "${appv:-0}" > "$DIST/version.json"

echo "dist-web $(du -sm "$DIST" | cut -f1) MB, page $(( $(stat -c %s "$DIST/index.html") / 1000 )) KB, app.js $(( $(stat -c %s "$DIST/app.js") / 1000 )) KB, $(ls "$DIST/art" | wc -l) pictures${SANDBOX:+ (sandbox)}"
