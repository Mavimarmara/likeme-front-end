#!/usr/bin/env bash
# Valida keystore local (.env) e gera BASE64 para o secret ANDROID_KEYSTORE_BASE64 no GitHub.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-}"
if [[ -z "$ENV_FILE" ]]; then
  for candidate in "$ROOT/.env.production" "$ROOT/.env"; do
    if [[ -f "$candidate" ]]; then
      ENV_FILE="$candidate"
      break
    fi
  done
fi

if [[ -z "$ENV_FILE" || ! -f "$ENV_FILE" ]]; then
  echo "Nenhum .env ou .env.production com ANDROID_KEYSTORE_* em $ROOT" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a
echo "Usando: $ENV_FILE"

KEYSTORE_REL="${ANDROID_KEYSTORE_STORE_FILE:-likeme-release.keystore}"
STORE_PASS="${ANDROID_KEYSTORE_STORE_PASSWORD:-}"
KEY_PASS="${ANDROID_KEYSTORE_KEY_PASSWORD:-$STORE_PASS}"
ALIAS="${ANDROID_KEYSTORE_KEY_ALIAS:-likeme-key-alias}"

KEYSTORE_PATH=""
for candidate in \
  "$ROOT/$KEYSTORE_REL" \
  "$ROOT/android/$KEYSTORE_REL" \
  "$ROOT/android/app/$KEYSTORE_REL" \
  "$KEYSTORE_REL"; do
  if [[ -f "$candidate" ]]; then
    KEYSTORE_PATH="$candidate"
    break
  fi
done

if [[ -z "$KEYSTORE_PATH" ]]; then
  echo "Keystore não encontrado: $KEYSTORE_REL" >&2
  echo "Procurei em: $ROOT, $ROOT/android, $ROOT/android/app" >&2
  exit 1
fi

if [[ -z "$STORE_PASS" ]]; then
  echo "Defina ANDROID_KEYSTORE_STORE_PASSWORD no .env" >&2
  exit 1
fi

echo "Keystore: $KEYSTORE_PATH ($(wc -c < "$KEYSTORE_PATH" | tr -d ' ') bytes)"
echo "Alias esperado: $ALIAS"

list_ok=false
for storetype in PKCS12 JKS; do
  if keytool -list -keystore "$KEYSTORE_PATH" -storepass "$STORE_PASS" -storetype "$storetype" >/dev/null 2>&1; then
    echo "Senha OK (formato $storetype)"
    list_ok=true
    break
  fi
done

if [[ "$list_ok" != true ]]; then
  echo "Falha: senha do .env não abre este arquivo." >&2
  echo "Use a senha definida na criação do keystore ou baixe o keystore correto (EAS/Play)." >&2
  exit 1
fi

if ! keytool -list -keystore "$KEYSTORE_PATH" -storepass "$STORE_PASS" -alias "$ALIAS" >/dev/null 2>&1; then
  echo "Aliases no arquivo:"
  keytool -list -keystore "$KEYSTORE_PATH" -storepass "$STORE_PASS" 2>/dev/null | grep 'Alias name:' || true
  echo "Ajuste ANDROID_KEYSTORE_KEY_ALIAS no .env ou use o keystore certo." >&2
  exit 1
fi

OUT_B64="/tmp/likeme-android-keystore.b64"
base64 -i "$KEYSTORE_PATH" | tr -d '\n' >"$OUT_B64"
b64_len="$(wc -c < "$OUT_B64" | tr -d ' ')"

echo ""
echo "BASE64 gerado: $OUT_B64 ($b64_len caracteres)"
echo "Atualize no GitHub → Settings → Secrets → ANDROID_KEYSTORE_BASE64"
echo "Senhas no GitHub devem ser iguais ao .env:"
echo "  ANDROID_KEYSTORE_STORE_PASSWORD"
echo "  ANDROID_KEYSTORE_KEY_PASSWORD"
