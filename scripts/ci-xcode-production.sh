#!/usr/bin/env bash
# Build / archive / export Production no CI (sem conta Apple no Xcode).
# Preferência: assinatura automática + API Key ASC (-allowProvisioningUpdates).
# Alternativa: perfil App Store manual via IOS_PROVISIONING_PROFILE_UUID.
set -euo pipefail

ACTION="${1:?Uso: ci-xcode-production.sh build|archive|export}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/ios"

TEAM_ID="${IOS_DEVELOPMENT_TEAM:-VS752K4DT8}"
ALLOW=( -allowProvisioningUpdates )

XCODE_AUTH=()
if [[ -n "${ASC_API_KEY_PATH:-}" && -f "${ASC_API_KEY_PATH}" ]]; then
  XCODE_AUTH=(
    -authenticationKeyPath "$ASC_API_KEY_PATH"
    -authenticationKeyID "${ASC_API_KEY_ID:-6QJ886URZD}"
    -authenticationKeyIssuerID "${ASC_API_ISSUER_ID:-f4a624c3-e2af-4ad0-a365-f60b90c2dc9d}"
  )
fi

SIGNING_ARGS=()
if [[ -n "${IOS_PROVISIONING_PROFILE_UUID:-}" ]]; then
  SIGNING_ARGS=(
    "DEVELOPMENT_TEAM=${TEAM_ID}"
    CODE_SIGN_STYLE=Manual
    "CODE_SIGN_IDENTITY=${IOS_CODE_SIGN_IDENTITY:-Apple Distribution}"
    "PROVISIONING_PROFILE_SPECIFIER=${IOS_PROVISIONING_PROFILE_UUID}"
  )
  echo "Assinatura CI: manual (profile ${IOS_PROVISIONING_PROFILE_UUID})"
elif [[ ${#XCODE_AUTH[@]} -gt 0 ]]; then
  SIGNING_ARGS=(
    "DEVELOPMENT_TEAM=${TEAM_ID}"
    CODE_SIGN_STYLE=Automatic
  )
  echo "Assinatura CI: Automatic + App Store Connect API Key"
else
  echo "::error::Configure ASC_API_KEY_P8 no GitHub, ou IOS_PROVISIONING_PROFILE_BASE64 com perfil App Store Distribution (sem ProvisionedDevices)." >&2
  exit 1
fi

case "$ACTION" in
  build)
    xcodebuild \
      -workspace LikeMe.xcworkspace \
      -scheme LikeMe \
      -configuration Production \
      -destination 'generic/platform=iOS' \
      -sdk iphoneos \
      "${ALLOW[@]}" \
      "${XCODE_AUTH[@]}" \
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
      "${ALLOW[@]}" \
      "${XCODE_AUTH[@]}" \
      "${SIGNING_ARGS[@]}" \
      archive
    ;;
  export)
    xcodebuild \
      -exportArchive \
      -archivePath "$PWD/build/LikeMe.xcarchive" \
      -exportPath "$PWD/build/export" \
      -exportOptionsPlist "$PWD/ExportOptions-AppStore.plist" \
      "${ALLOW[@]}" \
      "${XCODE_AUTH[@]}"
    ;;
  *)
    echo "::error::Ação inválida: ${ACTION} (use build, archive ou export)" >&2
    exit 1
    ;;
esac
