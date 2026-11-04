#!/usr/bin/env bash
# One 2x2 item sheet -> layers for both bodies and both views.
#   ingest4.sh <hf_file_stem> <item>
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
bash "$HERE/ingest.sh" "$1" "$2" m_front m_back f_front f_back
