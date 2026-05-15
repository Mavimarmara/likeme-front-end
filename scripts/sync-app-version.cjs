/**
 * Sincroniza app.version.json → package.json, nativos (Gradle/Info.plist/pbxproj).
 * Fonte única: edite apenas app.version.json e rode `npm run version:sync`.
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const versionFilePath = path.join(projectRoot, 'app.version.json');

function readAppVersion() {
  const raw = fs.readFileSync(versionFilePath, 'utf8');
  const data = JSON.parse(raw);

  const version = String(data.version ?? '').trim();
  const androidVersionCode = Number(data.android?.versionCode);
  const iosBuildNumber = Number(data.ios?.buildNumber);

  if (!version) {
    throw new Error('[sync-app-version] app.version.json: "version" é obrigatório.');
  }
  if (!Number.isInteger(androidVersionCode) || androidVersionCode < 1) {
    throw new Error('[sync-app-version] app.version.json: android.versionCode deve ser inteiro >= 1.');
  }
  if (!Number.isInteger(iosBuildNumber) || iosBuildNumber < 1) {
    throw new Error('[sync-app-version] app.version.json: ios.buildNumber deve ser inteiro >= 1.');
  }

  return {
    version,
    androidVersionCode,
    iosBuildNumber,
    iosBuildNumberText: String(iosBuildNumber),
  };
}

function syncPackageJson(appVersion) {
  const packagePath = path.join(projectRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  pkg.version = appVersion.version;
  fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

function syncPackageLock(appVersion) {
  const lockPath = path.join(projectRoot, 'package-lock.json');
  if (!fs.existsSync(lockPath)) {
    return;
  }

  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  lock.version = appVersion.version;
  if (lock.packages?.['']) {
    lock.packages[''].version = appVersion.version;
  }
  fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`, 'utf8');
}

function syncAndroidGradle(appVersion) {
  const gradlePath = path.join(projectRoot, 'android', 'app', 'build.gradle');
  let content = fs.readFileSync(gradlePath, 'utf8');

  content = content.replace(/versionCode\s+\d+/, `versionCode ${appVersion.androidVersionCode}`);
  content = content.replace(/versionName\s+"[^"]*"/, `versionName "${appVersion.version}"`);

  fs.writeFileSync(gradlePath, content, 'utf8');
}

function syncIosInfoPlist(appVersion) {
  const plistPath = path.join(projectRoot, 'ios', 'LikeMe', 'Info.plist');
  let content = fs.readFileSync(plistPath, 'utf8');

  content = content.replace(
    /(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]*(<\/string>)/,
    `$1${appVersion.version}$2`,
  );
  content = content.replace(
    /(<key>CFBundleVersion<\/key>\s*<string>)[^<]*(<\/string>)/,
    `$1${appVersion.iosBuildNumberText}$2`,
  );

  fs.writeFileSync(plistPath, content, 'utf8');
}

function syncIosPbxproj(appVersion) {
  const pbxPath = path.join(projectRoot, 'ios', 'LikeMe.xcodeproj', 'project.pbxproj');
  let content = fs.readFileSync(pbxPath, 'utf8');

  content = content.replace(/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${appVersion.version};`);
  content = content.replace(
    /CURRENT_PROJECT_VERSION = [^;]+;/g,
    `CURRENT_PROJECT_VERSION = ${appVersion.iosBuildNumberText};`,
  );

  fs.writeFileSync(pbxPath, content, 'utf8');
}

function main() {
  const appVersion = readAppVersion();

  syncPackageJson(appVersion);
  syncPackageLock(appVersion);
  syncAndroidGradle(appVersion);
  syncIosInfoPlist(appVersion);
  syncIosPbxproj(appVersion);

  console.log(
    `[sync-app-version] OK → ${appVersion.version} (Android ${appVersion.androidVersionCode}, iOS ${appVersion.iosBuildNumberText})`,
  );
  console.log('[sync-app-version] app.config.js lê app.version.json em tempo de execução.');
}

main();
