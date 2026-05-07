import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { AppReleasePolicy } from '@/types/app/appReleasePolicy';
import { compareSemanticVersions } from '@/utils/version/compareSemanticVersions';

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
  const trimmed = (fromApi ?? '').trim();
  if (trimmed.length > 0) {
    return trimmed;
  }
  return Platform.OS === 'ios' ? fallbacks.ios.trim() : fallbacks.android.trim();
}
