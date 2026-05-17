// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // <--- 1. Импортируем детектор

import enTranslation from './locales/en/translation.json';
import ruTranslation from './locales/ru/translation.json';
import hyTranslation from './locales/hy/translation.json';

i18n
  .use(LanguageDetector) // <--- 2. Подключаем детектор
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ru: { translation: ruTranslation },
      hy: { translation: hyTranslation },
    },
    // lng: 'en', // <--- 3. УДАЛИТЕ или закомментируйте эту строку! (иначе автоопределение не сработает)
    fallbackLng: 'en', // Если язык пользователя не найден (например, французский), включится английский
    
    // Настройки детектора (опционально)
    detection: {
      order: ['path', 'localStorage', 'cookie', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: ['localStorage', 'cookie'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('initialized', () => {
  const lang = i18n.language.split('-')[0];
  document.documentElement.lang = lang;
  document.body.className = `lang-${lang}`;
});

export default i18n;