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

# Exportar variáveis de keystore para o Gradle (se estiverem no .env)
# O Gradle pode ler essas variáveis via System.getenv()
if [ -n "$ANDROID_KEYSTORE_STORE_PASSWORD" ]; then
	export ANDROID_KEYSTORE_STORE_PASSWORD
	export ANDROID_KEYSTORE_KEY_PASSWORD="${ANDROID_KEYSTORE_KEY_PASSWORD:-$ANDROID_KEYSTORE_STORE_PASSWORD}"
	export ANDROID_KEYSTORE_KEY_ALIAS="${ANDROID_KEYSTORE_KEY_ALIAS:-likeme-key-alias}"
	export ANDROID_KEYSTORE_STORE_FILE="${ANDROID_KEYSTORE_STORE_FILE:-likeme-release.keystore}"
	echo "✓ Variáveis de keystore carregadas do .env"
fi

# Configurar JAVA_HOME para Java 17 (forçar versão específica)
export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)

if [ -z "$JAVA_HOME" ]; then
	echo "❌ Java 17 não encontrado. Por favor, instale Java 17."
	echo "   Você pode instalar via: brew install openjdk@17"
	exit 1
fi

# Garantir que o PATH use o Java 17
export PATH="$JAVA_HOME/bin:$PATH"

echo ""
echo "✓ Usando Java: $JAVA_HOME"
"$JAVA_HOME/bin/java" -version

# Verificar se as variáveis de keystore estão configuradas
if [ -z "$ANDROID_KEYSTORE_STORE_PASSWORD" ] && [ ! -f "android/keystore.properties" ]; then
	echo ""
	echo "⚠️  ATENÇÃO: credenciais do keystore não encontradas!"
	echo "📝 O build usará o keystore de debug (NÃO adequado para produção)"
	echo ""
	echo "Configure as variáveis de ambiente no .env:"
	echo "  ANDROID_KEYSTORE_STORE_PASSWORD=sua_senha"
	echo "  ANDROID_KEYSTORE_KEY_PASSWORD=sua_senha"
	echo "  ANDROID_KEYSTORE_KEY_ALIAS=likeme-key-alias"
	echo "  ANDROID_KEYSTORE_STORE_FILE=likeme-release.keystore"
	echo ""
	echo "Ou crie android/keystore.properties com as credenciais"
	echo ""
	echo "⚠️  Continuando com keystore de debug (apenas para testes)..."
	echo ""
elif [ -n "$ANDROID_KEYSTORE_STORE_PASSWORD" ]; then
	echo ""
	echo "✓ Credenciais do keystore encontradas nas variáveis de ambiente"
	echo ""
fi

# Prebuild (sem expo-dev-client — alinhado a builds de loja / eas store-common)
export EXCLUDE_EXPO_DEV_CLIENT=1
echo ""
echo "📦 Executando prebuild..."
npx expo prebuild --platform android --clean

# Forçar Java 17 no Gradle (evita erro "Error resolving plugin > 25.0.1" quando o sistema usa Java 25)
_JAVA17=$(/usr/libexec/java_home -v 17 2>/dev/null)
if [ -n "$_JAVA17" ]; then
	if ! grep -q "org.gradle.java.home" android/gradle.properties 2>/dev/null; then
		echo "" >> android/gradle.properties
		echo "# Forçar Java 17 (requerido pelo React Native / Android; Java 25 causa falha na resolução de plugins)" >> android/gradle.properties
		echo "org.gradle.java.home=$_JAVA17" >> android/gradle.properties
		echo "✓ org.gradle.java.home definido em gradle.properties"
	fi
fi

# Aplicar patch do build.gradle usando Python (mais confiável que sed no macOS)
if [ -f "android/app/build.gradle" ]; then
	echo ""
	echo "📝 Aplicando configuração de keystore de produção..."
	
	# Verificar se já foi aplicado - mas não aplicar mais, pois o usuário removeu
	if false && ! grep -q "keystorePropertiesFile" android/app/build.gradle 2>/dev/null; then
		python3 << 'PYTHON_SCRIPT'
import re

file_path = "android/app/build.gradle"
with open(file_path, 'r') as f:
    content = f.read()

# Adicionar código de carregamento do keystore antes de signingConfigs
keystore_code = '''    // Carregar propriedades do keystore de produção
    def keystorePropertiesFile = rootProject.file("keystore.properties")
    def keystoreProperties = new Properties()
    if (keystorePropertiesFile.exists()) {
        keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
    }

'''

# Inserir antes de signingConfigs
content = re.sub(r'(    signingConfigs \{)', keystore_code + r'\1', content)

# Adicionar release signingConfig após debug dentro de signingConfigs
release_config = '''        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'] ?: 'debug.keystore')
                storePassword keystoreProperties['storePassword'] ?: 'android'
                keyAlias keystoreProperties['keyAlias'] ?: 'androiddebugkey'
                keyPassword keystoreProperties['keyPassword'] ?: 'android'
            } else {
                storeFile file('debug.keystore')
                storePassword 'android'
                keyAlias 'androiddebugkey'
                keyPassword 'android'
            }
        }
'''

# Inserir após o fechamento do debug config dentro de signingConfigs (antes do fechamento de signingConfigs)
# Procurar por: debug { ... } seguido de } (fechamento de signingConfigs)
# e inserir release antes do fechamento
pattern = r'(        debug \{[^}]*\n        \}\n)(    \})'
replacement = r'\1' + release_config + r'\n\2'
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Mudar signingConfig no release para usar release
content = re.sub(r'(release \{[^}]*signingConfig )signingConfigs\.debug', r'\1signingConfigs.release', content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)

print("✅ Patch aplicado com sucesso!")
PYTHON_SCRIPT
	else
		echo "✓ Patch já aplicado"
	fi
fi

# Desabilitar postinstall do iOS durante o build Android
export SKIP_IOS_POD_INSTALL=true

# Build AAB (formato necessário para Google Play)
echo ""
echo "🔨 Gerando AAB (Android App Bundle)..."
cd android

# Garantir que JAVA_HOME está definido antes de executar qualquer comando Gradle
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"

# Verificar se o JAVA_HOME está correto
if [ -z "$JAVA_HOME" ]; then
	echo "❌ Erro: JAVA_HOME não está definido corretamente"
	exit 1
fi

echo "✓ Usando Java: $JAVA_HOME"
"$JAVA_HOME/bin/java" -version

# Limpar build anterior para forçar recompilação
echo "🧹 Limpando build anterior..."
./gradlew --stop || true
rm -rf app/build .gradle build || true

# Gerar AAB (forçar rebuild completo)
echo "🔨 Compilando AAB..."
# Garantir que JAVA_HOME está definido novamente antes do build
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
./gradlew :app:bundleRelease --no-daemon || true

if [ ! -f app/build/outputs/bundle/release/app-release.aab ]; then
	echo ""
	echo "❌ O AAB não foi gerado. O Gradle está executando só as tarefas dos plugins (:gradle-plugin, :expo-gradle-plugin) e não configura o projeto :app."
	echo "   Isso é um problema conhecido com Expo 54 / React Native 0.81 e Gradle 8.14 em builds locais com includeBuild."
	echo ""
	echo "   Alternativas:"
	echo "   • EAS Build (recomendado): npm run build:android  ou  eas build --platform android"
	echo "   • Ou use um emulador/dispositivo: npx expo run:android --variant release"
	echo ""
	exit 1
fi

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

