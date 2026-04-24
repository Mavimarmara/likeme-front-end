#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
IOS_DIR="${FRONTEND_ROOT}/ios"
WORKSPACE="${IOS_DIR}/LikeMe.xcworkspace"
SCHEME="${IOS_SCHEME:-LikeMe}"
CONFIG="${IOS_CONFIGURATION:-Release}"
EXPORT_PLIST="${EXPORT_OPTIONS_PLIST:-$IOS_DIR/ExportOptions-AppStore.plist}"
BUILD_ROOT="${IOS_BUILD_ROOT:-$IOS_DIR/build}"
ARCHIVE_PATH="${IOS_ARCHIVE_PATH:-$BUILD_ROOT/LikeMe.xcarchive}"
EXPORT_DIR="${IOS_EXPORT_DIR:-$BUILD_ROOT/export}"

usage() {
  echo "Uso: a partir da raiz do likeme-front-end (ou via npm run ios:archive:export)."
  echo ""
  echo "Variáveis opcionais:"
  echo "  IOS_CONFIGURATION   Debug | Release | Production (default: Release)"
  echo "  IOS_SCHEME          default: LikeMe"
  echo "  EXPORT_OPTIONS_PLIST caminho para ExportOptions.plist"
  echo "  IOS_BUILD_ROOT       pasta base para archive + export (default: ios/build)"
  echo "  IOS_ARCHIVE_PATH     .xcarchive completo (default: \$IOS_BUILD_ROOT/LikeMe.xcarchive)"
  echo "  IOS_EXPORT_DIR       pasta do IPA exportado (default: \$IOS_BUILD_ROOT/export)"
  echo "  SKIP_BUILD=1         não roda xcodebuild build antes do archive"
  echo "  SKIP_ARCHIVE=1       só exporta (archive já existe em IOS_ARCHIVE_PATH)"
  echo "  SKIP_EXPORT=1        só gera o .xcarchive (não exporta IPA)"
  echo ""
  echo "Submit para a App Store: use Xcode Organizer, Transporter, ou npm run submit:ios (EAS)."
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ ! -d "$IOS_DIR" ]] || [[ ! -f "$WORKSPACE/contents.xcworkspacedata" ]]; then
  echo "Erro: pasta ios/ ou LikeMe.xcworkspace não encontrada em $IOS_DIR" >&2
  exit 1
fi

if [[ ! -f "$EXPORT_PLIST" ]]; then
  echo "Erro: ExportOptions.plist não encontrado: $EXPORT_PLIST" >&2
  exit 1
fi

mkdir -p "$BUILD_ROOT"

if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  echo "==> xcodebuild build device (scheme=$SCHEME configuration=$CONFIG)"
  xcodebuild \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIG" \
    -destination 'generic/platform=iOS' \
    -sdk iphoneos \
    build
else
  echo "==> SKIP_BUILD=1 — pulando build"
fi

if [[ "${SKIP_ARCHIVE:-0}" != "1" ]]; then
  echo "==> xcodebuild archive (scheme=$SCHEME configuration=$CONFIG)"
  xcodebuild \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIG" \
    -destination 'generic/platform=iOS' \
    -archivePath "$ARCHIVE_PATH" \
    archive
else
  echo "==> SKIP_ARCHIVE=1 — usando archive existente: $ARCHIVE_PATH"
  if [[ ! -d "$ARCHIVE_PATH" ]]; then
    echo "Erro: archive não encontrado." >&2
    exit 1
  fi
fi

if [[ "${SKIP_EXPORT:-0}" == "1" ]]; then
  echo "==> SKIP_EXPORT=1 — archive em: $ARCHIVE_PATH"
  exit 0
fi

rm -rf "$EXPORT_DIR"
mkdir -p "$EXPORT_DIR"

echo "==> xcodebuild -exportArchive → $EXPORT_DIR"
xcodebuild \
  -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_DIR" \
  -exportOptionsPlist "$EXPORT_PLIST"

echo ""
echo "Pronto. IPA em: $EXPORT_DIR"
echo "Submit: npm run submit:ios (EAS) ou envie o .ipa pelo Transporter / Xcode Organizer."
