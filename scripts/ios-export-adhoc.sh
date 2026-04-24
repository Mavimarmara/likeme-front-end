#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
IOS_DIR="$ROOT/ios"
ARCHIVE_PATH="${IOS_ARCHIVE_PATH:-$IOS_DIR/build/LikeMe.xcarchive}"
EXPORT_DIR="${IOS_ADHOC_EXPORT_DIR:-$IOS_DIR/build/export-adhoc}"
BASE_PLIST="$IOS_DIR/ExportOptions-AdHoc.plist"
BUNDLE_ID="${IOS_BUNDLE_ID:-app.likeme.com}"

if [[ ! -d "$ARCHIVE_PATH" ]]; then
  echo "Erro: archive não encontrado: $ARCHIVE_PATH" >&2
  echo "Gere antes com: npm run ios:xcode:archive:production" >&2
  exit 1
fi

if [[ ! -f "$BASE_PLIST" ]]; then
  echo "Erro: $BASE_PLIST não encontrado." >&2
  exit 1
fi

install_mobileprovision_file() {
  local mp="$1"
  local decoded
  decoded="$(mktemp -t prov_decode.XXXXXX.plist)"
  if ! security cms -D -i "$mp" >"$decoded" 2>/dev/null; then
    echo "Erro: não foi possível ler o .mobileprovision (ficheiro inválido?): $mp" >&2
    rm -f "$decoded"
    return 1
  fi
  local uuid
  uuid="$(/usr/libexec/PlistBuddy -c 'Print :UUID' "$decoded" 2>/dev/null || true)"
  rm -f "$decoded"
  if [[ -z "$uuid" ]]; then
    echo "Erro: UUID não encontrado no perfil: $mp" >&2
    return 1
  fi
  local dest_dir="${HOME}/Library/MobileDevice/Provisioning Profiles"
  mkdir -p "$dest_dir"
  cp "$mp" "${dest_dir}/${uuid}.mobileprovision"
  echo "Perfil copiado para: ${dest_dir}/${uuid}.mobileprovision" >&2
  echo "UUID do perfil (se precisares de signing manual no plist): $uuid" >&2
}

if [[ -z "${IOS_ADHOC_PROVISIONING_FILE:-}" ]]; then
  default_mp="${HOME}/Downloads/Devices_Ad_Hoc_for_Dev.mobileprovision"
  if [[ -f "$default_mp" ]]; then
    IOS_ADHOC_PROVISIONING_FILE="$default_mp"
  fi
fi

if [[ -n "${IOS_ADHOC_PROVISIONING_FILE:-}" ]]; then
  if [[ -f "$IOS_ADHOC_PROVISIONING_FILE" ]]; then
    install_mobileprovision_file "$IOS_ADHOC_PROVISIONING_FILE"
  else
    echo "Aviso: IOS_ADHOC_PROVISIONING_FILE inexistente: $IOS_ADHOC_PROVISIONING_FILE" >&2
  fi
fi

EXPORT_PLIST="$BASE_PLIST"
WORK_DIR=""

cleanup() {
  if [[ -n "$WORK_DIR" && -d "$WORK_DIR" ]]; then
    rm -rf "$WORK_DIR"
  fi
}
trap cleanup EXIT

if [[ -n "${IOS_ADHOC_PROVISIONING_PROFILE:-}" && "${IOS_ADHOC_EXPORT_SIGNING:-manual}" != "automatic" ]]; then
  echo "Export com signing manual (perfil no portal tem de incluir o mesmo certificado Apple Distribution que o Keychain deste Mac)." >&2
  WORK_DIR="$(mktemp -d)"
  EXPORT_PLIST="$WORK_DIR/ExportOptions.plist"
  python3 - "$BASE_PLIST" "$EXPORT_PLIST" "$BUNDLE_ID" "$IOS_ADHOC_PROVISIONING_PROFILE" <<'PY'
import plistlib
import sys

base_path, out_path, bundle_id, profile_name = sys.argv[1:5]
with open(base_path, "rb") as handle:
    data = plistlib.load(handle)
data["signingStyle"] = "manual"
data["provisioningProfiles"] = {bundle_id: profile_name}
with open(out_path, "wb") as handle:
    plistlib.dump(data, handle)
PY
fi

mkdir -p "$EXPORT_DIR"
cd "$IOS_DIR"

if [[ "${IOS_ADHOC_EXPORT_SIGNING:-manual}" == "automatic" ]]; then
  echo "Assinatura automática: confirma Xcode → Settings → Accounts → equipa VS752K4DT8 → Download Manual Profiles; a conta tem de ter acesso à app app.likeme.com." >&2
fi

xcodebuild -exportArchive \
  -allowProvisioningUpdates \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_DIR" \
  -exportOptionsPlist "$EXPORT_PLIST"
