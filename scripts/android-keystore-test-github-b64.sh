#!/usr/bin/env bash
# Testa o mesmo conteúdo do secret ANDROID_KEYSTORE_BASE64 com senhas do .env.
# Uso:
#   pbcopy < secret-base64.txt   # cole o secret do GitHub num arquivo
#   bash scripts/android-keystore-test-github-b64.sh secret-base64.txt
# Ou: ANDROID_KEYSTORE_BASE64="$(cat secret-base64.txt)" bash scripts/android-keystore-test-github-b64.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
B64_INPUT="${1:-}"

load_env() {
  local env_file="$1"
  [[ -f "$env_file" ]] || return 1
  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a
  return 0
}

for env_file in "$ROOT/.env.production" "$ROOT/.env"; do
  if load_env "$env_file"; then
    echo "Variáveis carregadas de: $env_file"
    break
  fi
done

STORE_PASS="${ANDROID_KEYSTORE_STORE_PASSWORD:-}"
ALIAS="${ANDROID_KEYSTORE_KEY_ALIAS:-likeme-key-alias}"
TMP_KS="$(mktemp)"
trap 'rm -f "$TMP_KS"' EXIT

if [[ -n "$B64_INPUT" && -f "$B64_INPUT" ]]; then
  tr -d '\n\r ' <"$B64_INPUT" | base64 -d >"$TMP_KS"
elif [[ -n "${ANDROID_KEYSTORE_BASE64:-}" ]]; then
  printf '%s' "$ANDROID_KEYSTORE_BASE64" | tr -d '\n\r ' | base64 -d >"$TMP_KS"
else
  echo "Uso: $0 arquivo-com-base64-do-github.txt" >&2
  echo "Ou defina ANDROID_KEYSTORE_BASE64 no ambiente." >&2
  exit 1
fi

size_bytes="$(wc -c < "$TMP_KS" | tr -d ' ')"
echo "Keystore decodificado: ${size_bytes} bytes ($(file -b "$TMP_KS" 2>/dev/null || echo '?'))"

debug_path="$ROOT/android/app/debug.keystore"
if [[ -f "$debug_path" ]]; then
  debug_size="$(wc -c < "$debug_path" | tr -d ' ')"
  if [[ "$size_bytes" == "$debug_size" ]]; then
    echo "Tamanho igual ao debug.keystore — pode ser o keystore de debug no GitHub (não serve para Play)."
  else
    echo "Tamanho diferente do debug.keystore (${debug_size} bytes)."
  fi
fi

try_open() {
  local label="$1"
  local pass="$2"
  local out
  if out="$(keytool -list -keystore "$TMP_KS" -storepass "$pass" 2>&1)"; then
    echo "OK com senha: $label"
    echo "$out" | grep -E '^Alias name:' || true
    return 0
  fi
  echo "Falhou ($label)"
  return 1
}

opened=false
if [[ -n "$STORE_PASS" ]]; then
  try_open "ANDROID_KEYSTORE_STORE_PASSWORD (.env)" "$STORE_PASS" && opened=true
fi
try_open "debug (android)" "android" && opened=true

if [[ "$opened" != true ]]; then
  echo "" >&2
  echo "Nenhuma senha abriu este arquivo." >&2
  echo "O BASE64 no GitHub não combina com o .env — regenere o secret a partir do .keystore correto:" >&2
  echo "  base64 -i SEU_ARQUIVO.keystore | tr -d '\\n' | pbcopy" >&2
  exit 1
fi

alias_ok=false
if [[ -n "$STORE_PASS" ]]; then
  if keytool -list -keystore "$TMP_KS" -storepass "$STORE_PASS" -alias "$ALIAS" >/dev/null 2>&1; then
    alias_ok=true
  elif keytool -list -keystore "$TMP_KS" -storepass "$STORE_PASS" -storetype PKCS12 -alias "$ALIAS" >/dev/null 2>&1; then
    alias_ok=true
  fi
fi

if [[ "$alias_ok" == true ]]; then
  echo "Alias '$ALIAS' encontrado com senha do .env."
  echo "Secrets no GitHub: ANDROID_KEYSTORE_STORE_PASSWORD, ANDROID_KEYSTORE_KEY_PASSWORD, ANDROID_KEYSTORE_KEY_ALIAS=$ALIAS"
else
  echo "Arquivo abre, mas alias '$ALIAS' não confere — liste aliases:"
  keytool -list -keystore "$TMP_KS" -storepass "$STORE_PASS" 2>/dev/null \
    | grep -E '^(Alias name:|Entry alias:|[^,]+,.*PrivateKeyEntry)' || true
fi
