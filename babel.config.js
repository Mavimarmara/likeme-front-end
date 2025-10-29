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
