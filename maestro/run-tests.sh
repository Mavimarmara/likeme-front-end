#!/bin/bash

# Script para executar testes E2E no simulador iOS
# Uso: ./maestro/run-tests.sh [teste-especifico.yaml]

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Configurando ambiente para testes E2E...${NC}"

# Verificar se Maestro está instalado
if [ ! -f ~/.maestro/bin/maestro ]; then
    echo -e "${YELLOW}⚠️  Maestro não encontrado. Instalando...${NC}"
    curl -Ls "https://get.maestro.mobile.dev" | bash
fi

# Verificar simuladores disponíveis
echo -e "${BLUE}📱 Verificando simuladores iOS disponíveis...${NC}"
SIMULATORS=$(xcrun simctl list devices available | grep -i "iphone" | head -1)

if [ -z "$SIMULATORS" ]; then
    echo -e "${YELLOW}⚠️  Nenhum simulador iPhone encontrado.${NC}"
    echo "Por favor, abra o Simulator e selecione um iPhone."
    exit 1
fi

echo -e "${GREEN}✅ Simuladores encontrados:${NC}"
echo "$SIMULATORS"

# Verificar se o app está instalado
echo -e "${BLUE}🔍 Verificando se o app está instalado...${NC}"
APP_INSTALLED=$(xcrun simctl listapps booted | grep -i "likeme" || echo "")

if [ -z "$APP_INSTALLED" ]; then
    echo -e "${YELLOW}⚠️  App não encontrado no simulador.${NC}"
    echo -e "${BLUE}💡 Dica: Execute 'npm run ios' ou 'npx expo run:ios' primeiro${NC}"
    echo -e "${BLUE}💡 Ou use o Expo Go e escaneie o QR code${NC}"
    read -p "Deseja continuar mesmo assim? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Executar testes
TEST_FILE=${1:-"maestro/"}

echo -e "${GREEN}🚀 Executando testes E2E...${NC}"
echo -e "${BLUE}Arquivo de teste: $TEST_FILE${NC}"
echo ""

~/.maestro/bin/maestro test "$TEST_FILE" --verbose

echo ""
echo -e "${GREEN}✅ Testes concluídos!${NC}"