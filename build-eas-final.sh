#!/bin/bash

set -e

echo "═══════════════════════════════════════════════════════════"
echo "  EAS Build Local - Build Android (Versão Final)"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Corrige permissões do cache npm se necessário
echo "=== Corrigindo permissões do cache npm ==="
if [ -d "$HOME/.npm" ]; then
    echo "⚠ Corrigindo permissões do diretório .npm..."
    sudo chown -R $(whoami):$(id -gn) ~/.npm 2>/dev/null || true
    chmod -R u+w ~/.npm 2>/dev/null || true
fi

# Remove arquivos temporários problemáticos do cache
if [ -d "$HOME/.npm/_cacache/tmp" ]; then
    echo "⚠ Removendo arquivos temporários problemáticos..."
    rm -rf ~/.npm/_cacache/tmp/* 2>/dev/null || true
fi

# Limpa arquivos duplicados que podem causar conflito EEXIST
if [ -d "$HOME/.npm/_cacache/content-v2" ]; then
    echo "⚠ Verificando arquivos duplicados no cache..."
    find ~/.npm/_cacache/content-v2 -name "*.tmp" -delete 2>/dev/null || true
fi

echo "✓ Permissões e cache corrigidos"
echo ""

# Verifica e limpa espaço em disco
echo "=== Verificando espaço em disco ==="
AVAILABLE_SPACE=$(df -h / | tail -1 | awk '{print $4}')
CAPACITY=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')

echo "Espaço disponível: ${AVAILABLE_SPACE} (${CAPACITY}% usado)"

# Limpa sempre que uso for maior que 80% ou se espaço disponível for menor que 5GB
NEEDS_CLEANUP=false
if [ -n "$CAPACITY" ] && [ "$CAPACITY" -gt 80 ]; then
    NEEDS_CLEANUP=true
elif echo "$AVAILABLE_SPACE" | grep -qE "^[0-4]"; then
    # Se começar com 0-4 (menos de 5GB)
    NEEDS_CLEANUP=true
fi

if [ "$NEEDS_CLEANUP" = true ]; then
    echo "⚠ Pouco espaço disponível! Limpando caches..."
    
    # Limpa cache Gradle (libera ~3-4GB)
    if [ -d "$HOME/.gradle/caches" ]; then
        GRADLE_CACHE_SIZE=$(du -sh "$HOME/.gradle/caches" 2>/dev/null | awk '{print $1}' || echo "0")
        echo "⚠ Limpando cache Gradle (~${GRADLE_CACHE_SIZE})..."
        rm -rf ~/.gradle/caches/* 2>/dev/null || true
        echo "✓ Cache Gradle limpo"
    fi
    
    # Limpa builds temporários antigos do EAS
    echo "⚠ Limpando builds temporários antigos..."
    find /private/var/folders -type d -name "eas-build-local-nodejs" -mtime +1 -exec rm -rf {} + 2>/dev/null || true
    find /tmp -type d -name "eas-build-*" -mtime +1 -exec rm -rf {} + 2>/dev/null || true
    echo "✓ Builds temporários antigos removidos"
    
    # Limpa locks do Gradle que podem estar bloqueando
    echo "⚠ Removendo locks do Gradle..."
    find ~/.gradle -name "*.lock" -delete 2>/dev/null || true
    find ~/.gradle -type d -name "buildOutputCleanup" -exec rm -rf {} + 2>/dev/null || true
    echo "✓ Locks do Gradle removidos"
    
    # Limpa cache do Metro/React Native
    if [ -d "$(dirname "$0")/node_modules/.cache" ]; then
        echo "⚠ Limpando cache do Metro..."
        rm -rf "$(dirname "$0")/node_modules/.cache" 2>/dev/null || true
        echo "✓ Cache do Metro limpo"
    fi
    
    # Limpa builds anteriores do Android no projeto
    if [ -d "$(dirname "$0")/android/app/build" ]; then
        echo "⚠ Limpando builds anteriores do Android..."
        rm -rf "$(dirname "$0")/android/app/build" 2>/dev/null || true
        rm -rf "$(dirname "$0")/android/.gradle" 2>/dev/null || true
        rm -rf "$(dirname "$0")/android/build" 2>/dev/null || true
        echo "✓ Builds anteriores do Android removidos"
    fi
    
    # Limpa DerivedData do Xcode (libera ~4GB)
    if [ -d "$HOME/Library/Developer/Xcode/DerivedData" ]; then
        XCODE_DERIVED_SIZE=$(du -sh "$HOME/Library/Developer/Xcode/DerivedData" 2>/dev/null | awk '{print $1}' || echo "0")
        if [ "$XCODE_DERIVED_SIZE" != "0B" ] && [ -n "$XCODE_DERIVED_SIZE" ]; then
            echo "⚠ Limpando DerivedData do Xcode (~${XCODE_DERIVED_SIZE})..."
            rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || true
            echo "✓ DerivedData do Xcode limpo"
        fi
    fi
    
    # Limpa Archives antigos do Xcode (mais de 30 dias)
    if [ -d "$HOME/Library/Developer/Xcode/Archives" ]; then
        echo "⚠ Limpando Archives antigos do Xcode..."
        find ~/Library/Developer/Xcode/Archives -mtime +30 -type d -exec rm -rf {} + 2>/dev/null || true
        echo "✓ Archives antigos do Xcode removidos"
    fi
    
    # Verifica espaço novamente
    NEW_AVAILABLE=$(df -h / | tail -1 | awk '{print $4}')
    echo "✓ Limpeza concluída. Espaço disponível agora: ${NEW_AVAILABLE}"
else
    echo "✓ Espaço suficiente disponível"
fi
echo ""

# Força o uso do Java 17
JAVA_17_HOME=""
if [ -d "/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home" ]; then
    JAVA_17_HOME="/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home"
elif command -v /usr/libexec/java_home &> /dev/null; then
    JAVA_17_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)
fi

if [ -n "$JAVA_17_HOME" ] && [ -d "$JAVA_17_HOME" ]; then
    export JAVA_HOME="$JAVA_17_HOME"
    export PATH=$JAVA_HOME/bin:$PATH
    echo "✓ Usando Java 17: $JAVA_HOME"
    java -version 2>&1 | head -1
else
    echo "⚠ Java 17 não encontrado!"
    exit 1
fi

echo ""

# Configura Android SDK
cd "$(dirname "$0")"

ANDROID_SDK_PATH=""
if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
    ANDROID_SDK_PATH="$ANDROID_HOME"
    echo "✓ Android SDK encontrado via ANDROID_HOME: $ANDROID_SDK_PATH"
elif [ -d "$HOME/Library/Android/sdk" ]; then
    ANDROID_SDK_PATH="$HOME/Library/Android/sdk"
    echo "✓ Android SDK encontrado em: $ANDROID_SDK_PATH"
elif [ -d "$HOME/Android/Sdk" ]; then
    ANDROID_SDK_PATH="$HOME/Android/Sdk"
    echo "✓ Android SDK encontrado em: $ANDROID_SDK_PATH"
fi

if [ -n "$ANDROID_SDK_PATH" ] && [ -d "$ANDROID_SDK_PATH" ]; then
    export ANDROID_HOME="$ANDROID_SDK_PATH"
    export ANDROID_SDK_ROOT="$ANDROID_SDK_PATH"
    export PATH=$PATH:$ANDROID_SDK_PATH/platform-tools
    echo "✓ Android SDK configurado: $ANDROID_SDK_PATH"
    
    # Cria/atualiza local.properties
    echo "sdk.dir=$ANDROID_SDK_PATH" > android/local.properties
    echo "✓ Arquivo local.properties criado/atualizado"
else
    echo "✗ Android SDK não encontrado!"
    exit 1
fi

echo ""

# Limpa cache npm problemático de forma mais agressiva
echo "=== Limpando cache npm problemático ==="
# Remove o cache completamente se houver problemas
if [ -d "$HOME/.npm/_cacache" ]; then
    echo "⚠ Removendo cache npm corrompido..."
    rm -rf ~/.npm/_cacache 2>/dev/null || true
    echo "✓ Cache antigo removido"
fi

# Limpa cache via npm
echo "⚠ Limpando cache via npm..."
npm cache clean --force 2>&1 | grep -v "^$" || true
echo "✓ Cache limpo completamente"
echo ""

# Verifica dispositivo
DEVICE=$(adb devices | grep -w "device" | head -1 | awk '{print $1}')
if [ -n "$DEVICE" ]; then
    echo "✓ Dispositivo conectado: $DEVICE"
    MODEL=$(adb -s $DEVICE shell getprop ro.product.model 2>/dev/null || echo "N/A")
    echo "  Modelo: $MODEL"
fi

echo ""
echo "=== Limpando build do EAS ==="
# Limpa build anterior do EAS se existir
if [ -d "$(dirname "$0")/android" ]; then
    echo "⚠ Limpando cache do Gradle e builds..."
    cd "$(dirname "$0")/android"
    ./gradlew clean 2>/dev/null || true
    cd "$(dirname "$0")"
    echo "✓ Cache limpo"
fi
echo ""

echo "=== Carregando variáveis de ambiente do .env ==="
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

# Função para carregar e exportar variáveis do .env
load_env_file() {
    local file_path="$1"
    if [ ! -f "$file_path" ]; then
        return 1
    fi
    
    echo "✓ Arquivo .env encontrado em: $file_path"
    echo "  Carregando e exportando variáveis EXPO_PUBLIC_..."
    
    # Carrega e exporta variáveis do .env
    # set -a exporta automaticamente todas as variáveis definidas
    set -a
    # Usa source com verificação de erros
    if source "$file_path" 2>/dev/null; then
        set +a
        echo "  ✓ Variáveis carregadas com sucesso"
        
        # Lista as variáveis EXPO_PUBLIC_ exportadas (apenas nomes por segurança)
        echo "  Variáveis EXPO_PUBLIC_ encontradas:"
        env | grep "^EXPO_PUBLIC" | cut -d'=' -f1 | sed 's/^/    - /' || echo "    (nenhuma variável EXPO_PUBLIC encontrada)"
        
        # Verifica se as variáveis críticas estão presentes
        MISSING_VARS=()
        [ -z "$EXPO_PUBLIC_AUTH0_DOMAIN" ] && MISSING_VARS+=("EXPO_PUBLIC_AUTH0_DOMAIN")
        [ -z "$EXPO_PUBLIC_AUTH0_CLIENT_ID" ] && MISSING_VARS+=("EXPO_PUBLIC_AUTH0_CLIENT_ID")
        [ -z "$EXPO_PUBLIC_BACKEND_URL" ] && MISSING_VARS+=("EXPO_PUBLIC_BACKEND_URL")
        
        if [ ${#MISSING_VARS[@]} -gt 0 ]; then
            echo "  ⚠️ Variáveis críticas ausentes: ${MISSING_VARS[*]}"
        else
            echo "  ✓ Todas as variáveis críticas estão presentes"
        fi
        
        return 0
    else
        set +a
        echo "  ✗ Erro ao carregar arquivo .env"
        return 1
    fi
}

# Tenta carregar do caminho absoluto primeiro
if load_env_file "$ENV_FILE"; then
    echo "  ✓ Variáveis exportadas e disponíveis para o processo de build"
else
    # Fallback: tenta caminho relativo
    echo "  Tentando caminho relativo..."
    if load_env_file ".env"; then
        echo "  ✓ Variáveis exportadas (caminho relativo)"
    else
        echo "  ✗ Arquivo .env não encontrado!"
        echo "  ⚠️ As variáveis de ambiente podem não estar disponíveis no APK"
        echo "  ⚠️ Verifique se o arquivo .env existe na raiz do projeto"
    fi
fi

# Garante que as variáveis estejam disponíveis para o processo filho (EAS build)
# Exporta explicitamente as variáveis EXPO_PUBLIC_ para o ambiente
if [ -f "$ENV_FILE" ]; then
    echo "  Exportando variáveis EXPO_PUBLIC_ do .env para o ambiente..."
    EXPORTED_COUNT=0
    
    # Lê o arquivo .env linha por linha e exporta as variáveis
    while IFS= read -r line || [ -n "$line" ]; do
        # Remove espaços em branco no início e fim
        line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        
        # Ignora linhas vazias e comentários
        if [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# ]]; then
            # Verifica se é uma variável EXPO_PUBLIC_
            if [[ "$line" =~ ^EXPO_PUBLIC_ ]]; then
                # Extrai o nome da variável e o valor
                VAR_NAME=$(echo "$line" | cut -d'=' -f1 | xargs)
                VAR_VALUE=$(echo "$line" | cut -d'=' -f2- | sed 's/^["'\'']//;s/["'\'']$//')
                
                # Exporta a variável
                export "${VAR_NAME}=${VAR_VALUE}" 2>/dev/null
                if [ $? -eq 0 ]; then
                    EXPORTED_COUNT=$((EXPORTED_COUNT + 1))
                    if [ "$EXPORTED_COUNT" -le 3 ]; then
                        echo "    ✓ ${VAR_NAME} exportada"
                    fi
                fi
            fi
        fi
    done < "$ENV_FILE"
    
    if [ "$EXPORTED_COUNT" -gt 3 ]; then
        echo "    ... e mais $((EXPORTED_COUNT - 3)) variáveis"
    fi
    echo "  ✓ Total de ${EXPORTED_COUNT} variáveis EXPO_PUBLIC_ exportadas para o ambiente"
    
    # Verifica se as variáveis foram realmente exportadas
    EXPORTED_VARS=$(env | grep "^EXPO_PUBLIC" | wc -l | xargs)
    echo "  ✓ Verificação: ${EXPORTED_VARS} variáveis EXPO_PUBLIC_ disponíveis no ambiente"
fi

# Define variável de ambiente com o caminho absoluto do .env
# Isso permite que o app.config.js encontre o .env mesmo em diretórios temporários
if [ -f "$ENV_FILE" ]; then
    export ENV_FILE_PATH="$ENV_FILE"
    echo "  ✓ Caminho absoluto do .env definido: $ENV_FILE_PATH"
    
    # Também copia o .env para o diretório atual como fallback
    if [ ! -f ".env" ]; then
        echo "  ⚠️ Copiando .env para o diretório atual (fallback)..."
        cp "$ENV_FILE" ".env" 2>/dev/null || true
        echo "  ✓ .env copiado para o diretório atual"
    fi
fi

echo ""

echo "=== Iniciando EAS Build Local ==="
echo ""
echo "Isso pode levar 10-20 minutos..."
echo ""
echo "✓ Variáveis de ambiente carregadas do .env"
echo "✓ Variáveis EXPO_PUBLIC_ exportadas para o ambiente do processo"
echo "✓ Caminho absoluto do .env definido (ENV_FILE_PATH)"
echo "✓ O app.config.js carregará o .env usando o caminho absoluto"
echo "✓ As variáveis serão injetadas no APK via extra.env no app.config.js"
echo ""

# Lista as variáveis que serão usadas (apenas nomes, não valores)
echo "Variáveis EXPO_PUBLIC_ que serão incluídas no build:"
EXPO_VARS=$(env | grep "^EXPO_PUBLIC" | cut -d'=' -f1)
if [ -n "$EXPO_VARS" ]; then
    echo "$EXPO_VARS" | sed 's/^/  - /'
    VAR_COUNT=$(echo "$EXPO_VARS" | wc -l | xargs)
    echo "  Total: ${VAR_COUNT} variáveis"
else
    echo "  ⚠️ (nenhuma encontrada - o app.config.js tentará carregar do .env)"
fi
echo ""

# Executa EAS Build Local
# As variáveis EXPO_PUBLIC_ foram exportadas acima e estarão disponíveis no process.env
# O app.config.js prioriza variáveis de process.env sobre o arquivo .env
# O app.config.js injeta as variáveis em extra.env, que estarão disponíveis via Constants.expoConfig.extra.env
# O EAS build herda as variáveis de ambiente do processo pai (shell script)
eas build --platform android --profile staging --local --clear-cache

echo ""
echo "=== Build concluído! ==="
echo ""
echo "Se o build foi bem-sucedido, o caminho do APK será mostrado acima."
echo ""
if [ -n "$DEVICE" ]; then
    echo "Para instalar no dispositivo conectado:"
    echo "  adb install <caminho-do-apk>"
fi
echo ""

