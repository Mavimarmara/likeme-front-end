#!/bin/bash

# Script para gerar build para TestFlight
# Execute este script manualmente no terminal

set -e

echo "🚀 Build para TestFlight - LikeMe"
echo "=================================="
echo ""

# Definir encoding
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Ir para o diretório do projeto
cd "$(dirname "$0")"

echo "📦 Perfil: staging (TestFlight Internal)"
echo "🔧 Backend: https://likeme-back-end-git-staging-pixel-pulse-labs.vercel.app"
echo ""

# Verificar se está logado no EAS
echo "🔐 Verificando login no EAS..."
if ! eas whoami &>/dev/null; then
  echo "❌ Você não está logado no EAS."
  echo "   Execute: eas login"
  exit 1
fi

echo "✅ Logado no EAS como: $(eas whoami)"
echo ""

# Perguntar se quer fazer build na nuvem ou local
echo "Escolha o tipo de build:"
echo "  1) Build na nuvem (EAS) - Recomendado"
echo "  2) Build local (Xcode) - Mais rápido se configurado"
echo ""
read -p "Opção (1 ou 2): " BUILD_TYPE

case $BUILD_TYPE in
  1)
    echo ""
    echo "☁️  Iniciando build na nuvem..."
    echo "⏱️  Tempo estimado: 15-30 minutos"
    echo ""
    
    # Build na nuvem
    eas build --platform ios --profile staging
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "✅ Build concluído com sucesso!"
      echo ""
      echo "📤 Deseja submeter automaticamente para o TestFlight?"
      read -p "(s/n): " SUBMIT
      
      if [ "$SUBMIT" = "s" ] || [ "$SUBMIT" = "S" ]; then
        echo ""
        echo "📤 Submetendo para TestFlight..."
        eas submit --platform ios --profile staging --latest
        
        if [ $? -eq 0 ]; then
          echo ""
          echo "✅ Submetido com sucesso para TestFlight!"
          echo ""
          echo "📱 Próximos passos:"
          echo "   1. Acesse: https://appstoreconnect.apple.com/"
          echo "   2. Vá em TestFlight → iOS Builds"
          echo "   3. Aguarde processamento (5-15 minutos)"
          echo "   4. Adicione testadores quando o build estiver processado"
        else
          echo ""
          echo "❌ Erro ao submeter para TestFlight"
          echo "   Você pode submeter manualmente depois com:"
          echo "   eas submit --platform ios --profile staging --latest"
        fi
      else
        echo ""
        echo "ℹ️  Build criado mas não submetido."
        echo "   Para submeter depois, execute:"
        echo "   eas submit --platform ios --profile staging --latest"
      fi
    else
      echo ""
      echo "❌ Erro no build"
      exit 1
    fi
    ;;
    
  2)
    echo ""
    echo "🔨 Iniciando build local..."
    echo ""
    
    # Verificar se o diretório ios existe
    if [ ! -d "ios" ]; then
      echo "❌ Diretório ios não encontrado"
      echo "   Execute primeiro: npx expo prebuild --platform ios"
      exit 1
    fi
    
    # Instalar pods
    echo "📦 Instalando dependências CocoaPods..."
    cd ios
    export LANG=en_US.UTF-8
    pod install
    
    if [ $? -ne 0 ]; then
      echo "❌ Erro ao instalar pods"
      exit 1
    fi
    
    # Criar Archive
    echo ""
    echo "📦 Criando Archive..."
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
      echo ""
      echo "⚠️  Export automático falhou."
      echo ""
      echo "📱 Você pode exportar manualmente:"
      echo "   1. Abra o Xcode"
      echo "   2. Window → Organizer"
      echo "   3. Selecione o Archive"
      echo "   4. Clique em 'Distribute App'"
      echo "   5. Escolha 'App Store Connect'"
      echo ""
      echo "📁 Archive localizado em: ios/build/LikeMe.xcarchive"
      exit 1
    fi
    
    IPA_PATH="build/export/LikeMe.ipa"
    
    if [ ! -f "$IPA_PATH" ]; then
      echo "❌ .ipa não encontrado em $IPA_PATH"
      exit 1
    fi
    
    echo "✅ .ipa criado: $IPA_PATH"
    cd ..
    
    # Submeter via EAS Submit
    echo ""
    echo "📤 Submetendo para TestFlight..."
    eas submit --platform ios --profile staging --path "ios/$IPA_PATH"
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "✅ Submetido com sucesso para TestFlight!"
      echo ""
      echo "📱 Próximos passos:"
      echo "   1. Acesse: https://appstoreconnect.apple.com/"
      echo "   2. Vá em TestFlight → iOS Builds"
      echo "   3. Aguarde processamento (5-15 minutos)"
      echo "   4. Adicione testadores quando o build estiver processado"
    else
      echo ""
      echo "❌ Erro ao submeter para TestFlight"
    fi
    ;;
    
  *)
    echo "❌ Opção inválida"
    exit 1
    ;;
esac

echo ""
echo "✨ Processo concluído!"

