import { Linking, Platform } from 'react-native';
import {
  buildStoreListingOpenAttempts,
  normalizeStoreOpenUrl,
  openStoreListingWithFallback,
  sanitizeExternalHttpUrl,
} from '@/utils/url/storeListingUrl';

describe('sanitizeExternalHttpUrl', () => {
  it('remove aspas e espaços', () => {
    expect(sanitizeExternalHttpUrl('  "https://play.google.com/store?id=x"  ')).toBe(
      'https://play.google.com/store?id=x',
    );
  });

  it('adiciona https quando falta esquema', () => {
    expect(sanitizeExternalHttpUrl('play.google.com/store/apps/details?id=com.app')).toBe(
      'https://play.google.com/store/apps/details?id=com.app',
    );
  });

  it('retorna vazio para string ilegível após normalização', () => {
    expect(sanitizeExternalHttpUrl('https://[')).toBe('');
  });
});

describe('normalizeStoreOpenUrl', () => {
  it('iOS: mantém URL https da App Store (o link enviado)', () => {
    const url = 'https://apps.apple.com/br/app/like-me/id6757706434';
    expect(normalizeStoreOpenUrl(url, 'ios')).toBe(url);
  });

  it('iOS: itms-apps legado → mesmo destino em https', () => {
    expect(normalizeStoreOpenUrl('itms-apps://itunes.apple.com/app/id6757706434', 'ios')).toBe(
      'https://apps.apple.com/app/id6757706434',
    );
  });

  it('Android: mantém URL https da Play (abertura nativa fica em openStoreListingWithFallback)', () => {
    const url = 'https://play.google.com/store/apps/details?id=com.likeme.app';
    expect(normalizeStoreOpenUrl(url, 'android')).toBe(url);
  });

  it('web: devolve URL sanitizada', () => {
    expect(normalizeStoreOpenUrl('https://example.com/path', 'web')).toBe('https://example.com/path');
  });
});

describe('buildStoreListingOpenAttempts', () => {
  it('iOS: itms-apps depois https (fallback = URL enviado)', () => {
    const url = 'https://apps.apple.com/br/app/like-me/id6757706434';
    expect(buildStoreListingOpenAttempts(url, 'ios')).toEqual(['itms-apps://itunes.apple.com/app/id6757706434', url]);
  });

  it('Android: market depois https', () => {
    const url = 'https://play.google.com/store/apps/details?id=com.likeme.app';
    expect(buildStoreListingOpenAttempts(url, 'android')).toEqual(['market://details?id=com.likeme.app', url]);
  });
});

describe('openStoreListingWithFallback (iOS)', () => {
  let openSpy: jest.SpyInstance<Promise<boolean>, [string]>;

  beforeEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios', writable: true });
  });

  afterEach(() => {
    openSpy?.mockRestore();
  });

  it('tenta itms-apps e em seguida o https quando a primeira falha', async () => {
    const https = 'https://apps.apple.com/br/app/x/id99';
    openSpy = jest
      .spyOn(Linking, 'openURL')
      .mockRejectedValueOnce(new Error('simulator'))
      .mockResolvedValueOnce(undefined);
    await openStoreListingWithFallback(https);
    expect(openSpy).toHaveBeenNthCalledWith(1, 'itms-apps://itunes.apple.com/app/id99');
    expect(openSpy).toHaveBeenNthCalledWith(2, https);
  });
});

describe('openStoreListingWithFallback (Android)', () => {
  let openSpy: jest.SpyInstance<Promise<boolean>, [string]>;

  beforeEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android', writable: true });
  });

  afterEach(() => {
    openSpy?.mockRestore();
  });

  it('tenta market e em seguida https quando a primeira falha', async () => {
    const https = 'https://play.google.com/store/apps/details?id=com.app';
    openSpy = jest
      .spyOn(Linking, 'openURL')
      .mockRejectedValueOnce(new Error('no play'))
      .mockResolvedValueOnce(undefined);
    await openStoreListingWithFallback(https);
    expect(openSpy).toHaveBeenNthCalledWith(1, 'market://details?id=com.app');
    expect(openSpy).toHaveBeenNthCalledWith(2, https);
  });
});
