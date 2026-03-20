import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/services';
import type { ApiResponse } from '@/types/infrastructure';
import { logger } from '@/utils/logger';
import i18n from './index';

type I18nTranslationDict = Record<string, any>;

export type I18nLabelsApiResponse = {
  version?: string;
  etag?: string;
  updatedAt?: string;
  translation?: I18nTranslationDict;
};

type I18nCachePayload = {
  version?: string;
  etag?: string;
  updatedAt?: string;
  translation: I18nTranslationDict;
};

const DEFAULT_LANGUAGE = 'pt-BR';
const STORAGE_KEY_PREFIX = '@likeme:i18n:translations:';

let hydrationPromise: Promise<void> | null = null;

const buildStorageKey = (lang: string) => `${STORAGE_KEY_PREFIX}${lang}`;

const applyTranslationBundle = (lang: string, translation: I18nTranslationDict) => {
  // Namespace default que o i18next usa aqui: 'translation'
  i18n.addResourceBundle(lang, 'translation', translation, true, true);
};

const loadFromCache = async (lang: string): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(buildStorageKey(lang));
    if (!raw) {
      return false;
    }

    const parsed = JSON.parse(raw) as Partial<I18nCachePayload>;
    if (!parsed.translation || typeof parsed.translation !== 'object') {
      return false;
    }

    applyTranslationBundle(lang, parsed.translation);
    return true;
  } catch (error) {
    logger.warn('[i18n] Falha ao ler traducoes do AsyncStorage:', error);
    return false;
  }
};

const saveToCache = async (lang: string, payload: I18nCachePayload): Promise<void> => {
  try {
    await AsyncStorage.setItem(buildStorageKey(lang), JSON.stringify(payload));
  } catch (error) {
    logger.warn('[i18n] Falha ao salvar traducoes no AsyncStorage:', error);
  }
};

export const startI18nHydration = (lang: string = DEFAULT_LANGUAGE): Promise<void> => {
  if (hydrationPromise) {
    return hydrationPromise;
  }

  hydrationPromise = (async () => {
    // 1) aplica cache primeiro (para reduzir chance de exibir keys)
    await loadFromCache(lang);

    // 2) busca no backend e atualiza cache + i18n
    // Endpoint sugerido no backend:
    // GET /api/i18n/labels?lang=pt-BR
    // Response: { version?, etag?, updatedAt?, translation: { ...mesma estrutura do pt-BR.json... } }
    const response = await apiClient.get<ApiResponse<I18nLabelsApiResponse>>('/api/i18n/labels', { lang }, false);

    const payload = response?.data;
    if (!payload?.translation || typeof payload.translation !== 'object') {
      return;
    }

    applyTranslationBundle(lang, payload.translation);
    await saveToCache(lang, {
      version: payload.version,
      etag: payload.etag,
      updatedAt: payload.updatedAt,
      translation: payload.translation,
    });
  })().catch((error) => {
    logger.warn('[i18n] Falha ao hidratar traducoes:', error);
  });

  return hydrationPromise;
};

export const ensureI18nHydrated = async ({
  lang = DEFAULT_LANGUAGE,
  timeoutMs = 2500,
}: {
  lang?: string;
  timeoutMs?: number;
} = {}): Promise<void> => {
  const promise = startI18nHydration(lang);
  if (timeoutMs <= 0) {
    await promise;
    return;
  }

  await Promise.race([
    promise,
    new Promise<void>((resolve) => {
      setTimeout(() => resolve(), timeoutMs);
    }),
  ]);
};
