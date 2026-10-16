import { useI18n } from '../content/localization';
import { deskAvailability } from '../world/deskAvailability';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useDeskNextStep() {
    const w = useWorld();
    const { t } = useI18n();
    const state = deskAvailability(w);
    const ch = activeCharacter(w);
    const canEnd = w.phase === 'office' && (ch.firstDay && !ch.firstDay.onboardingCompleted ? !w.schedule.some(e => e.status === 'pending') : !state.pending.some(e => e.type === 'sync'));
    return { w, t, state, canEnd };
}
