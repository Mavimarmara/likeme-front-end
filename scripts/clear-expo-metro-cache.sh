#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[clear-expo-metro-cache] Limpando caches em: $ROOT"

rm -rf .expo
rm -rf node_modules/.cache

TMP="${TMPDIR:-/tmp}"
shopt -s nullglob
for f in "${TMP}"/metro-* "${TMP}"/haste-map-*; do
  rm -rf "$f"
done
shopt -u nullglob

if command -v watchman >/dev/null 2>&1; then
  watchman watch-del-all 2>/dev/null || true
fi

echo "[clear-expo-metro-cache] Concluído."
