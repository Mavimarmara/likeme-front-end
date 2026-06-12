const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(
  __dirname,
  '..',
  'node_modules',
  'expo-modules-core',
  'src',
  'sweet',
  'setUpJsLogger.fx.ts',
);

if (!fs.existsSync(targetPath)) {
  process.exit(0);
}

const source = fs.readFileSync(targetPath, 'utf8');
const needle = "if (__DEV__ && (Platform.OS === 'android' || Platform.OS === 'ios') && NativeJSLogger) {";
const patched =
  "if (__DEV__ && (Platform.OS === 'android' || Platform.OS === 'ios') && typeof NativeJSLogger?.addListener === 'function') {";

if (source.includes(patched)) {
  process.exit(0);
}

if (!source.includes(needle)) {
  console.warn('[patch-expo-js-logger] Padrão não encontrado em setUpJsLogger.fx.ts — patch ignorado.');
  process.exit(0);
}

fs.writeFileSync(targetPath, source.replace(needle, patched));
console.log('[patch-expo-js-logger] Guard de NativeJSLogger.addListener aplicado.');
