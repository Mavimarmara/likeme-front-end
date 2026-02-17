module.exports = {
  root: true,
  extends: ['@react-native/eslint-config'],
  rules: {
    'prettier/prettier': 'off',
    'comma-dangle': ['warn', 'always-multiline'],
    curly: ['warn', 'multi-line'],
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    '*.config.js',
    'babel.config.js',
    'metro.config.js',
    'jest.setup.js',
    'app.config.js',
    'app.plugin.js',
    '.eslintrc.js',
    '.expo/',
    'dist/',
    'build/',
    'plugins/',
    'index.js',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'react-native/no-inline-styles': 'warn',
      },
    },
  ],
};
