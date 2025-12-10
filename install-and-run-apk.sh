#!/bin/bash

# Script para instalar e executar o APK no emulador Android

set -e

export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator

APK_PATH="/Users/weber/Projetos/likeme/likeme-front-end/android/build-1765210721613.apk"
PACKAGE_NAME="com.likeme.app"

echo "═══════════════════════════════════════════════════════════"
echo "  Instalando e Executando APK no Emulador Android"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Verifica se o APK existe
if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK não encontrado em: $APK_PATH"
    exit 1
fi

echo "✓ APK encontrado: $APK_PATH"
APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
echo "  Tamanho: $APK_SIZE"
echo ""

# Verifica se há um emulador rodando
echo "=== Verificando emuladores ==="
DEVICE=$(adb devices | grep -w "device" | head -1 | awk '{print $1}')

if [ -z "$DEVICE" ]; then
    echo "⚠ Nenhum emulador detectado. Iniciando emulador..."
    
    # Lista emuladores disponíveis
    AVAILABLE_AVDS=$($ANDROID_HOME/emulator/emulator -list-avds)
    if [ -z "$AVAILABLE_AVDS" ]; then
        echo "❌ Nenhum emulador disponível!"
        exit 1
    fi
    
    # Usa o primeiro emulador disponível
    AVD_NAME=$(echo "$AVAILABLE_AVDS" | head -1)
    echo "🚀 Iniciando emulador: $AVD_NAME"
    
    # Inicia o emulador em background
    $ANDROID_HOME/emulator/emulator -avd "$AVD_NAME" > /dev/null 2>&1 &
    EMULATOR_PID=$!
    echo "  PID: $EMULATOR_PID"
    echo ""
    
    echo "⏳ Aguardando emulador ficar pronto (isso pode levar 1-2 minutos)..."
    
    # Aguarda o emulador ficar pronto
    timeout=120
    counter=0
    while [ $counter -lt $timeout ]; do
        if adb devices | grep -q "emulator.*device"; then
            echo "✓ Emulador está pronto!"
            break
        fi
        sleep 2
        counter=$((counter + 2))
        if [ $((counter % 10)) -eq 0 ]; then
            echo "  Aguardando... (${counter}s)"
        fi
    done
    
    if [ $counter -ge $timeout ]; then
        echo "❌ Timeout aguardando emulador. Tente iniciar manualmente."
        exit 1
    fi
    
    # Aguarda um pouco mais para garantir que está totalmente pronto
    sleep 5
else
    echo "✓ Emulador já está rodando: $DEVICE"
    MODEL=$(adb -s $DEVICE shell getprop ro.product.model 2>/dev/null || echo "N/A")
    echo "  Modelo: $MODEL"
fi

echo ""
echo "=== Instalando APK ==="

# Desinstala versão anterior se existir (ignora erro se não existir)
adb uninstall "$PACKAGE_NAME" 2>/dev/null || true

# Instala o APK
echo "📦 Instalando APK..."
if adb install -r "$APK_PATH"; then
    echo "✓ APK instalado com sucesso!"
else
    echo "❌ Erro ao instalar APK"
    exit 1
fi

echo ""
echo "=== Iniciando aplicativo ==="

# Inicia o aplicativo
echo "🚀 Iniciando LikeMe..."
adb shell monkey -p "$PACKAGE_NAME" -c android.intent.category.LAUNCHER 1 > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Aplicativo iniciado!"
else
    # Tenta método alternativo
    echo "Tentando método alternativo..."
    adb shell am start -n "$PACKAGE_NAME/.MainActivity" 2>/dev/null || \
    adb shell am start -n "$PACKAGE_NAME/com.likeme.app.MainActivity" 2>/dev/null || \
    echo "⚠ Aplicativo instalado, mas não foi possível iniciar automaticamente"
    echo "  Abra manualmente no emulador"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✓ Concluído!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "O aplicativo LikeMe deve estar rodando no emulador."
echo ""
echo "Comandos úteis:"
echo "  - Ver logs: adb logcat | grep -i likeme"
echo "  - Desinstalar: adb uninstall $PACKAGE_NAME"
echo "  - Reiniciar app: adb shell am force-stop $PACKAGE_NAME && adb shell monkey -p $PACKAGE_NAME -c android.intent.category.LAUNCHER 1"
echo ""
