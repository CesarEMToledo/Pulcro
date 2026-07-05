import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { translations, Language, Translations } from '@/constants/translations';

interface LanguageContextValue {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      t: translations[language],
      toggleLanguage: () => setLanguage((prev) => (prev === 'es' ? 'en' : 'es')),
      setLanguage,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
