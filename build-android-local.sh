#!/bin/bash

# Script para build local do Android com configuração correta do Java e variáveis de ambiente

# Carregar variáveis de ambiente do .env
if [ -f .env ]; then
  echo "📋 Carregando variáveis de ambiente do .env..."
  # Exporta apenas variáveis EXPO_PUBLIC_* e outras variáveis relevantes
  set -a
  source .env
  set +a
  echo "✓ Variáveis de ambiente carregadas"
  
  # Verifica se as variáveis principais foram carregadas
  if [ -z "$EXPO_PUBLIC_AUTH0_DOMAIN" ]; then
    echo "⚠️  Aviso: EXPO_PUBLIC_AUTH0_DOMAIN não encontrado no .env"
  else
    echo "✓ EXPO_PUBLIC_AUTH0_DOMAIN: $EXPO_PUBLIC_AUTH0_DOMAIN"
  fi
else
  echo "⚠️  Arquivo .env não encontrado. As variáveis de ambiente podem não estar disponíveis."
fi

# Configurar JAVA_HOME para Java 17 (compatível com Gradle)
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

if [ -z "$JAVA_HOME" ]; then
  echo "❌ Java 17 não encontrado. Por favor, instale Java 17."
  exit 1
fi

echo ""
echo "✓ Usando Java: $JAVA_HOME"
java -version

# Executar build local
echo ""
echo "🚀 Iniciando build local do Android..."
echo "📦 As variáveis EXPO_PUBLIC_* serão injetadas pelo app.config.js durante o build"
eas build --local --platform android --profile staging
