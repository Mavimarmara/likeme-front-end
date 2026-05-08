import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { AppReleasePolicy } from '@/types/app/appReleasePolicy';
import { compareSemanticVersions } from '@/utils/version/compareSemanticVersions';
import { normalizeStoreOpenUrl, sanitizeExternalHttpUrl } from '@/utils/url/storeListingUrl';

export function getInstalledAppVersion(): string {
  const native = Constants.nativeAppVersion;
  const expo = Constants.expoConfig?.version;
  const raw = (typeof native === 'string' && native.trim() !== '' ? native : expo) ?? '0.0.0';
  return String(raw).trim() || '0.0.0';
}

export function shouldForceAppUpdate(policy: AppReleasePolicy | null, installedVersion: string): boolean {
  if (!policy || !policy.forceUpdateEnabled) {
    return false;
  }
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return false;
  }
  const min = Platform.OS === 'ios' ? policy.minVersionIos : policy.minVersionAndroid;
  return compareSemanticVersions(installedVersion, min) < 0;
}

export function shouldRecommendUpdate(policy: AppReleasePolicy | null, installedVersion: string): boolean {
  if (!policy) {
    return false;
  }
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return false;
  }
  const rec = Platform.OS === 'ios' ? policy.recommendedVersionIos : policy.recommendedVersionAndroid;
  if (!rec || rec.trim() === '') {
    return false;
  }
  return compareSemanticVersions(installedVersion, rec) < 0;
}

export function resolveStoreUrlForPlatform(
  policy: AppReleasePolicy,
  fallbacks: { ios: string; android: string },
): string {
  const fromApi = Platform.OS === 'ios' ? policy.storeUrlIos : policy.storeUrlAndroid;
  const fromApiClean = sanitizeExternalHttpUrl(fromApi);
  const raw =
    fromApiClean.length > 0
      ? fromApiClean
      : sanitizeExternalHttpUrl(Platform.OS === 'ios' ? fallbacks.ios : fallbacks.android);
  if (!raw) {
    return '';
  }
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return normalizeStoreOpenUrl(raw, Platform.OS);
  }
  return raw;
}
