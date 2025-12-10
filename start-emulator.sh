#!/bin/bash

# Script para iniciar um emulador Android

export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools

echo "═══════════════════════════════════════════════════════════"
echo "  Iniciando Emulador Android"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Lista emuladores disponíveis
echo "Emuladores disponíveis:"
$ANDROID_HOME/emulator/emulator -list-avds
echo ""

# Se um nome foi passado como argumento, usa ele, senão usa o primeiro disponível
if [ -n "$1" ]; then
    AVD_NAME="$1"
else
    AVD_NAME=$(($ANDROID_HOME/emulator/emulator -list-avds) | head -1)
    echo "Usando emulador: $AVD_NAME"
fi

if [ -z "$AVD_NAME" ]; then
    echo "❌ Nenhum emulador encontrado!"
    exit 1
fi

echo "🚀 Iniciando emulador: $AVD_NAME"
echo "   (Isso pode levar alguns minutos na primeira vez)"
echo ""

# Inicia o emulador em background
$ANDROID_HOME/emulator/emulator -avd "$AVD_NAME" > /dev/null 2>&1 &

EMULATOR_PID=$!
echo "✓ Emulador iniciado (PID: $EMULATOR_PID)"
echo ""
echo "Aguardando o emulador ficar pronto..."

# Aguarda o emulador ficar pronto
timeout=120
counter=0
while [ $counter -lt $timeout ]; do
    if adb devices | grep -q "emulator.*device"; then
        echo "✓ Emulador está pronto!"
        adb devices
        break
    fi
    sleep 2
    counter=$((counter + 2))
    echo -n "."
done

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Emulador iniciado com sucesso!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Para parar o emulador, use:"
echo "  adb emu kill"
echo "ou feche a janela do emulador"
echo ""

