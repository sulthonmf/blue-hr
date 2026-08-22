import { create } from 'zustand';
import idTranslations from '../locales/id.json';
import enTranslations from '../locales/en.json';

export type LanguageMode = 'ID' | 'EN';

export const translations = {
  ID: idTranslations,
  EN: enTranslations
};

interface LanguageState {
  lang: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  toggleLanguage: () => void;
  t: typeof idTranslations;
}

const getSavedLang = (): LanguageMode => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return (localStorage.getItem('bluehr_lang') as LanguageMode) || 'ID';
  }
  return 'ID';
};

const saveLang = (lang: LanguageMode) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('bluehr_lang', lang);
  }
};

export const useLanguageStore = create<LanguageState>((set) => {
  const initialLang = getSavedLang();
  return {
    lang: initialLang,
    setLanguage: (lang: LanguageMode) => {
      saveLang(lang);
      set({ lang, t: translations[lang] });
    },
    toggleLanguage: () => set((state) => {
      const newLang = state.lang === 'ID' ? 'EN' : 'ID';
      saveLang(newLang);
      return { lang: newLang, t: translations[newLang] };
    }),
    t: translations[initialLang]
  };
});
