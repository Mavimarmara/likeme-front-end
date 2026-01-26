import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from './locales/pt-BR.json';

i18n
	.use(initReactI18next)
	.init({
		compatibilityJSON: 'v3',
		resources: {
			'pt-BR': {
				translation: ptBR,
			},
		},
		lng: 'pt-BR',
		fallbackLng: 'pt-BR',
		interpolation: {
			escapeValue: false,
		},
		react: {
			useSuspense: false,
		},
	});

export default i18n;

