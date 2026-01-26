#!/bin/bash

# Script para aplicar patch do keystore no build.gradle após prebuild

BUILD_GRADLE="android/app/build.gradle"
PATCH_FILE="android/app/build.gradle.patch"

if [ ! -f "$BUILD_GRADLE" ]; then
	echo "⚠️  $BUILD_GRADLE não encontrado. Execute 'npx expo prebuild --platform android' primeiro."
	exit 1
fi

# Verificar se o patch já foi aplicado
if grep -q "keystorePropertiesFile" "$BUILD_GRADLE"; then
	echo "✓ Patch do keystore já aplicado em $BUILD_GRADLE"
	exit 0
fi

echo "📝 Aplicando patch do keystore em $BUILD_GRADLE..."

# Criar backup
cp "$BUILD_GRADLE" "$BUILD_GRADLE.backup"

# Encontrar a linha onde está signingConfigs
SIGNING_CONFIGS_LINE=$(grep -n "signingConfigs {" "$BUILD_GRADLE" | head -1 | cut -d: -f1)

if [ -z "$SIGNING_CONFIGS_LINE" ]; then
	echo "❌ Não foi possível encontrar 'signingConfigs' em $BUILD_GRADLE"
	exit 1
fi

# Adicionar código de carregamento do keystore antes de signingConfigs
sed -i.bak "${SIGNING_CONFIGS_LINE}i\\
    // Carregar propriedades do keystore de produção\\
    def keystorePropertiesFile = rootProject.file(\"keystore.properties\")\\
    def keystoreProperties = new Properties()\\
    if (keystorePropertiesFile.exists()) {\\
        keystoreProperties.load(new FileInputStream(keystorePropertiesFile))\\
    }\\
\\
" "$BUILD_GRADLE"

# Adicionar release signingConfig se não existir
if ! grep -A 15 "signingConfigs {" "$BUILD_GRADLE" | grep -q "release {"; then
	# Encontrar linha após debug config (primeira } após signingConfigs)
	DEBUG_END=$(awk -v start="$SIGNING_CONFIGS_LINE" 'NR > start && /^[[:space:]]*}[[:space:]]*$/ {print NR; exit}' "$BUILD_GRADLE")
	
	if [ ! -z "$DEBUG_END" ]; then
		sed -i.bak "${DEBUG_END}a\\
        release {\\
            if (keystorePropertiesFile.exists()) {\\
                storeFile file(keystoreProperties['storeFile'] ?: 'debug.keystore')\\
                storePassword keystoreProperties['storePassword'] ?: 'android'\\
                keyAlias keystoreProperties['keyAlias'] ?: 'androiddebugkey'\\
                keyPassword keystoreProperties['keyPassword'] ?: 'android'\\
            } else {\\
                storeFile file('debug.keystore')\\
                storePassword 'android'\\
                keyAlias 'androiddebugkey'\\
                keyPassword 'android'\\
            }\\
        }\\
" "$BUILD_GRADLE"
	fi
fi

# Substituir signingConfig no buildTypes.release
sed -i.bak 's/signingConfig signingConfigs\.debug/signingConfig signingConfigs.release/g' "$BUILD_GRADLE"

# Limpar arquivos .bak
rm -f "$BUILD_GRADLE.bak"

echo "✅ Patch aplicado com sucesso!"
echo "📝 Verifique $BUILD_GRADLE e ajuste se necessário"

