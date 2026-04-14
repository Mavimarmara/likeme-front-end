const fs = require('fs');
const path = require('path');

const podspecPath = path.resolve(
  __dirname,
  '..',
  'node_modules',
  '@react-native-community',
  'slider',
  'react-native-slider.podspec',
);

if (!fs.existsSync(podspecPath)) {
  process.exit(0);
}

const marker = 'unless new_arch_enabled';
const targetLine = '  s.source_files = "ios/**/*.{h,m,mm}"';
const patchBlock = `${targetLine}
  unless new_arch_enabled
    s.exclude_files = [
      "ios/RNCSliderComponentView.h",
      "ios/RNCSliderComponentView.mm",
    ]
  end`;

const source = fs.readFileSync(podspecPath, 'utf8');

if (source.includes(marker)) {
  process.exit(0);
}

if (!source.includes(targetLine)) {
  process.exit(0);
}

const patched = source.replace(targetLine, patchBlock);
fs.writeFileSync(podspecPath, patched);
