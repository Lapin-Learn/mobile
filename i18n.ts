import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '~/locales/en/english.json';
import vi from '~/locales/vi/vietnamese.json';

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    lng: 'vi', // Set the initial language
    fallbackLng: 'en', // Use English if detected language is not available
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
