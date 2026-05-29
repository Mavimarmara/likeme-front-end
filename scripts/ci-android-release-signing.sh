#!/usr/bin/env bash
# Valida secrets de assinatura Android e grava android/app/release.keystore no CI.
set -euo pipefail

trim_secret() {
  printf '%s' "$1" | tr -d '\n\r'
}

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEYSTORE_PATH="$ROOT/android/app/release.keystore"
ANDROID_KEYSTORE_KEY_ALIAS="${ANDROID_KEYSTORE_KEY_ALIAS:-likeme-key-alias}"

ANDROID_KEYSTORE_STORE_PASSWORD="$(trim_secret "${ANDROID_KEYSTORE_STORE_PASSWORD:-}")"
ANDROID_KEYSTORE_KEY_PASSWORD="$(trim_secret "${ANDROID_KEYSTORE_KEY_PASSWORD:-}")"
ANDROID_KEYSTORE_PASSWORD="$(trim_secret "${ANDROID_KEYSTORE_PASSWORD:-}")"

if [[ -z "$ANDROID_KEYSTORE_STORE_PASSWORD" && -n "$ANDROID_KEYSTORE_PASSWORD" ]]; then
  ANDROID_KEYSTORE_STORE_PASSWORD="$ANDROID_KEYSTORE_PASSWORD"
fi
if [[ -z "$ANDROID_KEYSTORE_KEY_PASSWORD" && -n "$ANDROID_KEYSTORE_PASSWORD" ]]; then
  ANDROID_KEYSTORE_KEY_PASSWORD="$ANDROID_KEYSTORE_PASSWORD"
fi
if [[ -z "$ANDROID_KEYSTORE_KEY_PASSWORD" && -n "$ANDROID_KEYSTORE_STORE_PASSWORD" ]]; then
  ANDROID_KEYSTORE_KEY_PASSWORD="$ANDROID_KEYSTORE_STORE_PASSWORD"
fi
if [[ -z "$ANDROID_KEYSTORE_STORE_PASSWORD" && -n "$ANDROID_KEYSTORE_KEY_PASSWORD" ]]; then
  ANDROID_KEYSTORE_STORE_PASSWORD="$ANDROID_KEYSTORE_KEY_PASSWORD"
fi

required_vars=(
  ANDROID_KEYSTORE_BASE64
  ANDROID_KEYSTORE_STORE_PASSWORD
  ANDROID_KEYSTORE_KEY_PASSWORD
)

missing=()
for var in "${required_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    missing+=("$var")
  fi
done

if [[ ${#missing[@]} -gt 0 ]]; then
  echo "::error::Secrets Android ausentes: ${missing[*]}." >&2
  echo "::error::Crie em Settings → Secrets and variables → Actions (nível repositório). Pode usar um único ANDROID_KEYSTORE_PASSWORD." >&2
  exit 1
fi

mkdir -p "$(dirname "$KEYSTORE_PATH")"
printf '%s' "$ANDROID_KEYSTORE_BASE64" | tr -d '\n\r ' | base64 -d > "$KEYSTORE_PATH"

size_bytes="$(wc -c < "$KEYSTORE_PATH" | tr -d ' ')"
if [[ "$size_bytes" -lt 100 ]]; then
  echo "::error::release.keystore inválido após decode (${size_bytes} bytes). Regenere ANDROID_KEYSTORE_BASE64: base64 -i seu.keystore | tr -d '\\n'" >&2
  exit 1
fi

keystore_list_err="$(mktemp)"
keystore_opened=false
for storetype in PKCS12 JKS; do
  if keytool -list -keystore "$KEYSTORE_PATH" -storepass "$ANDROID_KEYSTORE_STORE_PASSWORD" -storetype "$storetype" >"$keystore_list_err" 2>&1; then
    keystore_opened=true
    break
  fi
done

if [[ "$keystore_opened" != true ]]; then
  file_hint="$(file -b "$KEYSTORE_PATH" 2>/dev/null || echo 'tipo desconhecido')"
  echo "::error::Senha incorreta ou ANDROID_KEYSTORE_BASE64 não é do mesmo .keystore do .env." >&2
  echo "::error::Arquivo decodificado: ${size_bytes} bytes, ${file_hint}" >&2
  echo "::error::Local: bash scripts/android-keystore-verify-local.sh → regenere o secret BASE64." >&2
  exit 1
fi

aliases_found="$(grep -E '^Alias name:' "$keystore_list_err" | sed 's/Alias name: //' || true)"
if ! grep -qxF "$ANDROID_KEYSTORE_KEY_ALIAS" <<<"$aliases_found"; then
  echo "::error::Alias '${ANDROID_KEYSTORE_KEY_ALIAS}' não existe neste keystore." >&2
  echo "::error::Aliases encontrados:" >&2
  while IFS= read -r a; do
    [[ -n "$a" ]] && echo "::error::  - $a" >&2
  done <<<"$aliases_found"
  echo "::error::Ajuste o alias no CI ou use o keystore correto no secret BASE64." >&2
  exit 1
fi

if ! keytool -list \
  -keystore "$KEYSTORE_PATH" \
  -storepass "$ANDROID_KEYSTORE_STORE_PASSWORD" \
  -keypass "$ANDROID_KEYSTORE_KEY_PASSWORD" \
  -alias "$ANDROID_KEYSTORE_KEY_ALIAS" >/dev/null 2>&1; then
  echo "::error::Senha da chave (ANDROID_KEYSTORE_KEY_PASSWORD) incorreta para o alias ${ANDROID_KEYSTORE_KEY_ALIAS}." >&2
  exit 1
fi

rm -f "$keystore_list_err"
echo "Keystore Android OK (alias ${ANDROID_KEYSTORE_KEY_ALIAS}, ${size_bytes} bytes)"
