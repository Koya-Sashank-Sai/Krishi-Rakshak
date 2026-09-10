import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('krishi_rakshak_language');
    if (saved === 'en' || saved === 'hi' || saved === 'mr') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('krishi_rakshak_language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
