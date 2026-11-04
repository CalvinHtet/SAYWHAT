#!/usr/bin/env bash
# Download generator output: fetch.sh <hf_file_stem> <name>   -> art/raw/<name>.png
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
USER_PATH="user_37s0v3uUPWobFrpAXcYZFARHxwd"
curl -sS -o "$HERE/art/raw/$2.png" "https://d8j0ntlcm91z4.cloudfront.net/$USER_PATH/$1.png"
