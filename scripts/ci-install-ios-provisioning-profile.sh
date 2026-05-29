#!/usr/bin/env bash
# Opcional: instala .mobileprovision só se for App Store Distribution (sem lista de devices).
set -euo pipefail

if [[ -z "${IOS_PROVISIONING_PROFILE_BASE64:-}" ]]; then
  echo "IOS_PROVISIONING_PROFILE_BASE64 vazio — CI usará assinatura automática (ASC API Key)."
  exit 0
fi

tmp_profile="$(mktemp)"
tmp_plist="$(mktemp)"
cleanup() {
  rm -f "$tmp_profile" "$tmp_plist"
}
trap cleanup EXIT

printf '%s' "$IOS_PROVISIONING_PROFILE_BASE64" | base64 -d >"$tmp_profile"

if ! security cms -D -i "$tmp_profile" >"$tmp_plist" 2>/dev/null; then
  echo "::warning::Conteúdo de IOS_PROVISIONING_PROFILE_BASE64 inválido; ignorando perfil manual." >&2
  exit 0
fi

uuid="$(/usr/libexec/PlistBuddy -c 'Print UUID' "$tmp_plist")"
profile_name="$(/usr/libexec/PlistBuddy -c 'Print Name' "$tmp_plist" 2>/dev/null || true)"
app_identifier="$(/usr/libexec/PlistBuddy -c 'Print Entitlements:application-identifier' "$tmp_plist" 2>/dev/null || true)"

if [[ -z "$app_identifier" || "$app_identifier" != *"app.likeme.com" ]]; then
  echo "::warning::Perfil ignorado (não é app.likeme.com: ${app_identifier:-vazio})." >&2
  exit 0
fi

if /usr/libexec/PlistBuddy -c 'Print ProvisionedDevices' "$tmp_plist" >/dev/null 2>&1; then
  echo "::warning::Perfil é Development/Ad Hoc (ProvisionedDevices). CI usará ASC API Key em vez deste secret." >&2
  echo "Para assinatura manual no CI, baixe um perfil App Store em developer.apple.com → Profiles → App Store." >&2
  exit 0
fi

dest_dir="${HOME}/Library/MobileDevice/Provisioning Profiles"
mkdir -p "$dest_dir"
cp "$tmp_profile" "${dest_dir}/${uuid}.mobileprovision"
echo "Provisioning profile App Store instalado: UUID=${uuid} name=${profile_name:-?}"

if [[ -n "${GITHUB_ENV:-}" ]]; then
  {
    echo "IOS_PROVISIONING_PROFILE_UUID=${uuid}"
    echo "IOS_PROVISIONING_PROFILE_NAME=${profile_name}"
  } >>"$GITHUB_ENV"
fi
