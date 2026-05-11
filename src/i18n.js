// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import ruTranslation from './locales/ru/translation.json';
import hyTranslation from './locales/hy/translation.json';

// ← ДОБАВЛЕНО: синхронно до рендера React
const savedLang = (localStorage.getItem('i18nextLng') || 'ru').split('-')[0];
document.documentElement.lang = savedLang;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ru: { translation: ruTranslation },
      hy: { translation: hyTranslation },
    },
    fallbackLng: 'en',
    
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

// После инициализации синхронизируем ещё раз на случай если детектор нашёл другой язык
document.documentElement.lang = i18n.language.split('-')[0];

export default i18n;