#!/usr/bin/env bash
# Link local luminat checkout so `light` path dep resolves.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="$ROOT/vendor"
mkdir -p "$VENDOR"

# Prefer env, then common local path
SRC="${LUMINAT_PATH:-}"
if [[ -z "$SRC" ]]; then
  for c in \
    "$HOME/IGRS/luminat" \
    "$HOME/Documents/GitHub/luminat" \
    "$HOME/src/luminat" \
    "/Users/igor/IGRS/luminat"
  do
    if [[ -d "$c/light" ]]; then SRC="$c"; break; fi
  done
fi

if [[ -z "$SRC" || ! -d "$SRC/light" ]]; then
  echo "luminat not found. Clone it and set LUMINAT_PATH:"
  echo "  git clone https://github.com/isamarin/luminat.git"
  echo "  export LUMINAT_PATH=/path/to/luminat"
  echo "  ./scripts/link-luminat.sh"
  exit 1
fi

ln -sfn "$SRC" "$VENDOR/luminat"
echo "linked: $VENDOR/luminat -> $SRC"
ls -la "$VENDOR/luminat/light/Cargo.toml"
