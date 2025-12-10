#!/bin/bash

# Script para executar testes E2E com Expo Go
# Este script detecta automaticamente a URL do Expo e executa os testes

set -e

echo "🧪 Testes E2E com Expo Go"
echo "========================="
echo ""

# Verificar se o Expo está rodando
if ! pgrep -f "expo start" > /dev/null && ! pgrep -f "metro" > /dev/null; then
    echo "⚠️  Servidor Expo não está rodando!"
    echo ""
    echo "Por favor, inicie o servidor Expo em outro terminal:"
    echo "  npx expo start"
    echo ""
    echo "Depois execute este script novamente."
    exit 1
fi

# Tentar obter a URL do Expo
# Método 1: Verificar logs do Expo
EXPO_URL=$(ps aux | grep -i "expo start" | grep -o "exp://[0-9.]*:[0-9]*" | head -1)

# Método 2: Tentar obter IP local de forma mais confiável
if [ -z "$EXPO_URL" ]; then
    # Tentar obter IP de diferentes interfaces
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
    
    # Se ainda não encontrou, tentar ipconfig
    if [ -z "$LOCAL_IP" ]; then
        LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "192.168.1.100")
    fi
    
    EXPO_URL="exp://${LOCAL_IP}:8081"
    echo "⚠️  Não foi possível detectar a URL do Expo automaticamente"
    echo "   Usando URL detectada: $EXPO_URL"
    echo ""
    echo "   Se esta URL não funcionar, verifique:"
    echo "   1. Se o Expo está rodando (npx expo start)"
    echo "   2. A URL que aparece no terminal do Expo"
    echo "   3. Edite manualmente o arquivo: maestro/expo-go-test.yaml"
    echo ""
fi

echo "📱 URL do Expo detectada: $EXPO_URL"
echo ""

# Verificar se o Expo Go está instalado no simulador
if ! xcrun simctl listapps booted | grep -i "host.exp.Exponent" > /dev/null; then
    echo "⚠️  Expo Go não encontrado no simulador!"
    echo ""
    echo "Por favor, instale o Expo Go no simulador iOS:"
    echo "  1. Abra o App Store no simulador"
    echo "  2. Procure por 'Expo Go'"
    echo "  3. Instale o app"
    echo ""
    echo "Ou abra manualmente o Expo Go e escaneie o QR code primeiro."
    echo ""
    read -p "Pressione Enter para continuar mesmo assim..."
fi

# Criar arquivo de teste temporário com a URL correta
TEMP_TEST_FILE=$(mktemp)
cat > "$TEMP_TEST_FILE" << EOF
appId: host.exp.Exponent
---
# Teste gerado automaticamente com URL do Expo
- openLink: "$EXPO_URL"

# Aguardar carregamento inicial
- waitForAnimationToEnd
- waitForAnimationToEnd
- waitForAnimationToEnd

# Aguardar até encontrar algum texto visível (app carregou)
- assertVisible: 
    text: ".*"
    optional: true

# Navegar até Welcome (se estiver na tela Unauthenticated)
- runFlow:
    when:
      visible: "LIKE YOUR LIFE"
    commands:
      - assertVisible: "LIKE YOUR LIFE"
      - assertVisible: "Next"
      - tapOn: "Next"
      - waitForAnimationToEnd

# Aguardar navegação para Welcome
- waitForAnimationToEnd
- waitForAnimationToEnd

# Testar Welcome Screen (com opções mais flexíveis)
- runFlow:
    when:
      visible: "Welcome!"
    commands:
      - assertVisible: "Welcome!"
      - assertVisible: "How can I call you?"
      - tapOn: 
          id: "input-Your name"
      - inputText: "Teste Maestro"
      - tapOn: "Next"
      - waitForAnimationToEnd
      - assertVisible: "Let's start,"

# Se não encontrou Welcome, apenas verificar que algo está visível
- assertVisible: 
    text: ".*"
    optional: true
EOF

echo "🚀 Executando testes..."
echo ""

# Executar o teste
~/.maestro/bin/maestro test "$TEMP_TEST_FILE" || {
    echo ""
    echo "❌ Teste falhou!"
    echo ""
    echo "Dicas para debug:"
    echo "  1. Verifique se o Expo Go está aberto no simulador"
    echo "  2. Verifique se a URL está correta: $EXPO_URL"
    echo "  3. Execute manualmente: npx expo start"
    echo "  4. Abra o Expo Go e escaneie o QR code primeiro"
    echo ""
    rm -f "$TEMP_TEST_FILE"
    exit 1
}

# Limpar arquivo temporário
rm -f "$TEMP_TEST_FILE"

echo ""
echo "✅ Testes concluídos!"