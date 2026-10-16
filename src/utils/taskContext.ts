import { resolveTaskTemplate } from '../content/scenarios';
import type { Step, Task } from '../world/types';
export function taskStepSummary(task: Task, steps: readonly Step[]) {
  return {
    current: steps.find((step) => step.id === task.currentStepId),
    done: steps.filter((step) => task.progress[step.id]?.status === 'completed').length,
  };
}
/** Does not hide rewarded tasks: each view owns that visibility decision. */
export function taskContext(task: Task): {
  template: ReturnType<typeof resolveTaskTemplate>;
  step: Step | undefined;
  done: number;
};
export function taskContext(task: Task | undefined): {
  template: ReturnType<typeof resolveTaskTemplate> | undefined;
  step: Step | undefined;
  done: number;
};
export function taskContext(task: Task | undefined) {
  const template = task ? resolveTaskTemplate(task) : undefined;
  const summary = task && template ? taskStepSummary(task, template.steps) : undefined;
  return { template, step: summary?.current, done: summary?.done ?? 0 };
}
