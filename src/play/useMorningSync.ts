import { useI18n } from '../content/localization';
import { resolveTaskTemplate, templateById } from '../content/scenarios';
import { activeCharacter, activeTask, plannedTemplateId } from '../world/simulation';
import { useWorld } from '../world/store';
import { autonomy } from '../world/workLoop';
export function useMorningSync() {
    const w = useWorld();
    const ch = activeCharacter(w);
    const task = activeTask(w);
    const { t } = useI18n();
    const level = autonomy(ch);
    const current = task && !task.rewarded;
    const template = current ? resolveTaskTemplate(task) : templateById[plannedTemplateId(w)];
    return { w, task, t, level, current, template };
}
