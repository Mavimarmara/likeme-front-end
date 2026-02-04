#!/bin/bash

# Script para build local do Android sem usar EAS (evita filas)

# Carregar variáveis de ambiente do .env
if [ -f .env ]; then
  echo "📋 Carregando variáveis de ambiente do .env..."
  set -a
  source .env
  set +a
  echo "✓ Variáveis de ambiente carregadas"
  
  if [ -z "$EXPO_PUBLIC_AUTH0_DOMAIN" ]; then
    echo "⚠️  Aviso: EXPO_PUBLIC_AUTH0_DOMAIN não encontrado no .env"
  else
    echo "✓ EXPO_PUBLIC_AUTH0_DOMAIN: $EXPO_PUBLIC_AUTH0_DOMAIN"
  fi
else
  echo "⚠️  Arquivo .env não encontrado. As variáveis de ambiente podem não estar disponíveis."
fi

# Configurar JAVA_HOME para Java 17 (compatível com Gradle)
export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home -v 21 2>/dev/null || /usr/libexec/java_home -v 11 2>/dev/null)

if [ -z "$JAVA_HOME" ]; then
  echo "❌ Java não encontrado. Por favor, instale Java 17, 21 ou 11."
  echo "   Você pode instalar via: brew install openjdk@17"
  exit 1
fi

export PATH="$JAVA_HOME/bin:$PATH"

echo ""
echo "✓ Usando Java: $JAVA_HOME"
java -version

# Verificar se Android SDK está configurado
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
  echo ""
  echo "⚠️  ANDROID_HOME não está configurado."
  echo "   Configure no seu ~/.zshrc ou ~/.bash_profile:"
  echo "   export ANDROID_HOME=\$HOME/Library/Android/sdk"
  echo "   export PATH=\$PATH:\$ANDROID_HOME/emulator:\$ANDROID_HOME/platform-tools"
  echo ""
  echo "   Continuando mesmo assim..."
else
  echo ""
  echo "✓ Android SDK encontrado: ${ANDROID_HOME:-$ANDROID_SDK_ROOT}"
fi

# Verificar se o diretório android existe
if [ ! -d "android" ]; then
  echo ""
  echo "📦 Executando prebuild para gerar projeto Android..."
  npx expo prebuild --platform android
fi

# Desabilitar postinstall do iOS durante o build Android
export SKIP_IOS_POD_INSTALL=true

# Perguntar qual tipo de build
echo ""
echo "🔨 Qual tipo de build você deseja?"
echo "1) Emulador (mais rápido, para testes)"
echo "2) Dispositivo físico (requer USB debugging habilitado)"
echo "3) APK de release (para testes/distribuição direta)"
echo "4) AAB de release (para Google Play Store)"
echo "5) EAS Build local (staging - APK)"
echo "6) EAS Build local (production - APK)"
echo "7) EAS Build na nuvem (staging)"
echo "8) EAS Build na nuvem (production)"
read -p "Escolha (1-8): " build_type

case $build_type in
  1)
    echo ""
    echo "🚀 Iniciando build para emulador..."
    echo "📱 O app será instalado automaticamente no emulador"
    echo ""
    echo "💡 Dica: Se não houver emulador rodando, execute primeiro:"
    echo "   ./start-emulator.sh"
    echo ""
    npx expo run:android
    ;;
  2)
    echo ""
    echo "🚀 Iniciando build para dispositivo físico..."
    echo "📱 Conecte seu dispositivo Android via USB e certifique-se de que:"
    echo "   - USB Debugging está habilitado"
    echo "   - O dispositivo está autorizado para depuração"
    echo ""
    npx expo run:android --device
    ;;
  3)
    echo ""
    echo "🚀 Iniciando build APK de release..."
    echo "📦 Isso criará um .apk que pode ser instalado diretamente"
    echo ""
    
    # Verificar credenciais do keystore
    if [ -z "$ANDROID_KEYSTORE_STORE_PASSWORD" ] && [ ! -f "android/keystore.properties" ]; then
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
    fi
    
    # Auto-confirmar se não for interativo
    if [ -t 0 ]; then
      read -p "Continuar? (y/n): " confirm
      if [ "$confirm" != "y" ]; then
        echo "❌ Build cancelado"
        exit 0
      fi
    else
      echo "✅ Modo não-interativo: continuando automaticamente..."
    fi
    
    # Prebuild
    echo ""
    echo "📦 Executando prebuild..."
    npx expo prebuild --platform android --clean
    
    # Build APK usando Gradle
    echo ""
    echo "🔨 Gerando APK..."
    cd android
    
    # Garantir que JAVA_HOME está definido
    export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home -v 21 2>/dev/null || /usr/libexec/java_home -v 11 2>/dev/null)
    export PATH="$JAVA_HOME/bin:$PATH"
    
    # Tentar build
    ./gradlew assembleRelease
    BUILD_EXIT_CODE=$?
    
    # Verificar se o APK foi gerado
    if [ $BUILD_EXIT_CODE -eq 0 ] && [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
      echo ""
      echo "✅ APK gerado com sucesso!"
      echo "📁 Localização: android/app/build/outputs/apk/release/app-release.apk"
      echo ""
      echo "📱 Para instalar no dispositivo:"
      echo "   adb install android/app/build/outputs/apk/release/app-release.apk"
      echo ""
      echo "   Ou use o script: ./install-and-run-apk.sh"
    elif [ $BUILD_EXIT_CODE -eq 0 ] && [ ! -f "app/build/outputs/apk/release/app-release.apk" ]; then
      # Gradle retornou sucesso mas APK não existe - tentar limpar e recompilar
      echo ""
      echo "⚠️  Gradle concluiu mas APK não encontrado. Limpando e recompilando..."
      ./gradlew clean
      ./gradlew assembleRelease
      
      if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
        echo ""
        echo "✅ APK gerado com sucesso após limpeza!"
        echo "📁 Localização: android/app/build/outputs/apk/release/app-release.apk"
        echo ""
        echo "📱 Para instalar no dispositivo:"
        echo "   adb install android/app/build/outputs/apk/release/app-release.apk"
      else
        echo ""
        echo "❌ Erro: APK não foi gerado após limpeza."
        echo "   Verifique os logs do Gradle acima para mais detalhes."
        exit 1
      fi
    else
      echo ""
      echo "❌ Erro ao executar Gradle (código de saída: $BUILD_EXIT_CODE)"
      echo "   Verifique os logs acima para mais detalhes."
      exit 1
    fi
    cd ..
    ;;
  4)
    echo ""
    echo "🚀 Iniciando build AAB de release..."
    echo "📦 Isso criará um .aab para upload na Google Play Store"
    echo ""
    
    # Verificar credenciais do keystore
    if [ -z "$ANDROID_KEYSTORE_STORE_PASSWORD" ] && [ ! -f "android/keystore.properties" ]; then
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
    fi
    
    # Auto-confirmar se não for interativo
    if [ -t 0 ]; then
      read -p "Continuar? (y/n): " confirm
      if [ "$confirm" != "y" ]; then
        echo "❌ Build cancelado"
        exit 0
      fi
    else
      echo "✅ Modo não-interativo: continuando automaticamente..."
    fi
    
    # Prebuild
    echo ""
    echo "📦 Executando prebuild..."
    npx expo prebuild --platform android --clean
    
    # Build AAB usando Gradle
    echo ""
    echo "🔨 Gerando AAB (Android App Bundle)..."
    cd android
    
    # Garantir que JAVA_HOME está definido
    export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home -v 21 2>/dev/null || /usr/libexec/java_home -v 11 2>/dev/null)
    export PATH="$JAVA_HOME/bin:$PATH"
    
    # Limpar build anterior
    echo "🧹 Limpando build anterior..."
    ./gradlew --stop || true
    rm -rf app/build .gradle build || true
    
    # Gerar AAB
    ./gradlew :app:bundleRelease --no-daemon
    BUILD_EXIT_CODE=$?
    
    # Verificar se o AAB foi gerado
    if [ $BUILD_EXIT_CODE -eq 0 ] && [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
      echo ""
      echo "✅ AAB gerado com sucesso!"
      echo "📁 Localização: android/app/build/outputs/bundle/release/app-release.aab"
      echo ""
      echo "📤 Próximos passos para upload na Google Play:"
      echo "   1. Acesse: https://play.google.com/console"
      echo "   2. Vá em: Production → Releases → Create new release"
      echo "   3. Faça upload do arquivo .aab acima"
      echo ""
      echo "   Ou use o comando EAS Submit:"
      echo "   eas submit --platform android --latest"
    elif [ $BUILD_EXIT_CODE -eq 0 ] && [ ! -f "app/build/outputs/bundle/release/app-release.aab" ]; then
      echo ""
      echo "⚠️  Gradle concluiu mas AAB não foi gerado."
      echo "   Isso é um problema conhecido com Expo 54 / React Native 0.81 e Gradle 8.14"
      echo "   em builds locais com includeBuild."
      echo ""
      echo "   Alternativas:"
      echo "   • EAS Build (recomendado): eas build --platform android --profile production"
      echo "   • Ou use um emulador/dispositivo: npx expo run:android --variant release"
      echo ""
      exit 1
    else
      echo ""
      echo "❌ Erro ao executar Gradle (código de saída: $BUILD_EXIT_CODE)"
      echo "   Verifique os logs acima para mais detalhes."
      exit 1
    fi
    cd ..
    ;;
  5)
    echo ""
    echo "🚀 Iniciando EAS Build local (staging - APK)..."
    echo "📦 Isso criará um APK usando EAS Build localmente"
    echo ""
    
    # Auto-confirmar se não for interativo
    if [ -t 0 ]; then
      read -p "Continuar? (y/n): " confirm
      if [ "$confirm" != "y" ]; then
        echo "❌ Build cancelado"
        exit 0
      fi
    else
      echo "✅ Modo não-interativo: continuando automaticamente..."
    fi
    
    eas build --local --platform android --profile staging
    ;;
  6)
    echo ""
    echo "🚀 Iniciando EAS Build local (production - APK)..."
    echo "📦 Isso criará um APK de produção (backend production) usando EAS Build localmente"
    echo ""
    
    # Auto-confirmar se não for interativo
    if [ -t 0 ]; then
      read -p "Continuar? (y/n): " confirm
      if [ "$confirm" != "y" ]; then
        echo "❌ Build cancelado"
        exit 0
      fi
    else
      echo "✅ Modo não-interativo: continuando automaticamente..."
    fi
    
    eas build --local --platform android --profile production-apk
    ;;
  7)
    echo ""
    echo "🚀 Iniciando EAS Build na nuvem (staging)..."
    echo "📦 Isso criará um build na nuvem do EAS (pode levar alguns minutos)"
    echo "📱 Você receberá um link para download quando concluir"
    echo ""
    
    # Sincronizar variáveis do .env com EAS Secrets (para o build na nuvem usar o mesmo .env)
    if [ -f .env ]; then
      echo "📤 Sincronizando variáveis do .env com EAS Secrets..."
      if node scripts/sync-env-to-eas-secrets.js; then
        echo "✓ Variáveis EXPO_PUBLIC_* do .env foram enviadas para o EAS"
      else
        echo "⚠️  Sync de secrets falhou (ex: eas login). O build usará eas.json + EAS Secrets já configuradas."
      fi
      echo ""
    else
      echo "⚠️  Arquivo .env não encontrado. O build usará apenas variáveis do eas.json e EAS Secrets."
      echo ""
    fi
    
    # Auto-confirmar se não for interativo
    if [ -t 0 ]; then
      read -p "Continuar? (y/n): " confirm
      if [ "$confirm" != "y" ]; then
        echo "❌ Build cancelado"
        exit 0
      fi
    else
      echo "✅ Modo não-interativo: continuando automaticamente..."
    fi
    
    eas build --platform android --profile staging
    ;;
  8)
    echo ""
    echo "🚀 Iniciando EAS Build na nuvem (production)..."
    echo "📦 Isso criará um build de produção na nuvem do EAS (pode levar alguns minutos)"
    echo "📱 Você receberá um link para download quando concluir"
    echo ""
    
    # Sincronizar variáveis do .env com EAS Secrets (para o build na nuvem usar o mesmo .env)
    if [ -f .env ]; then
      echo "📤 Sincronizando variáveis do .env com EAS Secrets..."
      if node scripts/sync-env-to-eas-secrets.js; then
        echo "✓ Variáveis EXPO_PUBLIC_* do .env foram enviadas para o EAS"
      else
        echo "⚠️  Sync de secrets falhou (ex: eas login). O build usará eas.json + EAS Secrets já configuradas."
      fi
      echo ""
    else
      echo "⚠️  Arquivo .env não encontrado. O build usará apenas variáveis do eas.json e EAS Secrets."
      echo ""
    fi
    
    # Auto-confirmar se não for interativo
    if [ -t 0 ]; then
      read -p "Continuar? (y/n): " confirm
      if [ "$confirm" != "y" ]; then
        echo "❌ Build cancelado"
        exit 0
      fi
    else
      echo "✅ Modo não-interativo: continuando automaticamente..."
    fi
    
    eas build --platform android --profile production
    ;;
  *)
    echo "❌ Opção inválida"
    exit 1
    ;;
esac

echo ""
echo "✅ Build concluído!"
