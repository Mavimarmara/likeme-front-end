#!/bin/bash

# Script para build local do Android com configuração correta do Java

# Configurar JAVA_HOME para Java 17 (compatível com Gradle)
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

if [ -z "$JAVA_HOME" ]; then
  echo "❌ Java 17 não encontrado. Por favor, instale Java 17."
  exit 1
fi

echo "✓ Usando Java: $JAVA_HOME"
java -version

# Executar build local
echo ""
echo "🚀 Iniciando build local do Android..."
eas build --local --platform android --profile staging
