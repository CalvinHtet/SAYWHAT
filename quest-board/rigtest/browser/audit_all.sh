#!/usr/bin/env bash
# Every room audit in one go: footprints, draw order, stations, then screenshots of every room fully upgraded.
# OUT=dir bash audit_all.sh
set -u
OUT="${OUT:-shots}"; mkdir -p "$OUT"; cd "$(dirname "$0")"
echo "== gaps (closest furniture pairs, anything outside its room)"; OUT="$OUT" node gaps.js 2>&1 | grep -v "^errs"
echo "== depth (drawn in the wrong order against its footprint)"; OUT="$OUT" node depth.js 2>&1 | grep -v " 0 bad$"
echo "== stations (spots inside furniture, seats on air, outside the room)"; OUT="$OUT" node stations.js 2>&1 | grep -v " ok$"
echo "== screenshots"; OUT="$OUT" node rooms.js 2>&1 | tail -3
