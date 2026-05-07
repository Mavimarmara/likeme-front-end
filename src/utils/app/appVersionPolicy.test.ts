import { Platform } from 'react-native';
import type { AppReleasePolicy } from '@/types/app/appReleasePolicy';
import { shouldForceAppUpdate, shouldRecommendUpdate } from '@/utils/app/appVersionPolicy';

describe('appVersionPolicy', () => {
  const originalOs = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalOs, writable: true });
  });

  it('shouldForceAppUpdate respeita flag e mínimo iOS', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios', writable: true });
    const policy: AppReleasePolicy = {
      forceUpdateEnabled: true,
      minVersionIos: '2.0.0',
      minVersionAndroid: '1.0.0',
      recommendedVersionIos: null,
      recommendedVersionAndroid: null,
      storeUrlIos: 'https://apps.apple.com/',
      storeUrlAndroid: '',
      message: null,
    };
    expect(shouldForceAppUpdate(policy, '1.9.9')).toBe(true);
    expect(shouldForceAppUpdate(policy, '2.0.0')).toBe(false);
    expect(shouldForceAppUpdate({ ...policy, forceUpdateEnabled: false }, '1.0.0')).toBe(false);
  });

  it('shouldRecommendUpdate exige versão recomendada', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android', writable: true });
    const policy: AppReleasePolicy = {
      forceUpdateEnabled: false,
      minVersionIos: '0.0.0',
      minVersionAndroid: '0.0.0',
      recommendedVersionIos: null,
      recommendedVersionAndroid: '2.0.0',
      storeUrlIos: '',
      storeUrlAndroid: 'https://play.google.com/',
      message: null,
    };
    expect(shouldRecommendUpdate(policy, '1.0.0')).toBe(true);
    expect(shouldRecommendUpdate(policy, '2.0.0')).toBe(false);
  });
});
