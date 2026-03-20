import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const fallbackPtBRTranslation = {
  auth: {
    // Fallback para a animacao do LoadingScreen, caso o dicionario completo
    // ainda nao tenha sido hidratado (cache/backend).
    taglineRhythm: 'SEU RITMO',
    taglineJourney: 'SUA JORNADA',
    taglineRoutine: 'SUA ROTINA',
  },
} as const;

const resources = {
  'pt-BR': {
    translation: fallbackPtBRTranslation,
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false, // react already safes from xss
      formatSeparator: ',',
    },
    compatibilityJSON: 'v4' as const,
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
