import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr from '../locales/fire_base_errors.json';

const resources = {
  tr: {
    translation: tr
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr', // default language
    fallbackLng: 'tr',
    compatibilityJSON: 'v3',
    
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    
    react: {
      useSuspense: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p']
    }
  });

export default i18n;
