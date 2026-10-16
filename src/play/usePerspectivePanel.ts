import { useI18n } from '../content/localization';
import { activeCharacter, activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
export function usePerspectivePanel() {
    const w = useWorld();
    const ch = activeCharacter(w);
    const task = activeTask(w);
    const ep = w.perspective;
    const { t } = useI18n();
    if (!task?.rewarded || ch.completedWork.length < 2)
        return null;
    const role = ch.profession === 'qa' ? 'frontend' : 'qa';
    if (!ep && ch.experience?.some(e => e.id === 'perspective:' + task.id))
        return null;
    return { w, ch, ep, t, role };
}
