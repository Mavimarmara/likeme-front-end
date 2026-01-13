#!/bin/bash

# Script para build e submit para TestFlight

# Carregar variáveis de ambiente do .env
if [ -f .env ]; then
  echo "📋 Carregando variáveis de ambiente do .env..."
  set -a
  source .env
  set +a
  echo "✓ Variáveis de ambiente carregadas"
else
  echo "⚠️  Arquivo .env não encontrado."
fi

# Verificar se está no macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo "❌ Este script requer macOS"
  exit 1
fi

echo ""
echo "🚀 Build e Submit para TestFlight"
echo "=================================="
echo ""

# Perguntar qual perfil usar
echo "📦 Qual perfil você deseja usar?"
echo "1) staging (TestFlight Internal)"
echo "2) production (TestFlight External)"
read -p "Escolha (1-2): " profile_choice

case $profile_choice in
  1)
    PROFILE="staging"
    ;;
  2)
    PROFILE="production"
    ;;
  *)
    echo "❌ Opção inválida"
    exit 1
    ;;
esac

echo ""
echo "🔨 Opções de build:"
echo "1) Build local + Submit (mais rápido, evita fila)"
echo "2) Build EAS + Submit (na nuvem, pode ter fila)"
read -p "Escolha (1-2): " build_choice

case $build_choice in
  1)
    echo ""
    echo "📦 Criando Archive local..."
    
    # Verificar se o diretório ios existe
    if [ ! -d "ios" ]; then
      echo "📦 Gerando projeto iOS..."
      npx expo prebuild --platform ios
    fi
    
    # Instalar pods
    echo "📦 Instalando dependências CocoaPods..."
    cd ios
    pod install
    cd ..
    
    # Criar Archive
    echo "📦 Criando Archive..."
    cd ios
    xcodebuild archive \
      -workspace LikeMe.xcworkspace \
      -scheme LikeMe \
      -configuration Release \
      -archivePath build/LikeMe.xcarchive \
      -allowProvisioningUpdates
    
    if [ $? -ne 0 ]; then
      echo "❌ Erro ao criar Archive"
      exit 1
    fi
    
    echo "✅ Archive criado!"
    echo ""
    echo "📤 Exportando .ipa..."
    
    # Criar diretório para export
    mkdir -p build/export
    
    # Exportar .ipa
    xcodebuild -exportArchive \
      -archivePath build/LikeMe.xcarchive \
      -exportPath build/export \
      -exportOptionsPlist exportOptions.plist \
      -allowProvisioningUpdates
    
    if [ $? -ne 0 ]; then
      echo "⚠️  Export automático falhou. Você precisará exportar manualmente:"
      echo "   1. Abra o Xcode"
      echo "   2. Window → Organizer"
      echo "   3. Selecione o Archive"
      echo "   4. Clique em 'Distribute App'"
      echo "   5. Escolha 'App Store Connect'"
      echo ""
      echo "📁 Archive localizado em: ios/build/LikeMe.xcarchive"
      exit 1
    fi
    
    IPA_PATH="ios/build/export/LikeMe.ipa"
    
    if [ ! -f "$IPA_PATH" ]; then
      echo "❌ .ipa não encontrado em $IPA_PATH"
      exit 1
    fi
    
    echo "✅ .ipa criado: $IPA_PATH"
    cd ..
    
    # Submeter via EAS Submit
    echo ""
    echo "📤 Submetendo para TestFlight..."
    eas submit --platform ios --profile $PROFILE --path "$IPA_PATH"
    ;;
    
  2)
    echo ""
    echo "☁️  Criando build na nuvem (EAS)..."
    echo "⏱️  Isso pode levar 15-30 minutos e pode ter fila"
    echo ""
    
    # Criar build
    eas build --platform ios --profile $PROFILE
    
    if [ $? -ne 0 ]; then
      echo "❌ Erro no build"
      exit 1
    fi
    
    echo ""
    echo "📤 Submetendo para TestFlight..."
    eas submit --platform ios --profile $PROFILE --latest
    ;;
    
  *)
    echo "❌ Opção inválida"
    exit 1
    ;;
esac

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build submetido com sucesso para TestFlight!"
  echo ""
  echo "📱 Próximos passos:"
  echo "   1. Acesse: https://appstoreconnect.apple.com/"
  echo "   2. Vá em TestFlight → iOS Builds"
  echo "   3. Aguarde processamento (5-15 minutos)"
  echo "   4. Adicione testadores quando o build estiver processado"
else
  echo ""
  echo "❌ Erro ao submeter para TestFlight"
  exit 1
fi

