import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
export function useCareerReport() {
    const { t } = useI18n();
    const w = useWorld();
    return { t, w };
}
