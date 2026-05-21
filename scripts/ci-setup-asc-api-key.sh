#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${ASC_API_KEY_P8:-}" ]]; then
  echo "::error::Defina o secret ASC_API_KEY_P8 (App Store Connect API Key, formato .p8)." >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEY_ID="${ASC_API_KEY_ID:-6QJ886URZD}"
ISSUER_ID="${ASC_API_ISSUER_ID:-f4a624c3-e2af-4ad0-a365-f60b90c2dc9d}"
KEY_PATH="${ROOT}/AuthKey_${KEY_ID}.p8"

printf '%s' "$ASC_API_KEY_P8" >"$KEY_PATH"
chmod 600 "$KEY_PATH"

echo "App Store Connect API Key: ${KEY_PATH}"

if [[ -n "${GITHUB_ENV:-}" ]]; then
  {
    echo "ASC_API_KEY_PATH=${KEY_PATH}"
    echo "ASC_API_KEY_ID=${KEY_ID}"
    echo "ASC_API_ISSUER_ID=${ISSUER_ID}"
    echo "API_PRIVATE_KEYS_DIR=${ROOT}"
  } >>"$GITHUB_ENV"
fi
