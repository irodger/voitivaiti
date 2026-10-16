import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
export function usePerformancePanel() {
    const w = useWorld();
    const { t } = useI18n();
    if (!w.life?.reviewDue)
        return null;
    return { life: w.life, w, t };
}
