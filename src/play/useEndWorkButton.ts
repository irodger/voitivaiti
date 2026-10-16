import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useEndWorkButton() {
    const w = useWorld();
    const ch = activeCharacter(w);
    const { t } = useI18n();
    if (!ch.firstDay?.onboardingCompleted || w.phase !== 'office' || w.schedule.some(e => e.type === 'sync' && e.status === 'pending'))
        return null;
    return { w, t };
}
