import { useI18n } from '../content/localization';
import { resolveTaskTemplate } from '../content/scenarios';
import { deskAvailability } from '../world/deskAvailability';
import { activeCharacter, activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
export function useOfficeBrief() {
    const w = useWorld();
    const { t } = useI18n();
    const ch = activeCharacter(w);
    const state = deskAvailability(w);
    const task = activeTask(w);
    const template = task && !task.rewarded ? resolveTaskTemplate(task) : undefined;
    const current = template?.steps.find(s => s.id === task?.currentStepId);
    const done = template?.steps.filter(s => task?.progress[s.id]?.status === 'completed').length ?? 0;
    const reason = state.reason === 'current' ? 'current' : state.reason === 'sync' ? 'sync' : state.reason === 'review' ? 'review' : state.reason === 'waiting' ? 'waiting' : state.reason === 'empty' ? 'empty' : state.reason === 'late' ? 'late' : 'ready';
    const showCurrent = reason === 'current' && template;
    return { w, t, ch, state, task, template, current, done, reason, showCurrent };
}
