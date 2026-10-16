import { useI18n, usePreferences } from '../content/localization';
export function useThemeSettings() {
    const { t } = useI18n();
    const p = usePreferences();
    return { t, p };
}
