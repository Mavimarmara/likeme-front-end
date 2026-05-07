import { getApiUrl } from '@/config';
import { APP_RELEASE_POLICY_FETCH_TIMEOUT_MS } from '@/constants';
import type { AppReleasePolicy } from '@/types/app/appReleasePolicy';
import { fetchWithTimeout } from '@/utils/network/fetchWithTimeout';
import { logger } from '@/utils/logger';

function parsePolicyPayload(raw: unknown): AppReleasePolicy | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const root = raw as Record<string, unknown>;
  const data = (root.data ?? root) as Record<string, unknown>;
  const minVersionIos = typeof data.minVersionIos === 'string' ? data.minVersionIos : null;
  const minVersionAndroid = typeof data.minVersionAndroid === 'string' ? data.minVersionAndroid : null;
  if (!minVersionIos || !minVersionAndroid) {
    return null;
  }
  const asOptionalString = (v: unknown): string | null => {
    if (v == null) {
      return null;
    }
    if (typeof v !== 'string') {
      return null;
    }
    const t = v.trim();
    return t.length > 0 ? t : null;
  };

  return {
    forceUpdateEnabled: Boolean(data.forceUpdateEnabled),
    minVersionIos,
    minVersionAndroid,
    recommendedVersionIos: asOptionalString(data.recommendedVersionIos),
    recommendedVersionAndroid: asOptionalString(data.recommendedVersionAndroid),
    storeUrlIos: typeof data.storeUrlIos === 'string' ? data.storeUrlIos : '',
    storeUrlAndroid: typeof data.storeUrlAndroid === 'string' ? data.storeUrlAndroid : '',
    message: typeof data.message === 'string' ? data.message : null,
  };
}

export async function fetchAppReleasePolicy(): Promise<AppReleasePolicy | null> {
  try {
    const response = await fetchWithTimeout(
      getApiUrl('/api/app/release-policy'),
      { method: 'GET', headers: { Accept: 'application/json' } },
      APP_RELEASE_POLICY_FETCH_TIMEOUT_MS,
    );
    if (!response.ok) {
      logger.warn('[appReleasePolicyService] HTTP não OK ao buscar política de versão', {
        status: response.status,
      });
      return null;
    }
    const json: unknown = await response.json();
    return parsePolicyPayload(json);
  } catch (cause) {
    logger.error('[appReleasePolicyService] Falha ao buscar política de versão', { cause });
    return null;
  }
}
