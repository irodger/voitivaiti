import { useI18n } from '../content/localization';
import { resolveTaskTemplate } from '../content/scenarios';
import { isConsequential } from '../world/decisions';
import { activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
import type { Step, StepProgress } from '../world/types';
import { decisionFeedback } from './decisionFeedback';
import { useStepExecution } from './useStepExecution';
export function useStepRenderer(step: Step, readOnly: boolean, viewProgress?: StepProgress) {
    const world = useWorld();
    const { t } = useI18n();
    const task = activeTask(world)!;
    const p = viewProgress ?? task?.progress[step.id];
    const done = p?.status === 'completed';
    const disabled = readOnly || done;
    useStepExecution(task?.id, step, p?.run, readOnly);
    if (!task || !p)
        return null;
    const template = resolveTaskTemplate(task);
    const consequential = isConsequential(step);
    const response = p.responseKey === 'decision.committed' ? decisionFeedback(step, p, t) : t(p.responseKey ?? 'ui.success');
    return { world, t, task, p, done, disabled, template, consequential, response };
}
