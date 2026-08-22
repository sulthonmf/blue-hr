import idLocales from '../locales/id.json';
import enLocales from '../locales/en.json';

export type SupportedLanguage = 'id' | 'en';

const localesMap: Record<SupportedLanguage, Record<string, string>> = {
  id: idLocales,
  en: enLocales
};

export function tMessage(key: string, lang: SupportedLanguage = 'id'): string {
  const dictionary = localesMap[lang] || localesMap.id;
  return dictionary[key] || key;
}
