// app.config.js - Carrega variáveis do .env dinamicamente
const path = require('path');
const fs = require('fs');

// Função para encontrar o arquivo .env no diretório original do projeto
function findOriginalEnvFile() {
  // Prioridade 1: Variável de ambiente com caminho absoluto (definida pelo script de build)
  if (process.env.ENV_FILE_PATH && fs.existsSync(process.env.ENV_FILE_PATH)) {
    return process.env.ENV_FILE_PATH;
  }

  const possiblePaths = [
    path.resolve(__dirname, '.env'), // Diretório do app.config.js
    path.join(__dirname, '..', '.env'), // Um nível acima
    '/Users/weber/Projetos/likeme/likeme-front-end/.env', // Caminho absoluto do projeto
    path.join(process.cwd(), '..', '.env'), // Um nível acima do cwd
  ];

  // Tenta encontrar o arquivo .env
  for (const envPath of possiblePaths) {
    const resolvedPath = path.resolve(envPath);
    if (fs.existsSync(resolvedPath)) {
      return resolvedPath;
    }
  }

  return null;
}

// Função para copiar o .env para o diretório atual (onde o build está executando)
function ensureEnvFileInCurrentDir() {
  const currentDirEnv = path.resolve(process.cwd(), '.env');

  // Se já existe no diretório atual, usa ele
  if (fs.existsSync(currentDirEnv)) {
    return currentDirEnv;
  }

  // Tenta encontrar o .env original e copia para o diretório atual
  const originalEnvPath = findOriginalEnvFile();
  if (originalEnvPath && originalEnvPath !== currentDirEnv) {
    try {
      fs.copyFileSync(originalEnvPath, currentDirEnv);
      console.log(
        '[app.config.js] ✓ Arquivo .env copiado do diretório original para:',
        currentDirEnv
      );
      return currentDirEnv;
    } catch (error) {
      console.warn('[app.config.js] ⚠️ Erro ao copiar .env:', error.message);
      // Retorna o caminho original como fallback
      return originalEnvPath;
    }
  }

  return originalEnvPath;
}

// IMPORTANTE: Durante builds do EAS local, o processo pode não herdar todas as variáveis
// do shell. Por isso, sempre copiamos o .env para o diretório atual e carregamos dele.
// As variáveis em process.env têm prioridade, mas carregamos o .env para garantir que
// todas as variáveis estejam disponíveis.
const hasEnvVarsInProcess = Object.keys(process.env).some((key) => key.startsWith('EXPO_PUBLIC_'));

// Garante que o .env esteja no diretório atual (copia se necessário)
const envPath = ensureEnvFileInCurrentDir();
let envLoaded = false;

if (envPath) {
  // Carrega o .env explicitamente
  const result = require('dotenv').config({ path: envPath });
  if (result.error) {
    console.warn('[app.config.js] ⚠️ Erro ao carregar .env:', result.error.message);
  } else {
    console.log('[app.config.js] ✓ Arquivo .env encontrado em:', envPath);
    // Log das variáveis carregadas (apenas nomes, não valores por segurança)
    const loadedVars = Object.keys(result.parsed || {});
    if (loadedVars.length > 0) {
      console.log(
        `[app.config.js] ✓ ${loadedVars.length} variáveis carregadas do .env:`,
        loadedVars.join(', ')
      );
      envLoaded = true;

      // Verifica se há variáveis EXPO_PUBLIC_ no arquivo
      const expoPublicVars = loadedVars.filter((key) => key.startsWith('EXPO_PUBLIC_'));
      if (expoPublicVars.length > 0) {
        console.log(
          `[app.config.js] ✓ ${expoPublicVars.length} variáveis EXPO_PUBLIC_ encontradas no .env`
        );
      } else {
        console.warn(
          '[app.config.js] ⚠️ O .env foi carregado mas não contém variáveis EXPO_PUBLIC_'
        );
        console.warn(
          '[app.config.js] ⚠️ Certifique-se de que as variáveis no .env começam com EXPO_PUBLIC_'
        );
      }
    } else {
      console.warn(
        '[app.config.js] ⚠️ Arquivo .env encontrado mas está vazio ou não contém variáveis válidas'
      );
      console.warn(
        '[app.config.js] ⚠️ Verifique se o arquivo .env tem o formato correto (KEY=value)'
      );
    }
  }
} else {
  // Fallback: tenta carregar do diretório atual (dotenv procura automaticamente)
  const result = require('dotenv').config();
  if (result.error) {
    console.warn('[app.config.js] ⚠️ Arquivo .env não encontrado em nenhum dos caminhos testados');
    if (process.env.DEBUG_ENV === 'true') {
      console.warn(
        '[app.config.js] Caminhos testados:',
        path.resolve(__dirname, '.env'),
        path.resolve(process.cwd(), '.env'),
        process.env.ENV_FILE_PATH || 'não definido',
        '.env'
      );
    }
  } else {
    const loadedVars = Object.keys(result.parsed || {});
    if (loadedVars.length > 0) {
      console.log('[app.config.js] ✓ Arquivo .env carregado do diretório atual');
      console.log(
        `[app.config.js] ✓ ${loadedVars.length} variáveis carregadas:`,
        loadedVars.join(', ')
      );
      envLoaded = true;
    } else {
      console.warn('[app.config.js] ⚠️ dotenv não encontrou variáveis no .env');
    }
  }
}

// Log sobre variáveis em process.env (podem vir do script ou do .env carregado)
if (hasEnvVarsInProcess) {
  const processVars = Object.keys(process.env).filter((key) => key.startsWith('EXPO_PUBLIC_'));
  console.log(
    `[app.config.js] ✓ ${processVars.length} variáveis EXPO_PUBLIC_ disponíveis em process.env`
  );
}

// Verifica se as variáveis EXPO_PUBLIC_ estão disponíveis
// Elas podem vir do .env carregado acima ou do ambiente (exportadas pelo script de build)
const foundVars = Object.keys(process.env).filter((key) => key.startsWith('EXPO_PUBLIC_'));
const hasEnvVars = foundVars.length > 0;

if (hasEnvVars) {
  console.log(
    `[app.config.js] ✓ ${foundVars.length} variáveis EXPO_PUBLIC_ disponíveis em process.env`
  );
  if (process.env.DEBUG_ENV === 'true') {
    console.log(`[app.config.js] Variáveis: ${foundVars.join(', ')}`);
  }
} else {
  console.warn('[app.config.js] ⚠️ Nenhuma variável EXPO_PUBLIC_ encontrada em process.env');
  if (!envLoaded) {
    console.warn('[app.config.js] ⚠️ O arquivo .env não foi encontrado ou carregado');
    console.warn('[app.config.js] ⚠️ Verifique se o arquivo .env existe na raiz do projeto');
  } else {
    console.warn(
      '[app.config.js] ⚠️ O .env foi carregado mas não contém variáveis EXPO_PUBLIC_ válidas'
    );
  }
}

// Função auxiliar para obter variável de ambiente com fallback
const getEnvVar = (key, defaultValue = '') => {
  // Tenta process.env primeiro (pode vir do ambiente exportado pelo script de build ou do dotenv)
  const value = process.env[key];
  if (value) {
    // Só loga em modo verbose (não durante build para evitar poluição)
    if (process.env.DEBUG_ENV === 'true') {
      console.log(`[app.config.js] ✓ ${key}: encontrado`);
    }
    return value;
  }

  // Log apenas para variáveis críticas sem default ou com default placeholder
  if (!defaultValue || defaultValue.includes('your-') || defaultValue === '') {
    if (process.env.DEBUG_ENV === 'true') {
      console.warn(`[app.config.js] ⚠️ ${key} não encontrado em process.env, usando default`);
    }
  }

  return defaultValue;
};

module.exports = {
  expo: {
    name: 'LikeMe',
    slug: 'likeme-front-end',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    platforms: ['ios', 'android', 'web'],
    jsEngine: 'hermes',
    sdkVersion: '54.0.0',
    plugins: [
      'expo-font',
      [
        'react-native-auth0',
        {
          domain: getEnvVar('EXPO_PUBLIC_AUTH0_DOMAIN', 'likeme.us.auth0.com'),
        },
      ],
      '@react-native-firebase/app',
    ],
    scheme: 'likeme',
    android: {
      package: 'com.likeme.app',
      googleServicesFile: './google-services.json',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/Logo2.png',
        backgroundColor: '#FFFFFF',
      },
      permissions: [],
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'likeme',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    ios: {
      bundleIdentifier: 'com.likeme.app',
      googleServicesFile: './GoogleService-Info.plist',
      buildNumber: '1',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    owner: 'pixelpulselab',
    extra: {
      eas: {
        projectId: '53bbcaf5-ed26-4155-a37b-a0c938635855',
      },
      // Injeta variáveis de ambiente do .env no extra.env
      // Estas serão disponibilizadas via Constants.expoConfig.extra.env
      env: {
        EXPO_PUBLIC_AUTH0_DOMAIN: getEnvVar('EXPO_PUBLIC_AUTH0_DOMAIN', 'likeme.us.auth0.com'),
        EXPO_PUBLIC_AUTH0_CLIENT_ID: getEnvVar('EXPO_PUBLIC_AUTH0_CLIENT_ID', ''),
        EXPO_PUBLIC_AUTH0_AUDIENCE: getEnvVar('EXPO_PUBLIC_AUTH0_AUDIENCE', ''),
        EXPO_PUBLIC_BACKEND_URL: getEnvVar(
          'EXPO_PUBLIC_BACKEND_URL',
          'https://likeme-back-end-one.vercel.app'
        ),
        EXPO_PUBLIC_USE_AUTH_PROXY: getEnvVar('EXPO_PUBLIC_USE_AUTH_PROXY', 'false'),
        EXPO_PUBLIC_AUTH_SCHEME: getEnvVar('EXPO_PUBLIC_AUTH_SCHEME', 'likeme'),
        EXPO_PUBLIC_AUTH_REDIRECT_PATH: getEnvVar('EXPO_PUBLIC_AUTH_REDIRECT_PATH', 'auth'),
      },
    },
  },
};
