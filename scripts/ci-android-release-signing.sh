#!/usr/bin/env bash
# Valida secrets de assinatura Android e grava android/app/release.keystore no CI.
set -euo pipefail

trim_secret() {
  printf '%s' "$1" | tr -d '\n\r'
}

list_keystore_aliases() {
  local list_file="$1"
  local aliases=()
  local line name

  while IFS= read -r line; do
    if [[ "$line" =~ ^Alias\ name:\ (.+)$ ]]; then
      aliases+=("${BASH_REMATCH[1]}")
      continue
    fi
    if [[ "$line" == *,\ PrivateKeyEntry, || "$line" == *,\ SecretKeyEntry, ]]; then
      name="${line%%,*}"
      name="${name#"${name%%[![:space:]]*}"}"
      [[ -n "$name" ]] && aliases+=("$name")
    fi
  done <"$list_file"

  printf '%s\n' "${aliases[@]}"
}

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEYSTORE_PATH="$ROOT/android/app/release.keystore"
ANDROID_KEYSTORE_KEY_ALIAS="$(trim_secret "${ANDROID_KEYSTORE_KEY_ALIAS:-}")"
if [[ -z "$ANDROID_KEYSTORE_KEY_ALIAS" ]]; then
  ANDROID_KEYSTORE_KEY_ALIAS="likeme-key-alias"
fi

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
KEYSTORE_STORE_TYPE=""
for storetype in PKCS12 JKS; do
  if keytool -list -keystore "$KEYSTORE_PATH" -storepass "$ANDROID_KEYSTORE_STORE_PASSWORD" -storetype "$storetype" >"$keystore_list_err" 2>&1; then
    keystore_opened=true
    KEYSTORE_STORE_TYPE="$storetype"
    break
  fi
done

if [[ "$keystore_opened" != true ]]; then
  file_hint="$(file -b "$KEYSTORE_PATH" 2>/dev/null || echo 'tipo desconhecido')"
  echo "::error::Senha incorreta ou ANDROID_KEYSTORE_BASE64 não é do mesmo keystore." >&2
  echo "::error::Arquivo decodificado: ${size_bytes} bytes, ${file_hint}" >&2
  exit 1
fi

mapfile -t keystore_aliases < <(list_keystore_aliases "$keystore_list_err")
alias_known=false
for a in "${keystore_aliases[@]}"; do
  if [[ "$a" == "$ANDROID_KEYSTORE_KEY_ALIAS" ]]; then
    alias_known=true
    break
  fi
done

if [[ "$alias_known" != true ]]; then
  if [[ "${#keystore_aliases[@]}" -eq 1 ]]; then
    ANDROID_KEYSTORE_KEY_ALIAS="${keystore_aliases[0]}"
    echo "Alias único no keystore (${KEYSTORE_STORE_TYPE}): ${ANDROID_KEYSTORE_KEY_ALIAS}"
    alias_known=true
  else
    echo "::error::Alias configurado não existe neste keystore." >&2
    echo "::error::Aliases no arquivo (${#keystore_aliases[@]}):" >&2
    for a in "${keystore_aliases[@]}"; do
      echo "::error::  - ${a}" >&2
    done
    echo "::error::Defina secret ANDROID_KEYSTORE_KEY_ALIAS com um dos nomes acima (EAS costuma diferir de likeme-key-alias)." >&2
    rm -f "$keystore_list_err"
    exit 1
  fi
fi

if ! keytool -list \
  -keystore "$KEYSTORE_PATH" \
  -storepass "$ANDROID_KEYSTORE_STORE_PASSWORD" \
  -keypass "$ANDROID_KEYSTORE_KEY_PASSWORD" \
  -alias "$ANDROID_KEYSTORE_KEY_ALIAS" \
  ${KEYSTORE_STORE_TYPE:+-storetype "$KEYSTORE_STORE_TYPE"} >/dev/null 2>&1; then
  echo "::error::Senha da chave incorreta para o alias ${ANDROID_KEYSTORE_KEY_ALIAS}." >&2
  rm -f "$keystore_list_err"
  exit 1
fi

if [[ -n "${GITHUB_ENV:-}" ]]; then
  echo "ANDROID_KEYSTORE_KEY_ALIAS=${ANDROID_KEYSTORE_KEY_ALIAS}" >>"$GITHUB_ENV"
fi

rm -f "$keystore_list_err"
echo "Keystore Android OK (alias ${ANDROID_KEYSTORE_KEY_ALIAS}, ${size_bytes} bytes, ${KEYSTORE_STORE_TYPE})"
