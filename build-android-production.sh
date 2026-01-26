#!/bin/bash

set -e

echo "🚀 Iniciando build de produção para Android (sem EAS)..."

# Carregar variáveis de ambiente
if [ -f .env ]; then
	echo "📋 Carregando variáveis de ambiente do .env..."
	set -a
	source .env
	set +a
	echo "✓ Variáveis de ambiente carregadas"
	
	if [ -z "$EXPO_PUBLIC_AUTH0_DOMAIN" ]; then
		echo "⚠️  Aviso: EXPO_PUBLIC_AUTH0_DOMAIN não encontrado no .env"
	fi
else
	echo "⚠️  Arquivo .env não encontrado. As variáveis de ambiente podem não estar disponíveis."
fi

# Configurar JAVA_HOME para Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home -v 21 2>/dev/null || /usr/libexec/java_home -v 11 2>/dev/null)

if [ -z "$JAVA_HOME" ]; then
	echo "❌ Java não encontrado. Por favor, instale Java 17, 21 ou 11."
	exit 1
fi

echo ""
echo "✓ Usando Java: $JAVA_HOME"
java -version

# Verificar se keystore.properties existe
if [ ! -f "android/keystore.properties" ]; then
	echo ""
	echo "⚠️  ATENÇÃO: arquivo android/keystore.properties não encontrado!"
	echo "📝 O build usará o keystore de debug (NÃO adequado para produção)"
	echo ""
	echo "Para criar keystore de produção:"
	echo "  1. cd android/app"
	echo "  2. keytool -genkeypair -v -storetype PKCS12 -keystore likeme-release.keystore \\"
	echo "     -alias likeme-key-alias -keyalg RSA -keysize 2048 -validity 10000"
	echo "  3. Crie android/keystore.properties com as credenciais"
	echo ""
	read -p "Continuar mesmo assim? (s/N) " -n 1 -r
	echo
	if [[ ! $REPLY =~ ^[Ss]$ ]]; then
		exit 1
	fi
fi

# Prebuild
echo ""
echo "📦 Executando prebuild..."
npx expo prebuild --platform android --clean

# Aplicar patch do build.gradle se necessário
if [ -f "scripts/apply-android-keystore-patch.sh" ]; then
	echo ""
	echo "📝 Aplicando configuração de keystore de produção..."
	./scripts/apply-android-keystore-patch.sh
fi

# Desabilitar postinstall do iOS durante o build Android
export SKIP_IOS_POD_INSTALL=true

# Build AAB (formato necessário para Google Play)
echo ""
echo "🔨 Gerando AAB (Android App Bundle)..."
cd android

# Limpar build anterior para forçar recompilação
echo "🧹 Limpando build anterior..."
./gradlew clean

# Gerar AAB
./gradlew bundleRelease

echo ""
echo "✅ Build concluído com sucesso!"
echo ""
echo "📦 AAB gerado em:"
echo "   android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "📤 Para enviar para Google Play:"
echo "   1. Acesse: https://play.google.com/console"
echo "   2. Vá em: Production → Releases → Create new release"
echo "   3. Faça upload do arquivo .aab acima"
echo ""

