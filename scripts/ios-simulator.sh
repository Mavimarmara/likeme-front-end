#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

IOS_BUNDLE_ID="${IOS_BUNDLE_ID:-app.likeme.com}"
DERIVED="${ROOT}/ios/build/DerivedData"
APP="${DERIVED}/Build/Products/Debug-iphonesimulator/LikeMe.app"

echo "Removendo app antigo do simulador booted (${IOS_BUNDLE_ID})…"
xcrun simctl uninstall booted "${IOS_BUNDLE_ID}" 2>/dev/null || true

export LANG="${LANG:-en_US.UTF-8}"
export LC_ALL="${LC_ALL:-en_US.UTF-8}"

echo "pod install…"
(cd ios && pod install)

echo "npm run ios:xcode:build:debug…"
npm run ios:xcode:build:debug

if [[ ! -d "${APP}" ]]; then
  echo "ERRO: .app não encontrado em ${APP}" >&2
  exit 1
fi

echo "Instalando no simulador booted…"
xcrun simctl install booted "${APP}"

echo "Iniciando app (${IOS_BUNDLE_ID})…"
xcrun simctl launch booted "${IOS_BUNDLE_ID}"

echo "Pronto. Metro (outro terminal): npm run start:clear"
