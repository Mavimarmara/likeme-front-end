/**
 * Adiciona ao stage os arquivos gerados por sync-app-version.cjs (lint-staged).
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const OUTPUT_PATHS = [
  'CHANGELOG.md',
  'src/constants/appVersion.generated.ts',
  'package.json',
  'package-lock.json',
  'android/app/build.gradle',
  'ios/LikeMe/Info.plist',
  'ios/LikeMe.xcodeproj/project.pbxproj',
];

const existingPaths = OUTPUT_PATHS.filter((relativePath) =>
  fs.existsSync(path.join(projectRoot, relativePath)),
);

if (existingPaths.length === 0) {
  process.exit(0);
}

execFileSync('git', ['add', '--', ...existingPaths], {
  cwd: projectRoot,
  stdio: 'inherit',
});
