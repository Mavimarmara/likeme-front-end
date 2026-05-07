import { Linking, Platform } from 'react-native';
import { logger } from '@/utils/logger';

export function sanitizeExternalHttpUrl(raw: string | undefined | null): string {
  if (raw == null) {
    return '';
  }
  let s = String(raw).trim();
  if (s.charCodeAt(0) === 0xfeff) {
    s = s.slice(1).trim();
  }
  while ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  s = s.replace(/[\u0000-\u001F\u007F]/g, '');
  s = s.replace(/\s+/g, '');
  if (!s) {
    return '';
  }
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) {
    s = `https://${s}`;
  }
  if (s.length < 8 || s.length > 2048) {
    return '';
  }
  // Caracteres que não costumam aparecer em URLs de loja válidas (evita strings ilegíveis ao Linking).
  if (/[\s<>"'{}|[\]\\^`#]/.test(s)) {
    return '';
  }
  if (!/^([a-z][a-z0-9+.-]*):\/\//i.test(s)) {
    return '';
  }
  return s;
}

function extractAppleNumericAppId(url: string): string | null {
  const m = url.match(/id(\d+)/i);
  return m?.[1] ?? null;
}

function extractPlayStorePackageId(url: string): string | null {
  const m = url.match(/[?&]id=([^&]+)/i);
  if (!m?.[1]) {
    return null;
  }
  const id = decodeURIComponent(m[1]).trim();
  return id.length > 0 ? id : null;
}

function dedupeUrlAttempts(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    if (u && !seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  }
  return out;
}

function isIosSimulator(): boolean {
  if (Platform.OS !== 'ios') {
    return false;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- expo-constants sem import estático
    const Constants = require('expo-constants').default as { deviceName?: string | null };
    return String(Constants.deviceName ?? '')
      .toLowerCase()
      .includes('simulator');
  } catch {
    return false;
  }
}

/**
 * Ordem: loja nativa (`itms-apps` / `market://`) quando derivável; última opção é sempre o
 * mesmo URL https (Safari / browser), em geral o link enviado pelo backend.
 * No simulador iOS não há App Store fiável: usa-se só https (evita -10814 e ruído no CoreServices).
 */
export function buildStoreListingOpenAttempts(
  sanitizedListingUrl: string,
  platform: (typeof Platform)['OS'],
): string[] {
  const base = sanitizedListingUrl.trim();
  if (!base) {
    return [];
  }
  if (platform === 'ios') {
    const appId = extractAppleNumericAppId(base);
    const httpsFallback =
      /^https?:\/\//i.test(base) && /apps\.apple\.com/i.test(base)
        ? base
        : appId
        ? `https://apps.apple.com/app/id${appId}`
        : base;
    if (appId) {
      if (isIosSimulator()) {
        return dedupeUrlAttempts([httpsFallback]);
      }
      const native = `itms-apps://itunes.apple.com/app/id${appId}`;
      return dedupeUrlAttempts([native, httpsFallback]);
    }
    return [base];
  }
  if (platform === 'android' && /^https?:\/\//i.test(base) && /play\.google\.com/i.test(base)) {
    const pkg = extractPlayStorePackageId(base);
    if (pkg) {
      const native = `market://details?id=${encodeURIComponent(pkg)}`;
      return dedupeUrlAttempts([native, base]);
    }
  }
  return [base];
}

export async function openStoreListingWithFallback(sanitizedListingUrl: string): Promise<void> {
  const base = sanitizedListingUrl.trim();
  if (!base) {
    throw new Error('openStoreListingWithFallback: URL vazia');
  }
  const os = Platform.OS;
  if (os !== 'ios' && os !== 'android') {
    await Linking.openURL(base);
    return;
  }
  const attempts = buildStoreListingOpenAttempts(base, os);
  let lastError: unknown;
  for (let i = 0; i < attempts.length; i++) {
    const url = attempts[i]!;
    try {
      await Linking.openURL(url);
      if (i > 0) {
        logger.warn('[openStoreListingWithFallback] Aberto após tentativa(s) anterior(es) falharem', {
          url,
          tentativa: i + 1,
        });
      }
      return;
    } catch (cause) {
      lastError = cause;
      logger.warn('[openStoreListingWithFallback] openURL rejeitou', {
        url,
        tentativa: i + 1,
        total: attempts.length,
        causa: cause instanceof Error ? cause.message : String(cause),
      });
    }
  }
  logger.error('[openStoreListingWithFallback] Todas as tentativas falharam', {
    attempts,
    cause: lastError,
  });
  throw new Error(
    `openStoreListingWithFallback: todas as tentativas falharam: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}

/**
 * URL “canónica” para navegação/estado: https da loja. Só reescreve `itms-apps` legado em iOS.
 * A abertura nativa (`itms-apps` / `market://`) fica em `openStoreListingWithFallback`.
 */
export function normalizeStoreOpenUrl(raw: string, platform: 'ios' | 'android' | 'web' | 'windows' | 'macos'): string {
  const cleaned = sanitizeExternalHttpUrl(raw);
  if (!cleaned) {
    return '';
  }
  if (platform === 'ios' && /^itms-apps:\/\//i.test(cleaned)) {
    const appId = extractAppleNumericAppId(cleaned);
    if (appId) {
      return `https://apps.apple.com/app/id${appId}`;
    }
  }
  return cleaned;
}
