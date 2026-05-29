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

USE_MANUAL_SIGNING=false
SIGNING_ARGS=()
if [[ ${#XCODE_AUTH[@]} -gt 0 ]]; then
  SIGNING_ARGS=(
    "DEVELOPMENT_TEAM=${TEAM_ID}"
    CODE_SIGN_STYLE=Automatic
  )
  echo "Assinatura CI: Automatic + App Store Connect API Key"
  if [[ -n "${IOS_PROVISIONING_PROFILE_UUID:-}" ]]; then
    echo "Perfil manual (${IOS_PROVISIONING_PROFILE_UUID}) ignorado — ASC API Key gerencia certificado e provisioning."
  fi
elif [[ -n "${IOS_PROVISIONING_PROFILE_UUID:-}" ]]; then
  USE_MANUAL_SIGNING=true
  SIGNING_ARGS=(
    "DEVELOPMENT_TEAM=${TEAM_ID}"
    CODE_SIGN_STYLE=Manual
    "CODE_SIGN_IDENTITY=${IOS_CODE_SIGN_IDENTITY:-Apple Distribution}"
    "PROVISIONING_PROFILE_SPECIFIER=${IOS_PROVISIONING_PROFILE_UUID}"
  )
  echo "Assinatura CI: manual (profile ${IOS_PROVISIONING_PROFILE_UUID})"
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
    EXPORT_PLIST="$PWD/ExportOptions-AppStore.plist"
    if [[ "$USE_MANUAL_SIGNING" == true ]]; then
      EXPORT_PLIST="$PWD/build/ExportOptions-CI.plist"
      cat > "$EXPORT_PLIST" <<EPLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>method</key>
	<string>app-store-connect</string>
	<key>teamID</key>
	<string>${TEAM_ID}</string>
	<key>signingStyle</key>
	<string>manual</string>
	<key>signingCertificate</key>
	<string>Apple Distribution</string>
	<key>provisioningProfiles</key>
	<dict>
		<key>app.likeme.com</key>
		<string>${IOS_PROVISIONING_PROFILE_UUID}</string>
	</dict>
	<key>uploadSymbols</key>
	<true/>
</dict>
</plist>
EPLIST
      echo "ExportOptions: manual signing (profile ${IOS_PROVISIONING_PROFILE_UUID})"
    fi
    xcodebuild \
      -exportArchive \
      -archivePath "$PWD/build/LikeMe.xcarchive" \
      -exportPath "$PWD/build/export" \
      -exportOptionsPlist "$EXPORT_PLIST" \
      "${ALLOW[@]}" \
      "${XCODE_AUTH[@]}"
    ;;
  *)
    echo "::error::Ação inválida: ${ACTION} (use build, archive ou export)" >&2
    exit 1
    ;;
esac
