#!/usr/bin/env bash
# Build / archive / export Production no CI (sem conta Apple no Xcode).
# 1) Automatic + ASC API Key (Distribution — não cria cert Development).
# 2) Fallback manual só se P12 e perfil App Store batem (ci-ios-manual-signing-viable.sh).
set -euo pipefail

ACTION="${1:?Uso: ci-xcode-production.sh build|archive|export}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/ios"

TEAM_ID="${IOS_DEVELOPMENT_TEAM:-VS752K4DT8}"
DIST_IDENTITY="${IOS_CODE_SIGN_IDENTITY:-Apple Distribution}"

XCODE_AUTH=()
if [[ -n "${ASC_API_KEY_PATH:-}" && -f "${ASC_API_KEY_PATH}" ]]; then
  XCODE_AUTH=(
    -authenticationKeyPath "$ASC_API_KEY_PATH"
    -authenticationKeyID "${ASC_API_KEY_ID:-74BTTLL273}"
    -authenticationKeyIssuerID "${ASC_API_ISSUER_ID:-f4a624c3-e2af-4ad0-a365-f60b90c2dc9d}"
  )
fi

HAS_ASC=false
[[ ${#XCODE_AUTH[@]} -gt 0 ]] && HAS_ASC=true

USE_MANUAL_SIGNING=false
SIGNING_ARGS=()
XCODE_PROVISIONING=()

apply_automatic_signing() {
  USE_MANUAL_SIGNING=false
  SIGNING_ARGS=(
    "DEVELOPMENT_TEAM=${TEAM_ID}"
    CODE_SIGN_STYLE=Automatic
    "CODE_SIGN_IDENTITY=${DIST_IDENTITY}"
    "CODE_SIGN_IDENTITY[sdk=iphoneos*]=${DIST_IDENTITY}"
  )
  XCODE_PROVISIONING=( -allowProvisioningUpdates )
  echo "Assinatura CI: Automatic + ASC (${DIST_IDENTITY})"
}

apply_manual_signing() {
  USE_MANUAL_SIGNING=true
  SIGNING_ARGS=(
    "DEVELOPMENT_TEAM=${TEAM_ID}"
    CODE_SIGN_STYLE=Manual
    "CODE_SIGN_IDENTITY=${DIST_IDENTITY}"
    "CODE_SIGN_IDENTITY[sdk=iphoneos*]=${DIST_IDENTITY}"
    "PROVISIONING_PROFILE_SPECIFIER=${IOS_PROVISIONING_PROFILE_UUID}"
  )
  XCODE_PROVISIONING=()
  echo "Assinatura CI: manual (P12 + perfil ${IOS_PROVISIONING_PROFILE_NAME:-${IOS_PROVISIONING_PROFILE_UUID}})"
}

manual_signing_viable() {
  bash "$ROOT/scripts/ci-ios-manual-signing-viable.sh"
}

if [[ "$HAS_ASC" == true ]]; then
  apply_automatic_signing
elif [[ -n "${IOS_PROVISIONING_PROFILE_UUID:-}" ]] && manual_signing_viable; then
  apply_manual_signing
elif [[ -n "${IOS_PROVISIONING_PROFILE_UUID:-}" ]]; then
  echo "::error::Perfil App Store instalado mas P12 não corresponde ao perfil. Alinhe IOS_CERTIFICATE_P12_BASE64 e IOS_PROVISIONING_PROFILE_BASE64, ou configure ASC_API_KEY_P8." >&2
  exit 1
else
  echo "::error::Configure ASC_API_KEY_P8 ou IOS_PROVISIONING_PROFILE_BASE64 + IOS_CERTIFICATE_P12_BASE64 alinhados." >&2
  exit 1
fi

write_manual_export_plist() {
  local profile_ref="${IOS_PROVISIONING_PROFILE_NAME:-${IOS_PROVISIONING_PROFILE_UUID:-}}"
  if [[ -z "$profile_ref" ]]; then
    echo "::error::Perfil manual necessário mas IOS_PROVISIONING_PROFILE_UUID/NAME ausente." >&2
    return 1
  fi
  mkdir -p "$PWD/build"
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
		<string>${profile_ref}</string>
	</dict>
	<key>uploadSymbols</key>
	<true/>
</dict>
</plist>
EPLIST
  echo "ExportOptions: manual (perfil ${profile_ref})"
}

xcode_optional_args() {
  XCODE_OPTIONAL_ARGS=()
  if ((${#XCODE_PROVISIONING[@]} > 0)); then
    XCODE_OPTIONAL_ARGS+=("${XCODE_PROVISIONING[@]}")
  fi
  if ((${#XCODE_AUTH[@]} > 0)); then
    XCODE_OPTIONAL_ARGS+=("${XCODE_AUTH[@]}")
  fi
}

xcode_build_args() {
  xcode_optional_args
  XCODE_BUILD_ARGS=("${XCODE_OPTIONAL_ARGS[@]}" "${SIGNING_ARGS[@]}")
}

run_export_archive() {
  local export_plist="$1"
  local export_log
  export_log="$(mktemp)"
  xcode_optional_args
  set +e
  xcodebuild \
    -exportArchive \
    -archivePath "$PWD/build/LikeMe.xcarchive" \
    -exportPath "$PWD/build/export" \
    -exportOptionsPlist "$export_plist" \
    "${XCODE_OPTIONAL_ARGS[@]}" \
    2>&1 | tee "$export_log"
  local status="${PIPESTATUS[0]}"
  set -e

  if [[ "$status" -ne 0 ]]; then
    if grep -q "Cloud signing permission error" "$export_log" 2>/dev/null; then
      echo "::warning::ASC API Key sem permissão de assinatura na nuvem (Certificates/Profiles no App Store Connect)." >&2
    fi
    if grep -q "No profiles for" "$export_log" 2>/dev/null; then
      echo "::warning::Nenhum perfil App Store automático para app.likeme.com." >&2
    fi
  fi
  rm -f "$export_log"
  return "$status"
}

run_xcodebuild_production() {
  local xcode_action="$1"
  shift
  local build_log
  build_log="$(mktemp)"
  set +e
  xcodebuild \
    -workspace LikeMe.xcworkspace \
    -scheme LikeMe \
    -configuration Production \
    "$@" \
    "${XCODE_BUILD_ARGS[@]}" \
    "$xcode_action" \
    2>&1 | tee "$build_log"
  local status="${PIPESTATUS[0]}"
  set -e

  if [[ "$status" -ne 0 && "$USE_MANUAL_SIGNING" == false && "$HAS_ASC" == true ]]; then
    if manual_signing_viable; then
      echo "Automatic falhou — tentando assinatura manual (P12 + perfil alinhados)..."
      apply_manual_signing
      xcode_build_args
      set +e
      xcodebuild \
        -workspace LikeMe.xcworkspace \
        -scheme LikeMe \
        -configuration Production \
        "$@" \
        "${XCODE_BUILD_ARGS[@]}" \
        "$xcode_action" \
        2>&1 | tee "$build_log"
      status="${PIPESTATUS[0]}"
      set -e
    else
      echo "::warning::Fallback manual indisponível: P12 e perfil App Store não correspondem." >&2
      echo "Revogue certificados Development expirados em developer.apple.com ou regenere perfil + P12 do mesmo certificado Distribution." >&2
    fi
  fi

  if [[ "$status" -ne 0 ]]; then
    echo "===== Últimas 40 linhas do xcodebuild ====="
    tail -n 40 "$build_log" || true
  fi
  rm -f "$build_log"
  return "$status"
}

case "$ACTION" in
  build)
    xcode_build_args
    run_xcodebuild_production build \
      -destination 'generic/platform=iOS' \
      -sdk iphoneos
    ;;
  archive)
    xcode_build_args
    run_xcodebuild_production archive \
      -destination 'generic/platform=iOS' \
      -archivePath "$PWD/build/LikeMe.xcarchive"
    ;;
  export)
    mkdir -p "$PWD/build/export"
    export_status=0

    if [[ "$USE_MANUAL_SIGNING" == true ]]; then
      write_manual_export_plist
      run_export_archive "$EXPORT_PLIST" && export_status=0 || export_status=$?
    else
      echo "ExportOptions: $PWD/ExportOptions-AppStore.plist (signingStyle automatic)"
      if run_export_archive "$PWD/ExportOptions-AppStore.plist"; then
        export_status=0
      elif manual_signing_viable; then
        echo "Export automático falhou — tentando export manual..."
        apply_manual_signing
        write_manual_export_plist
        run_export_archive "$EXPORT_PLIST" && export_status=0 || export_status=$?
      else
        export_status=1
      fi
    fi

    if [[ "$export_status" -ne 0 ]]; then
      echo "::error::Export falhou. Verifique permissões ASC (Admin + Certificates/Profiles) ou alinhe P12 e perfil App Store." >&2
      exit "$export_status"
    fi

    if [[ ! -f "$PWD/build/export/LikeMe.ipa" ]]; then
      echo "::error::Export concluiu sem gerar ios/build/export/LikeMe.ipa" >&2
      exit 1
    fi
    echo "IPA gerado: ios/build/export/LikeMe.ipa"
    ;;
  *)
    echo "::error::Ação inválida: ${ACTION} (use build, archive ou export)" >&2
    exit 1
    ;;
esac
