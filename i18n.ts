import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from '~/locales/en';
import * as vi from '~/locales/vi';

const LANGUAGE_KEY = 'language';

const loadLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    return savedLanguage || Localization.getLocales()[0].languageCode || 'en';
  } catch (error) {
    console.error('Failed to load language from storage', error);
    return 'en';
  }
};

const saveLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to save language to storage', error);
  }
};

loadLanguage().then((language) => {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en.common, ...en },
      vi: { translation: vi.common, ...vi },
    },
    lng: language,
    fallbackLng: 'en',
    defaultNS: 'translation',
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

  i18n.on('languageChanged', (lng) => {
    saveLanguage(lng);
  });
});

export default i18n;
