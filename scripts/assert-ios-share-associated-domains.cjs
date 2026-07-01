const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const entitlementsPath = path.join(projectRoot, 'ios', 'LikeMe', 'LikeMe.entitlements');
const ASSOCIATED_DOMAINS_KEY = 'com.apple.developer.associated-domains';

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

function assertAssociatedDomainsInEntitlementsPlistIfPresent(expectedDomains) {
  if (!fs.existsSync(entitlementsPath)) {
    return;
  }
  const raw = fs.readFileSync(entitlementsPath, 'utf8');
  if (!raw.includes(ASSOCIATED_DOMAINS_KEY)) {
    console.error(
      `[assert-ios-share-links] LikeMe.entitlements não declara ${ASSOCIATED_DOMAINS_KEY}.`,
    );
    process.exit(1);
  }
  for (const domain of expectedDomains) {
    if (!raw.includes(domain)) {
      console.error(
        `[assert-ios-share-links] LikeMe.entitlements não inclui domínio esperado: ${domain}`,
      );
      process.exit(1);
    }
  }
  console.log(
    '[assert-ios-share-links] OK (local): associated domains em',
    path.relative(projectRoot, entitlementsPath),
  );
}

function assertAssociatedDomainsInExpoConfig(config) {
  const value = config?.ios?.entitlements?.[ASSOCIATED_DOMAINS_KEY];
  const ok =
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((entry) => typeof entry === 'string' && entry.startsWith('applinks:'));
  if (!ok) {
    console.error(
      `[assert-ios-share-links] expo config não expõe ios.entitlements.${ASSOCIATED_DOMAINS_KEY} com applinks:`,
    );
    process.exit(1);
  }
  return value;
}

let config;
try {
  config = readIntrospectedConfig();
} catch (err) {
  console.error('[assert-ios-share-links] Falha ao rodar expo config:', err?.message || err);
  process.exit(1);
}

const expectedDomains = assertAssociatedDomainsInExpoConfig(config);
assertAssociatedDomainsInEntitlementsPlistIfPresent(expectedDomains);

console.log('[assert-ios-share-links] OK: Universal Links configurados na config introspectada.');
