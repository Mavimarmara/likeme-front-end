import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { nativeApplicationVersion as nativeVersionFromApplication } from 'expo-application';
import type { AppReleasePolicy } from '@/types/app/appReleasePolicy';
import { normalizeStoreOpenUrl, sanitizeExternalHttpUrl } from '@/utils/url/storeListingUrl';

function pickFirstNonEmptyVersion(candidates: Array<string | null | undefined>): string {
  for (const raw of candidates) {
    if (typeof raw !== 'string') {
      continue;
    }
    const trimmed = raw.trim();
    if (trimmed !== '') {
      return trimmed;
    }
  }
  return '0.0.0';
}

export function getInstalledAppVersion(): string {
  const constantsRecord = Constants as Record<string, unknown>;
  const nativeApplicationVersionField =
    typeof constantsRecord.nativeApplicationVersion === 'string' ? constantsRecord.nativeApplicationVersion : undefined;
  const nativeAppVersionField =
    typeof constantsRecord.nativeAppVersion === 'string' ? constantsRecord.nativeAppVersion : undefined;
  const fromManifest = Constants.expoConfig?.version;

  return pickFirstNonEmptyVersion([
    nativeVersionFromApplication,
    nativeApplicationVersionField,
    nativeAppVersionField,
    fromManifest,
  ]);
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
