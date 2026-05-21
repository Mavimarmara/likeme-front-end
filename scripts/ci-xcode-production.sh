#!/usr/bin/env bash
# Build/archive Production no CI com perfil App Store já instalado (sem conta Xcode no runner).
set -euo pipefail

ACTION="${1:?Uso: ci-xcode-production.sh build|archive}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/ios"

: "${IOS_PROVISIONING_PROFILE_UUID:?Defina IOS_PROVISIONING_PROFILE_UUID (step ci-install-ios-provisioning-profile)}"

TEAM_ID="${IOS_DEVELOPMENT_TEAM:-VS752K4DT8}"
SIGN_IDENTITY="${IOS_CODE_SIGN_IDENTITY:-Apple Distribution}"

# xcodebuild recebe build settings como VAR=valor antes do alvo (build|archive).
SIGNING_ARGS=(
  "DEVELOPMENT_TEAM=${TEAM_ID}"
  CODE_SIGN_STYLE=Manual
  "CODE_SIGN_IDENTITY=${SIGN_IDENTITY}"
  "PROVISIONING_PROFILE_SPECIFIER=${IOS_PROVISIONING_PROFILE_UUID}"
)

echo "Assinatura CI: team=${TEAM_ID} identity=${SIGN_IDENTITY} profile=${IOS_PROVISIONING_PROFILE_UUID}"

case "$ACTION" in
  build)
    xcodebuild \
      -workspace LikeMe.xcworkspace \
      -scheme LikeMe \
      -configuration Production \
      -destination 'generic/platform=iOS' \
      -sdk iphoneos \
      -allowProvisioningUpdates \
      "${SIGNING_ARGS[@]}" \
      build
    ;;
  archive)
    xcodebuild \
      -workspace LikeMe.xcworkspace \
      -scheme LikeMe \
      -configuration Production \
      -destination 'generic/platform=iOS' \
      -archivePath "$PWD/build/LikeMe.xcarchive" \
      -allowProvisioningUpdates \
      "${SIGNING_ARGS[@]}" \
      archive
    ;;
  *)
    echo "::error::Ação inválida: ${ACTION} (use build ou archive)" >&2
    exit 1
    ;;
esac
