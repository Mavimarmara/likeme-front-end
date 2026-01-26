#!/bin/bash

set -e

echo "🚀 Iniciando build de APK para Android (sem EAS)..."

# Carregar variáveis de ambiente
if [ -f .env ]; then
	echo "📋 Carregando variáveis de ambiente do .env..."
	set -a
	source .env
	set +a
	echo "✓ Variáveis de ambiente carregadas"
else
	echo "⚠️  Arquivo .env não encontrado."
fi

# Configurar JAVA_HOME
export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home -v 21 2>/dev/null || /usr/libexec/java_home -v 11 2>/dev/null)

if [ -z "$JAVA_HOME" ]; then
	echo "❌ Java não encontrado. Por favor, instale Java 17, 21 ou 11."
	exit 1
fi

echo "✓ Usando Java: $JAVA_HOME"

# Prebuild
echo ""
echo "📦 Executando prebuild..."
npx expo prebuild --platform android --clean

# Desabilitar postinstall do iOS
export SKIP_IOS_POD_INSTALL=true

# Build APK
echo ""
echo "🔨 Gerando APK..."
cd android
./gradlew assembleRelease

echo ""
echo "✅ Build concluído com sucesso!"
echo ""
echo "📦 APK gerado em:"
echo "   android/app/build/outputs/apk/release/app-release.apk"
echo ""

