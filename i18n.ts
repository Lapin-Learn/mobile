import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from '~/locales/en';
import * as vi from '~/locales/vi';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: { translation: en.common, ...en },
    vi: { translation: vi.common, ...vi },
  },
  lng: Localization.getLocales()[0].languageCode ?? 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
    format: function (value, format) {
      if (format === 'lowercase') {
        return value.charAt(0).toLowerCase() + value.slice(1);
      }
      return value;
    },
  },
});

export default i18n;
