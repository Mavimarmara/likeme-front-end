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
			// Obter a tradução base
			let result = t(key, options);
			
			// Se houver opções e o resultado contém chaves, fazer interpolação manual
			if (options && Object.keys(options).length > 0 && typeof result === 'string' && result.includes('{')) {
				Object.keys(options).forEach((optionKey) => {
					const value = options[optionKey];
					// Substituir {key} e {{key}} para garantir compatibilidade
					result = result.replace(
						new RegExp(`\\{\\{?${optionKey}\\}?\\}`, 'g'),
						String(value)
					);
				});
			}
			
			return typeof result === 'string' ? result : String(result);
		},
		changeLanguage: (lng: string) => i18n.changeLanguage(lng),
		currentLanguage: i18n.language,
	};
};

