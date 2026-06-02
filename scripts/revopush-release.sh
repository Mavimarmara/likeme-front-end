#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

PLATFORM="${1:-}"
DEPLOYMENT="${2:-Production}"
DESCRIPTION="${3:-}"

if [[ "$PLATFORM" != "ios" && "$PLATFORM" != "android" ]]; then
  echo "Uso: $0 <ios|android> [deployment] [descricao]"
  echo "Exemplo: $0 ios Production \"Fix i18n hydration\""
  exit 1
fi

APP_NAME=""
if [[ "$PLATFORM" == "ios" ]]; then
  APP_NAME="${REVOPUSH_APP_NAME_IOS:-LikeMe-iOS}"
else
  APP_NAME="${REVOPUSH_APP_NAME_ANDROID:-LikeMe-Android}"
fi

ARGS=(release-react "$APP_NAME" "$PLATFORM" -d "$DEPLOYMENT" --useHermes true --entry-file index.js)

if [[ -n "$DESCRIPTION" ]]; then
  ARGS+=(--description "$DESCRIPTION")
fi

echo "Revopush → app=$APP_NAME platform=$PLATFORM deployment=$DEPLOYMENT"
npx revopush "${ARGS[@]}"
