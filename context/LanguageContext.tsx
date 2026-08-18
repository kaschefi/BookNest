"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { en, TranslationSchema } from "@/lib/i18n/locales/en";
import { fa } from "@/lib/i18n/locales/fa";

export type Language = "en" | "fa";

const dictionaries: Record<Language, TranslationSchema> = {
  en,
  fa,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "babardia_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang && (savedLang === "en" || savedLang === "fa")) {
        setLanguageState(savedLang);
      }
    } catch {
      // localStorage may not be available in strict privacy settings
    }
  }, []);

  useEffect(() => {
    const isRtl = language === "fa";
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    startTransition(() => {
      setLanguageState(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // ignore storage errors
      }
    });
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fa" : "en");
  };

  const t = (key: string, fallback?: string): string => {
    const keys = key.split(".");
    
    // Attempt lookup in current dictionary
    let current: any = dictionaries[language];
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        current = undefined;
        break;
      }
    }

    if (typeof current === "string") {
      return current;
    }

    // Fallback to English dictionary
    let fallbackCurrent: any = dictionaries.en;
    for (const k of keys) {
      if (fallbackCurrent && typeof fallbackCurrent === "object" && k in fallbackCurrent) {
        fallbackCurrent = fallbackCurrent[k];
      } else {
        fallbackCurrent = undefined;
        break;
      }
    }

    if (typeof fallbackCurrent === "string") {
      return fallbackCurrent;
    }

    return fallback ?? key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRTL: language === "fa",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
