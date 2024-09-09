import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from '~/locales/en';
import * as vi from '~/locales/vi';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: { translation: en.english, auth: en.auth },
    vi: { translation: vi.vietnamese, auth: vi.auth },
  },
  lng: 'vi',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
