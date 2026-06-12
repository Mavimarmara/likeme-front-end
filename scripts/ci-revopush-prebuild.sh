#!/usr/bin/env bash
# Aplica o plugin @revopush/expo-code-push-plugin no projeto nativo (Info.plist, AppDelegate, etc.).
# Necessário quando o pacote JS está instalado mas o prebuild local não foi rodado com as deployment keys.
set -euo pipefail

PLATFORM="${1:?Uso: ci-revopush-prebuild.sh android|ios}"

require_secret() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "::error::Secret ausente: ${name}. Cadastre em GitHub → Settings → Secrets (ou environment store-submit)." >&2
    exit 1
  fi
}

require_secret REVOPUSH_DEPLOYMENT_KEY_IOS_PRODUCTION
require_secret REVOPUSH_DEPLOYMENT_KEY_ANDROID_PRODUCTION

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export EXCLUDE_EXPO_DEV_CLIENT=1
echo "Revopush: expo prebuild --platform ${PLATFORM} (Production keys)"
npx expo prebuild --platform "$PLATFORM" --no-install
