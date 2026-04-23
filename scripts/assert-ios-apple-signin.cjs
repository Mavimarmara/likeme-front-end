const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const entitlementsPath = path.join(projectRoot, 'ios', 'LikeMe', 'LikeMe.entitlements');

function readIntrospectedConfig() {
  const expoCli = require.resolve('expo/bin/cli', { paths: [projectRoot] });
  const stdout = execFileSync(
    process.execPath,
    [expoCli, 'config', '--type', 'introspect', '--json'],
    {
      cwd: projectRoot,
      encoding: 'utf8',
      env: { ...process.env, CI: '1', FORCE_COLOR: '0' },
    },
  );
  return JSON.parse(stdout);
}

function assertAppleSignInInEntitlementsPlistIfPresent() {
  if (!fs.existsSync(entitlementsPath)) {
    return;
  }
  const raw = fs.readFileSync(entitlementsPath, 'utf8');
  if (!raw.includes('com.apple.developer.applesignin')) {
    console.error(
      '[assert-ios-apple-signin] LikeMe.entitlements não declara com.apple.developer.applesignin.',
    );
    process.exit(1);
  }
  console.log(
    '[assert-ios-apple-signin] OK (local): plist em',
    path.relative(projectRoot, entitlementsPath),
  );
}

function assertAppleSignInInExpoConfig(config) {
  const value = config?.ios?.entitlements?.['com.apple.developer.applesignin'];
  const ok =
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((entry) => typeof entry === 'string' && entry.length > 0);
  if (!ok) {
    console.error(
      '[assert-ios-apple-signin] expo config (introspect) não expõe ios.entitlements.com.apple.developer.applesignin.',
      'O EAS usa isso para sincronizar capabilities com a Apple — corrija app.config.js antes do build.',
    );
    process.exit(1);
  }
}

function warnIfCapabilitySyncDisabled() {
  if (process.env.EXPO_NO_CAPABILITY_SYNC === '1') {
    console.warn(
      '[assert-ios-apple-signin] AVISO: EXPO_NO_CAPABILITY_SYNC=1 — sync de capabilities desligado por completo no EAS; perfis/App ID podem ficar desalinhados dos entitlements.',
    );
  }
}

assertAppleSignInInEntitlementsPlistIfPresent();

let config;
try {
  config = readIntrospectedConfig();
} catch (err) {
  console.error('[assert-ios-apple-signin] Falha ao rodar expo config:', err?.message || err);
  process.exit(1);
}

assertAppleSignInInExpoConfig(config);
warnIfCapabilitySyncDisabled();

console.log(
  '[assert-ios-apple-signin] OK: Sign in with Apple presente na config introspectada (o que o EAS usa para capability sync).',
);
