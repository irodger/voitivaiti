import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import { workClock } from '../world/workClock';
export function useWorkClock() {
    const w = useWorld();
    const { t } = useI18n();
    if (w.phase !== 'office')
        return null;
    const clock = workClock(w);
    return { w, t, clock };
}
