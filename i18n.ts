import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from '~/locales/en';
import * as vi from '~/locales/vi';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: { translation: en.english, auth: en.auth, user: en.user, lesson: en.lesson, question: en.question },
    vi: { translation: vi.vietnamese, auth: vi.auth, user: vi.user, lesson: vi.lesson, question: vi.question },
  },
  lng: 'vi',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
