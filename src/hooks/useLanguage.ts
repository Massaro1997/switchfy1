import { useState, useEffect } from 'react';
import { Language, TranslationKey, getTranslation } from '@/lib/translations';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('it');

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('switchfy_language') as Language;
      if (saved && (saved === 'it' || saved === 'de')) {
        setLanguage(saved);
      }
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('switchfy_language', language);
    }
  }, [language]);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let translation = getTranslation(language, key);
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, String(params[param]));
      });
    }
    return translation;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'it' ? 'de' : 'it');
  };

  return {
    language,
    setLanguage,
    toggleLanguage,
    t
  };
};