#!/usr/bin/env bash
# Runs VS Code's own Electron as Node (nothing installed): node.sh <script.js> [args]
export ELECTRON_RUN_AS_NODE=1
exec "/c/Program Files/Microsoft VS Code/Code.exe" "$@"
