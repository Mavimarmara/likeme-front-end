#!/usr/bin/env bash
# Valida secrets de assinatura Android e grava android/app/release.keystore no CI.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEYSTORE_PATH="$ROOT/android/app/release.keystore"
ANDROID_KEYSTORE_KEY_ALIAS="${ANDROID_KEYSTORE_KEY_ALIAS:-likeme-key-alias}"

# Um secret só (ANDROID_KEYSTORE_PASSWORD) ou store/key separados
if [[ -z "${ANDROID_KEYSTORE_STORE_PASSWORD:-}" && -n "${ANDROID_KEYSTORE_PASSWORD:-}" ]]; then
  ANDROID_KEYSTORE_STORE_PASSWORD="$ANDROID_KEYSTORE_PASSWORD"
fi
if [[ -z "${ANDROID_KEYSTORE_KEY_PASSWORD:-}" && -n "${ANDROID_KEYSTORE_PASSWORD:-}" ]]; then
  ANDROID_KEYSTORE_KEY_PASSWORD="$ANDROID_KEYSTORE_PASSWORD"
fi
if [[ -z "${ANDROID_KEYSTORE_KEY_PASSWORD:-}" && -n "${ANDROID_KEYSTORE_STORE_PASSWORD:-}" ]]; then
  ANDROID_KEYSTORE_KEY_PASSWORD="$ANDROID_KEYSTORE_STORE_PASSWORD"
fi
if [[ -z "${ANDROID_KEYSTORE_STORE_PASSWORD:-}" && -n "${ANDROID_KEYSTORE_KEY_PASSWORD:-}" ]]; then
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
  echo "::error::Crie no repositório (Actions → Secrets) ou no environment store-submit (job build-android). Pode usar um único secret ANDROID_KEYSTORE_PASSWORD para as duas senhas." >&2
  exit 1
fi

mkdir -p "$(dirname "$KEYSTORE_PATH")"
printf '%s' "$ANDROID_KEYSTORE_BASE64" | tr -d '\n\r ' | base64 -d > "$KEYSTORE_PATH"

size_bytes="$(wc -c < "$KEYSTORE_PATH" | tr -d ' ')"
if [[ "$size_bytes" -lt 100 ]]; then
  echo "::error::release.keystore inválido após decode (${size_bytes} bytes). Verifique ANDROID_KEYSTORE_BASE64." >&2
  exit 1
fi

if ! keytool -list \
  -keystore "$KEYSTORE_PATH" \
  -storepass "$ANDROID_KEYSTORE_STORE_PASSWORD" \
  -alias "$ANDROID_KEYSTORE_KEY_ALIAS" >/dev/null 2>&1; then
  echo "::error::Keystore ou senha não conferem (alias ${ANDROID_KEYSTORE_KEY_ALIAS})." >&2
  exit 1
fi

echo "Keystore Android OK (alias ${ANDROID_KEYSTORE_KEY_ALIAS}, ${size_bytes} bytes)"
