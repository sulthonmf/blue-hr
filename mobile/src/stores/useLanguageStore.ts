import { create } from 'zustand';
import idTranslations from '../locales/id.json';
import enTranslations from '../locales/en.json';

export type LanguageMode = 'ID' | 'EN';

export const mobileTranslations = {
  ID: idTranslations,
  EN: enTranslations
};

interface LanguageState {
  lang: LanguageMode;
  toggleLanguage: () => void;
  t: typeof idTranslations;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: 'ID',
  toggleLanguage: () => set((state) => {
    const newLang = state.lang === 'ID' ? 'EN' : 'ID';
    return { lang: newLang, t: mobileTranslations[newLang] };
  }),
  t: mobileTranslations.ID
}));
