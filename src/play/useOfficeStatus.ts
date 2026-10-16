import { useI18n } from '../content/localization';
import { resolveTaskTemplate } from '../content/scenarios';
import { deskAvailability } from '../world/deskAvailability';
import { activeCharacter, activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
export function useOfficeStatus() {
    const w = useWorld();
    const { t } = useI18n();
    const task = activeTask(w);
    const current = task && !task.rewarded ? resolveTaskTemplate(task) : undefined;
    const ch = activeCharacter(w);
    const queue = deskAvailability(w).eligible.length;
    return { w, t, current, ch, queue };
}
