# 📱 Build Local para Google Play (Sem EAS)

Este guia explica como gerar builds para Google Play usando apenas Gradle, sem o EAS.

## 📋 Pré-requisitos

1. ✅ Android SDK instalado
2. ✅ Java 17 instalado
3. ✅ Variáveis de ambiente configuradas:
   - `ANDROID_HOME` ou `ANDROID_SDK_ROOT`
   - `JAVA_HOME` apontando para Java 17

## 🔑 Passo 1: Criar Keystore de Produção

### Gerar o Keystore

```bash
cd likeme-front-end/android/app

# Gerar keystore (substitua os valores)
keytool -genkeypair -v -storetype PKCS12 -keystore likeme-release.keystore \
  -alias likeme-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass SUA_SENHA_AQUI \
  -keypass SUA_SENHA_AQUI
```

**Importante**: Guarde a senha e o alias em local seguro! Você precisará deles para todas as atualizações.

### Mover o Keystore

```bash
# Mover para a pasta android/app
mv likeme-release.keystore android/app/
```

## 🔐 Passo 2: Configurar Credenciais no Gradle

### Criar arquivo de propriedades

Crie o arquivo `android/keystore.properties`:

```properties
storePassword=SUA_SENHA_AQUI
keyPassword=SUA_SENHA_AQUI
keyAlias=likeme-key-alias
storeFile=likeme-release.keystore
```

**⚠️ IMPORTANTE**: Adicione `keystore.properties` ao `.gitignore` para não commitar as senhas!

### Atualizar build.gradle

O arquivo `android/app/build.gradle` já está configurado para ler essas propriedades.

## 🚀 Passo 3: Gerar Build

### Opção 1: Gerar APK (para testes)

```bash
cd likeme-front-end

# Prebuild (gera código nativo)
npx expo prebuild --platform android

# Gerar APK de release
cd android
./gradlew assembleRelease

# O APK estará em:
# android/app/build/outputs/apk/release/app-release.apk
```

### Opção 2: Gerar AAB (para Google Play)

```bash
cd likeme-front-end

# Prebuild (gera código nativo)
npx expo prebuild --platform android

# Gerar AAB de release
cd android
./gradlew bundleRelease

# O AAB estará em:
# android/app/build/outputs/bundle/release/app-release.aab
```

## 📤 Passo 4: Enviar para Google Play

### Upload Manual

1. Acesse [Google Play Console](https://play.google.com/console)
2. Vá em: **Production** → **Releases** → **Create new release**
3. Faça upload do arquivo `.aab` gerado
4. Preencha as informações da release
5. Clique em **Review release**

### Upload via API (Opcional)

Se você tiver credenciais de Service Account:

```bash
# Instalar Google Play Developer API
pip install google-api-python-client

# Fazer upload via API
# (requer configuração adicional)
```

## 🔧 Scripts Automatizados

### Script para Build Completo

Crie `build-android-production.sh`:

```bash
#!/bin/bash

set -e

echo "🚀 Iniciando build de produção para Android..."

# Carregar variáveis de ambiente
if [ -f .env ]; then
  set -a
  source .env
  set +a
  echo "✓ Variáveis de ambiente carregadas"
fi

# Verificar Java
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
if [ -z "$JAVA_HOME" ]; then
  echo "❌ Java 17 não encontrado"
  exit 1
fi

# Prebuild
echo "📦 Executando prebuild..."
npx expo prebuild --platform android --clean

# Build AAB
echo "🔨 Gerando AAB..."
cd android
./gradlew bundleRelease

echo "✅ Build concluído!"
echo "📦 AAB gerado em: android/app/build/outputs/bundle/release/app-release.aab"
```

Tornar executável:

```bash
chmod +x build-android-production.sh
```

## 📝 Configuração do build.gradle

O arquivo `android/app/build.gradle` precisa ter:

```gradle
// Carregar propriedades do keystore
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... outras configurações ...
    
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ... outras configurações ...
        }
    }
}
```

## 🔄 Versionamento

Para atualizar a versão:

1. Edite `app.config.js`:
   ```javascript
   version: '1.0.1',  // Versão do app
   ```

2. Edite `android/app/build.gradle`:
   ```gradle
   defaultConfig {
       versionCode 2  // Incremente este número
       versionName "1.0.1"  // Mesma versão do app.config.js
   }
   ```

## ✅ Checklist

- [ ] Keystore de produção criado
- [ ] `keystore.properties` configurado (não commitado)
- [ ] `build.gradle` configurado para usar keystore de produção
- [ ] Java 17 instalado e configurado
- [ ] Android SDK instalado
- [ ] Build de teste gerado com sucesso
- [ ] AAB gerado e testado

## 🐛 Troubleshooting

### Erro: "keystore.properties not found"

Certifique-se de que o arquivo existe em `android/keystore.properties`

### Erro: "Keystore was tampered with, or password was incorrect"

Verifique se as senhas no `keystore.properties` estão corretas

### Erro: "Java version mismatch"

Certifique-se de usar Java 17:
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### Build muito lento

Adicione ao `android/gradle.properties`:
```properties
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.caching=true
```

## 📚 Comandos Úteis

```bash
# Limpar build anterior
cd android && ./gradlew clean && cd ..

# Ver tasks disponíveis
cd android && ./gradlew tasks && cd ..

# Build apenas para debug (mais rápido para testes)
cd android && ./gradlew assembleDebug && cd ..

# Verificar assinatura do APK/AAB
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk
```

## 🔒 Segurança

**NUNCA commite**:
- `keystore.properties`
- `likeme-release.keystore`
- Qualquer arquivo com senhas

Adicione ao `.gitignore`:
```
android/keystore.properties
android/app/*.keystore
android/app/*.jks
!android/app/debug.keystore
```

