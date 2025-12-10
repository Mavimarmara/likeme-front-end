#!/bin/bash

# Script simplificado para instalar e executar o APK

export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator

APK_PATH="/Users/weber/Projetos/likeme/likeme-front-end/android/build-1765210721613.apk"
PACKAGE_NAME="com.likeme.app"

echo "═══════════════════════════════════════════════════════════"
echo "  Instalando APK no Emulador Android"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Verifica se há dispositivo conectado
echo "Verificando dispositivos..."
adb devices

if ! adb devices | grep -q "device$"; then
    echo ""
    echo "⚠ Nenhum emulador/dispositivo conectado!"
    echo ""
    echo "Para iniciar um emulador, execute:"
    echo "  $ANDROID_HOME/emulator/emulator -avd Pixel_6_API34"
    echo ""
    echo "Ou use o Android Studio para iniciar um emulador."
    echo ""
    echo "Depois que o emulador estiver rodando, execute este script novamente."
    exit 1
fi

echo ""
echo "✓ Dispositivo encontrado!"
echo ""

# Instala o APK
echo "📦 Instalando APK..."
if adb install -r "$APK_PATH"; then
    echo "✓ APK instalado com sucesso!"
else
    echo "❌ Erro ao instalar APK"
    exit 1
fi

echo ""
echo "🚀 Iniciando aplicativo..."

# Tenta iniciar o app
adb shell monkey -p "$PACKAGE_NAME" -c android.intent.category.LAUNCHER 1 > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Aplicativo iniciado!"
else
    echo "⚠ Aplicativo instalado. Abra manualmente no emulador se necessário."
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✓ Concluído!"
echo "═══════════════════════════════════════════════════════════"
echo ""
