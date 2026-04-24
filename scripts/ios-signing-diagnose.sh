#!/usr/bin/env bash
set -euo pipefail

decode_profile_plist() {
  local mp="$1"
  local decoded
  decoded="$(mktemp -t prov_diag.XXXXXX.plist)"
  if ! security cms -D -i "$mp" >"$decoded" 2>/dev/null; then
    rm -f "$decoded"
    return 1
  fi
  echo "$decoded"
}

print_profile_fields() {
  local decoded="$1"
  local label="$2"
  echo "$label"
  /usr/libexec/PlistBuddy -c 'Print :Name' "$decoded" 2>/dev/null | sed 's/^/  Name: /' || true
  /usr/libexec/PlistBuddy -c 'Print :UUID' "$decoded" 2>/dev/null | sed 's/^/  UUID: /' || true
  /usr/libexec/PlistBuddy -c 'Print :TeamIdentifier:0' "$decoded" 2>/dev/null | sed 's/^/  TeamIdentifier: /' || true
  /usr/libexec/PlistBuddy -c 'Print :Entitlements:application-identifier' "$decoded" 2>/dev/null | sed 's/^/  application-identifier: /' || true
  rm -f "$decoded"
}

echo "=== Utilizador e HOME ==="
echo "USER=$(whoami)"
echo "HOME=$HOME"
echo

echo "=== Xcode ==="
if command -v xcodebuild >/dev/null 2>&1; then
  xcodebuild -version 2>&1 || true
else
  echo "(xcodebuild não encontrado no PATH)"
fi
echo

echo "=== Pasta de perfis (Provisioning Profiles) ==="
PP="$HOME/Library/MobileDevice/Provisioning Profiles"
echo "Caminho: $PP"
if [[ -d "$PP" ]]; then
  count=0
  while IFS= read -r -d '' f; do
    count=$((count + 1))
    echo "---"
    echo "Ficheiro: $f"
    decoded="$(decode_profile_plist "$f" || true)"
    if [[ -n "${decoded:-}" ]]; then
      print_profile_fields "$decoded" ""
    else
      echo "  (não foi possível decodificar)"
    fi
  done < <(find "$PP" -maxdepth 1 -name '*.mobileprovision' -print0 2>/dev/null)
  if [[ "$count" -eq 0 ]]; then
    echo "(nenhum .mobileprovision nesta pasta)"
  fi
  echo "Total listados: $count"
else
  echo "(pasta não existe)"
fi
echo

echo "=== Certificados de assinatura (codesigning) ==="
security find-identity -v -p codesigning 2>/dev/null | grep -Ei 'Distribution|Developer' | head -25 || echo "(nenhum ou security falhou)"
echo

echo "=== Ficheiro em Downloads (se existir) ==="
MP="${IOS_ADHOC_PROVISIONING_FILE:-$HOME/Downloads/Devices_Ad_Hoc_for_Dev.mobileprovision}"
if [[ -f "$MP" ]]; then
  echo "Encontrado: $MP"
  decoded="$(decode_profile_plist "$MP" || true)"
  if [[ -n "${decoded:-}" ]]; then
    print_profile_fields "$decoded" ""
  fi
else
  echo "Não encontrado: $MP"
  echo "Define IOS_ADHOC_PROVISIONING_FILE=/caminho/para/perfil.mobileprovision e volta a correr: npm run ios:signing:diagnose"
fi
