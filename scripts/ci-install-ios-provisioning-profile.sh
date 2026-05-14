#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${IOS_PROVISIONING_PROFILE_BASE64:-}" ]]; then
  echo "::error::Defina o secret IOS_PROVISIONING_PROFILE_BASE64 no GitHub (env IOS_PROVISIONING_PROFILE_BASE64 no step)." >&2
  exit 1
fi

tmp_profile="$(mktemp)"
tmp_plist="$(mktemp)"
cleanup() {
  rm -f "$tmp_profile" "$tmp_plist"
}
trap cleanup EXIT

printf '%s' "$IOS_PROVISIONING_PROFILE_BASE64" | base64 -d >"$tmp_profile"

if ! security cms -D -i "$tmp_profile" >"$tmp_plist" 2>/dev/null; then
  echo "::error::O conteúdo decodificado não é um .mobileprovision válido (security cms falhou)." >&2
  exit 1
fi

uuid="$(/usr/libexec/PlistBuddy -c 'Print UUID' "$tmp_plist")"
if [[ -z "$uuid" || "$uuid" == "" ]]; then
  echo "::error::Não foi possível ler UUID do perfil." >&2
  exit 1
fi

dest_dir="${HOME}/Library/MobileDevice/Provisioning Profiles"
mkdir -p "$dest_dir"
cp "$tmp_profile" "${dest_dir}/${uuid}.mobileprovision"
echo "Provisioning profile instalado: UUID=${uuid}"
