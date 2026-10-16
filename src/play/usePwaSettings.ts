import { useI18n } from '../content/localization';
import { usePwa } from '../pwa';
export function usePwaSettings() {
    const pwa = usePwa();
    const { t } = useI18n();
    return { pwa, t };
}
