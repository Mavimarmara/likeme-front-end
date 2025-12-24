// Carrega variáveis de ambiente do .env antes de processar o código
// Isso garante que process.env.EXPO_PUBLIC_* esteja disponível durante o build do Metro
require('dotenv').config();

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/assets': './assets',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/navigation': './src/navigation',
            '@/services': './src/services',
            '@/constants': './src/constants',
            '@/types': './types',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.svg'],
        },
      ],
    ],
  };
};
