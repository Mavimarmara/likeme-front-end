import { useTranslation as useI18nTranslation } from 'react-i18next';

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
 */
export const useTranslation = () => {
	const { t, i18n } = useI18nTranslation();

	return {
		t: (key: string, options?: Record<string, any>): string => {
			const result = t(key, options);
			return typeof result === 'string' ? result : String(result);
		},
		changeLanguage: (lng: string) => i18n.changeLanguage(lng),
		currentLanguage: i18n.language,
	};
};

