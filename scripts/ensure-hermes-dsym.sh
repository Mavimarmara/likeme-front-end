#!/usr/bin/env bash
set -euo pipefail

if [[ "${PLATFORM_NAME:-}" != "iphoneos" ]]; then
  exit 0
fi

if [[ "${CONFIGURATION:-}" == *Debug* ]]; then
  exit 0
fi

embedded="${TARGET_BUILD_DIR}/${FRAMEWORKS_FOLDER_PATH}/hermes.framework/hermes"
fallback="${PODS_ROOT}/hermes-engine/destroot/Library/Frameworks/universal/hermes.xcframework/ios-arm64/hermes.framework/hermes"

hermes_bin=""
if [[ -f "${embedded}" ]]; then
  hermes_bin="${embedded}"
elif [[ -f "${fallback}" ]]; then
  hermes_bin="${fallback}"
else
  echo "warning: Hermes binary not found at embedded or Pods path; skipping Hermes dSYM"
  exit 0
fi

dest_dir="${DWARF_DSYM_FOLDER_PATH:?}"
out_dsym="${dest_dir}/hermes.framework.dSYM"

rm -rf "${out_dsym}"
echo "note: Generating Hermes dSYM (${out_dsym}) from ${hermes_bin}"
dsymutil "${hermes_bin}" -o "${out_dsym}"
