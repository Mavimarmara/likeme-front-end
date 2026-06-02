#!/usr/bin/env bash
# Valida secrets de assinatura Android e grava android/app/release.keystore no CI.
set -euo pipefail

trim_secret() {
  printf '%s' "$1" | tr -d '\n\r'
}

list_keystore_aliases() {
  local list_file="$1"
  local aliases=()
  local line name seen=""

  while IFS= read -r line; do
    if [[ "$line" =~ ^Alias\ name:\ (.+)$ ]]; then
      name="${BASH_REMATCH[1]}"
      name="${name#"${name%%[![:space:]]*}"}"
      name="${name%"${name##*[![:space:]]}"}"
      if [[ -n "$name" && "$seen" != *"|${name}|"* ]]; then
        aliases+=("$name")
        seen+="|${name}|"
      fi
      continue
    fi
    if [[ "$line" =~ ^Entry\ alias:\ (.+)$ ]]; then
      name="${BASH_REMATCH[1]}"
      name="${name#"${name%%[![:space:]]*}"}"
      name="${name%"${name##*[![:space:]]}"}"
      if [[ -n "$name" && "$seen" != *"|${name}|"* ]]; then
        aliases+=("$name")
        seen+="|${name}|"
      fi
      continue
    fi
    if [[ "$line" =~ ^([^,]+),[[:space:]].*,[[:space:]]*(PrivateKeyEntry|SecretKeyEntry),[[:space:]]*$ ]]; then
      name="${BASH_REMATCH[1]}"
      name="${name#"${name%%[![:space:]]*}"}"
      name="${name%"${name##*[![:space:]]}"}"
      if [[ -n "$name" && "$seen" != *"|${name}|"* ]]; then
        aliases+=("$name")
        seen+="|${name}|"
      fi
    fi
  done <"$list_file"

  printf '%s\n' "${aliases[@]}"
}

key_entry_list_ok() {
  local alias="$1"
  local args=(
    -list
    -keystore "$KEYSTORE_PATH"
    -storepass "$ANDROID_KEYSTORE_STORE_PASSWORD"
    -alias "$alias"
  )
  [[ -n "$KEYSTORE_STORE_TYPE" ]] && args+=(-storetype "$KEYSTORE_STORE_TYPE")

  # PKCS12: key password pode ser obrigatória e diferente da store password
  if [[ -n "$ANDROID_KEYSTORE_KEY_PASSWORD" ]]; then
    keytool "${args[@]}" -keypass "$ANDROID_KEYSTORE_KEY_PASSWORD" >/dev/null 2>&1 && return 0
  fi
  keytool "${args[@]}" >/dev/null 2>&1
}

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEYSTORE_PATH="$ROOT/android/app/release.keystore"
ANDROID_KEYSTORE_KEY_ALIAS="$(trim_secret "${ANDROID_KEYSTORE_KEY_ALIAS:-}")"
if [[ -z "$ANDROID_KEYSTORE_KEY_ALIAS" ]]; then
  ANDROID_KEYSTORE_KEY_ALIAS="likeme-key-alias"
fi

ANDROID_KEYSTORE_STORE_PASSWORD="$(trim_secret "${ANDROID_KEYSTORE_STORE_PASSWORD:-}")"
ANDROID_KEYSTORE_KEY_PASSWORD="$(trim_secret "${ANDROID_KEYSTORE_KEY_PASSWORD:-}")"

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
  echo "::error::Crie em Settings → Secrets and variables → Actions (nível repositório)." >&2
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

if [[ "$alias_known" != true ]] && key_entry_list_ok "$ANDROID_KEYSTORE_KEY_ALIAS"; then
  echo "Alias confirmado via keytool (secret): ${ANDROID_KEYSTORE_KEY_ALIAS}"
  alias_known=true
fi

if [[ "$alias_known" != true ]]; then
  if [[ "${#keystore_aliases[@]}" -eq 1 && -n "${keystore_aliases[0]}" ]]; then
    ANDROID_KEYSTORE_KEY_ALIAS="${keystore_aliases[0]}"
    echo "Alias único no keystore (${KEYSTORE_STORE_TYPE}): ${ANDROID_KEYSTORE_KEY_ALIAS}"
    alias_known=true
  else
    echo "::error::Alias '${ANDROID_KEYSTORE_KEY_ALIAS}' não encontrado neste keystore." >&2
    echo "::error::Aliases detectados (${#keystore_aliases[@]}):" >&2
    if [[ "${#keystore_aliases[@]}" -eq 0 ]]; then
      echo "::error::  (nenhum — saída keytool pode ser formato PKCS12 não reconhecido)" >&2
      grep -E '^(Alias name:|Entry alias:|[^,]+,.*PrivateKeyEntry)' "$keystore_list_err" 2>/dev/null \
        | head -5 | sed 's/^/::error::  keytool: /' >&2 || true
    else
      for a in "${keystore_aliases[@]}"; do
        echo "::error::  - ${a}" >&2
      done
    fi
    echo "::error::Secret ANDROID_KEYSTORE_KEY_ALIAS deve ser o alias da upload key, sem espaços." >&2
    rm -f "$keystore_list_err"
    exit 1
  fi
fi

if ! key_entry_list_ok "$ANDROID_KEYSTORE_KEY_ALIAS"; then
  echo "::error::Não foi possível validar alias '${ANDROID_KEYSTORE_KEY_ALIAS}' (store/key password ou alias incorreto)." >&2
  if [[ "$KEYSTORE_STORE_TYPE" == "PKCS12" ]]; then
    echo "::error::PKCS12: confira ANDROID_KEYSTORE_STORE_PASSWORD, ANDROID_KEYSTORE_KEY_PASSWORD e ANDROID_KEYSTORE_KEY_ALIAS." >&2
  fi
  rm -f "$keystore_list_err"
  exit 1
fi

if [[ -n "${GITHUB_ENV:-}" ]]; then
  echo "ANDROID_KEYSTORE_KEY_ALIAS=${ANDROID_KEYSTORE_KEY_ALIAS}" >>"$GITHUB_ENV"
fi

rm -f "$keystore_list_err"
echo "Keystore Android OK (alias ${ANDROID_KEYSTORE_KEY_ALIAS}, ${size_bytes} bytes, ${KEYSTORE_STORE_TYPE})"
