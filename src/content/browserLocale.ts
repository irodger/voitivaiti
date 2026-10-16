import type { Locale } from '../world/types';

export function browserLocale(languages: readonly string[]): Locale {
  const primary = languages.find((language) => typeof language === 'string' && language.trim());
  return primary?.toLowerCase().split(/[-_]/)[0] === 'ru' ? 'ru' : 'en';
}

export function initialBrowserLocale(): Locale {
  // Server-side tools have no user's browser preference.
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'ru';
  return browserLocale(navigator.languages?.length ? navigator.languages : [navigator.language]);
}
