import { usePreferences } from '../content/localization';
export function useStartLanguage() {
    const { locale, setLocale } = usePreferences();
    return { locale, setLocale };
}
