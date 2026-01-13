#!/bin/bash

# Script para build local do iOS sem usar EAS (evita filas)

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

# Verificar se está no macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo "❌ Este script requer macOS para builds iOS"
  exit 1
fi

# Verificar se Xcode está instalado
if ! command -v xcodebuild &> /dev/null; then
  echo "❌ Xcode não encontrado. Por favor, instale o Xcode da App Store."
  exit 1
fi

echo ""
echo "✓ Xcode encontrado"
xcodebuild -version

# Verificar se CocoaPods está instalado
if ! command -v pod &> /dev/null; then
  echo "❌ CocoaPods não encontrado. Instalando..."
  sudo gem install cocoapods
fi

echo ""
echo "✓ CocoaPods: $(pod --version)"

# Verificar se o diretório ios existe
if [ ! -d "ios" ]; then
  echo "📦 Executando prebuild para gerar projeto iOS..."
  npx expo prebuild --platform ios
fi

# Instalar pods
echo ""
echo "📦 Instalando dependências CocoaPods..."
cd ios
pod install
cd ..

# Perguntar qual tipo de build
echo ""
echo "🔨 Qual tipo de build você deseja?"
echo "1) Simulador (mais rápido, para testes)"
echo "2) Dispositivo físico (requer certificados)"
echo "3) Archive para distribuição (requer certificados e perfil de provisionamento)"
read -p "Escolha (1-3): " build_type

case $build_type in
  1)
    echo ""
    echo "🚀 Iniciando build para simulador..."
    echo "📱 O app será instalado automaticamente no simulador"
    npx expo run:ios
    ;;
  2)
    echo ""
    echo "🚀 Iniciando build para dispositivo físico..."
    echo "📱 Conecte seu iPhone/iPad via USB e certifique-se de que está confiável"
    npx expo run:ios --device
    ;;
  3)
    echo ""
    echo "🚀 Iniciando build Archive para distribuição..."
    echo "📦 Isso criará um .ipa que pode ser enviado para TestFlight"
    echo ""
    echo "⚠️  IMPORTANTE: Certifique-se de que:"
    echo "   - Você tem certificados configurados no Xcode"
    echo "   - O Bundle ID 'app.likeme.com' está registrado no Apple Developer"
    echo "   - Você tem um perfil de provisionamento válido"
    echo ""
    read -p "Continuar? (y/n): " confirm
    
    if [ "$confirm" != "y" ]; then
      echo "❌ Build cancelado"
      exit 0
    fi
    
    # Build Archive usando Xcode
    echo ""
    echo "📦 Criando Archive..."
    cd ios
    xcodebuild archive \
      -workspace LikeMe.xcworkspace \
      -scheme LikeMe \
      -configuration Release \
      -archivePath build/LikeMe.xcarchive \
      -allowProvisioningUpdates
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "✅ Archive criado com sucesso!"
      echo "📁 Localização: ios/build/LikeMe.xcarchive"
      echo ""
      echo "📤 Para exportar o .ipa:"
      echo "   1. Abra o Xcode"
      echo "   2. Window → Organizer"
      echo "   3. Selecione o archive"
      echo "   4. Clique em 'Distribute App'"
      echo "   5. Escolha 'App Store Connect' ou 'Ad Hoc'"
    else
      echo "❌ Erro ao criar Archive. Verifique os logs acima."
      exit 1
    fi
    cd ..
    ;;
  *)
    echo "❌ Opção inválida"
    exit 1
    ;;
esac

echo ""
echo "✅ Build concluído!"

