import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from '~/locales/en/english.json';
import vi from '~/locales/vi/vietnamese.json';

const i18n = new I18n(
  {
    en: en,
    vi: vi,
  },
  {
    enableFallback: true,
    defaultLocale: 'vi',
  }
);

i18n.locale = getLocales()[0].languageCode ?? 'vi';

export default i18n;
