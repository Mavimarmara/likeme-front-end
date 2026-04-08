import * as ReactI18Next from 'react-i18next';
import { markdownToPlainText } from '@/utils/parseMarkdown';

const useI18nTranslation =
  typeof ReactI18Next?.useTranslation === 'function'
    ? ReactI18Next.useTranslation
    : () => ({
        t: (key: string) => key,
        i18n: {
          changeLanguage: () => {
            /* noop */
          },
          language: 'pt-BR',
        },
      });

/**
 * Hook customizado para traduções
 * Facilita o uso das traduções no projeto
 *
 * @example
 * const { t } = useTranslation();
 * <Text>{t('common.save')}</Text>
 *
 * @example Com interpolação
 * const { t } = useTranslation();
 * <Text>{t('auth.introGreeting', { userName: 'João' })}</Text>
 *
 * Markdown leve nos labels (`**`, `*`, `__`) é removido; o retorno é texto plano (quebras `\\n` preservadas).
 */
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  return {
    t: (key: string, options?: Record<string, any>): string => {
      const raw = t(key, options);
      let result = typeof raw === 'string' ? raw : String(raw);

      if (options && Object.keys(options).length > 0 && result.includes('{')) {
        Object.keys(options).forEach((optionKey) => {
          const value = options[optionKey];
          result = result.replace(new RegExp(`\\{\\{?${optionKey}\\}?\\}`, 'g'), String(value));
        });
      }

      return markdownToPlainText(result);
    },
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),
    currentLanguage: i18n.language,
  };
};
