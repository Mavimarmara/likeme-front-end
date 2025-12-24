// Carrega variáveis de ambiente do .env antes de processar o código
// Isso garante que process.env.EXPO_PUBLIC_* esteja disponível durante o build do Metro
require('dotenv').config();

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable SVG transformer so `import Logo from './logo.svg'` works
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@/assets': path.resolve(__dirname, 'assets'),
    '@/components': path.resolve(__dirname, 'src/components'),
    '@/screens': path.resolve(__dirname, 'src/screens'),
    '@/navigation': path.resolve(__dirname, 'src/navigation'),
    '@/services': path.resolve(__dirname, 'src/services'),
    '@/constants': path.resolve(__dirname, 'src/constants'),
    '@/types': path.resolve(__dirname, 'types'),
  },
};

// Configuração específica para resolver assets com aliases
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
