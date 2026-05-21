#!/usr/bin/env bash
# Gera ExportOptions-AppStore.plist com o nome do perfil instalado no CI (manual export).
set -euo pipefail

: "${IOS_PROVISIONING_PROFILE_NAME:?Defina IOS_PROVISIONING_PROFILE_NAME}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${ROOT}/ios/ExportOptions-AppStore.plist"
TEAM_ID="${IOS_DEVELOPMENT_TEAM:-VS752K4DT8}"

/usr/libexec/PlistBuddy -c 'Clear dict' "$OUT" 2>/dev/null || true

cat >"$OUT" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>method</key>
	<string>app-store</string>
	<key>teamID</key>
	<string>${TEAM_ID}</string>
	<key>signingStyle</key>
	<string>manual</string>
	<key>uploadSymbols</key>
	<true/>
	<key>provisioningProfiles</key>
	<dict>
		<key>app.likeme.com</key>
		<string>${IOS_PROVISIONING_PROFILE_NAME}</string>
	</dict>
</dict>
</plist>
EOF

echo "ExportOptions-AppStore.plist atualizado (manual, profile=${IOS_PROVISIONING_PROFILE_NAME})"
