#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

ACTION="${1:-}"
if [[ "$ACTION" != "validate" && "$ACTION" != "upload" ]]; then
  echo "Uso: $0 validate|upload" >&2
  echo "Variáveis opcionais: ASC_IPA_PATH, ASC_API_KEY_ID, ASC_API_ISSUER_ID, API_PRIVATE_KEYS_DIR" >&2
  exit 1
fi

IPA_PATH="${ASC_IPA_PATH:-$ROOT/ios/build/export/LikeMe.ipa}"
KEY_ID="${ASC_API_KEY_ID:-6QJ886URZD}"
ISSUER_ID="${ASC_API_ISSUER_ID:-f4a624c3-e2af-4ad0-a365-f60b90c2dc9d}"
export API_PRIVATE_KEYS_DIR="${API_PRIVATE_KEYS_DIR:-$ROOT}"

if [[ ! -f "$IPA_PATH" ]]; then
  echo "Erro: IPA não encontrado: $IPA_PATH" >&2
  echo "Gere antes com: npm run ios:xcode:export (e archive correspondente em ios/build/)." >&2
  exit 1
fi

KEY_FILE="$API_PRIVATE_KEYS_DIR/AuthKey_${KEY_ID}.p8"
if [[ ! -f "$KEY_FILE" ]]; then
  echo "Erro: chave API não encontrada: $KEY_FILE" >&2
  echo "Coloque AuthKey_${KEY_ID}.p8 em API_PRIVATE_KEYS_DIR (default: raiz do repo)." >&2
  exit 1
fi

if [[ "$ACTION" == "validate" ]]; then
  xcrun altool --validate-app -f "$IPA_PATH" -t ios --apiKey "$KEY_ID" --apiIssuer "$ISSUER_ID"
else
  xcrun altool --upload-app -f "$IPA_PATH" -t ios --apiKey "$KEY_ID" --apiIssuer "$ISSUER_ID"
fi
