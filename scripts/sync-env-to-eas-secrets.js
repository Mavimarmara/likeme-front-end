#!/usr/bin/env node
/**
 * Sincroniza variáveis EXPO_PUBLIC_* do arquivo .env com EAS Secrets.
 * Use antes de "eas build" na nuvem (opções 7 e 8) para que o build use os mesmos valores do .env.
 *
 * Uso: node scripts/sync-env-to-eas-secrets.js
 * Ou: npm run sync:eas-secrets (se configurado no package.json)
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const envPath = path.resolve(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  console.warn('[sync-eas-secrets] ⚠️ Arquivo .env não encontrado. Nada a sincronizar.');
  process.exit(0);
}

// Carrega .env manualmente para não depender de dotenv no path do script
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eq = trimmed.indexOf('=');
  if (eq === -1) return;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
});

const expoPublicKeys = Object.keys(env).filter((k) => k.startsWith('EXPO_PUBLIC_'));

if (expoPublicKeys.length === 0) {
  console.warn('[sync-eas-secrets] ⚠️ Nenhuma variável EXPO_PUBLIC_* encontrada no .env');
  process.exit(0);
}

console.log(`[sync-eas-secrets] 📤 Sincronizando ${expoPublicKeys.length} variáveis do .env com EAS Secrets...`);

let synced = 0;
let failed = 0;

for (const key of expoPublicKeys) {
  const value = env[key];
  if (value === undefined || value === '') continue;
  try {
    const result = spawnSync(
      'eas',
      ['secret:create', '--name', key, '--value', value, '--scope', 'project', '--force', '--non-interactive'],
      { stdio: 'pipe', encoding: 'utf8', shell: false }
    );
    if (result.status !== 0) {
      const errMsg = result.stderr || result.stdout || 'erro desconhecido';
      throw new Error(errMsg.trim());
    }
    console.log(`[sync-eas-secrets] ✓ ${key}`);
    synced++;
  } catch (err) {
    console.warn(`[sync-eas-secrets] ⚠️ Falha ao criar secret ${key}:`, err.message || err);
    failed++;
  }
}

console.log(`[sync-eas-secrets] ✅ Sincronizadas: ${synced}. Falhas: ${failed}.`);
if (failed > 0) {
  console.warn('[sync-eas-secrets] Certifique-se de estar logado no EAS: eas login');
}

process.exit(failed > 0 ? 1 : 0);
