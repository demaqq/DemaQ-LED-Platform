import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES, translations } from '../i18n/translations';

export type Theme = 'dark' | 'light';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: typeof translations['en'];
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  resetLogo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Official Logo URL state with persistence
  const [logoUrl, setLogoUrlState] = useState<string>(() => {
    const saved = localStorage.getItem('demaq_custom_logo');
    // Sanitize any stale local references to the deleted fake png
    if (saved && saved !== '/demaq-official-logo.png') {
      return saved;
    }
    return '';
  });

  const setLogoUrl = (url: string) => {
    setLogoUrlState(url);
    if (url) {
      localStorage.setItem('demaq_custom_logo', url);
    } else {
      localStorage.removeItem('demaq_custom_logo');
    }
  };

  const resetLogo = () => {
    setLogoUrlState('');
    localStorage.removeItem('demaq_custom_logo');
  };

  // 1. Language state with persistence
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('demaq_language');
    if (saved && ['en', 'am', 'om', 'ti', 'so'].includes(saved)) {
      return saved as Language;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('demaq_language', lang);
    document.documentElement.lang = lang;
  };

  // 2. Theme state with persistence - Instant & Zero Lag
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('demaq_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved as Theme;
    }
    return 'dark'; // default to dark cyber-LED aesthetic
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('demaq_theme', newTheme);
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    root.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  // Initial sync on mount
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    root.setAttribute('data-theme', theme);
  }, []);

  // Sync lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const currentTranslations = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        t: currentTranslations,
        logoUrl,
        setLogoUrl,
        resetLogo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
