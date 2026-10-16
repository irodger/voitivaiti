import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import type { Step, Task, TaskTemplate } from '../world/types';
export function useStepIntroduction(props: { task: Task; step: Step; template: TaskTemplate }) {
  const { task, step, template } = props;
  const { t } = useI18n();
  const company = useWorld((s) => s.company);
  const first = template.steps[0].id === step.id;
  const priorOutcome =
    task.templateId.startsWith('lens.') && first
      ? company?.projects
          .find((project) => project.id === task.projectId)
          ?.problems.find((problem) => problem.id === task.problemId)?.latestOutcomeKey
      : undefined;
  const bodyKey = step.type === 'review' ? 'fix.ready' : step.bodyKey;
  return { t, first, priorOutcome, bodyKey };
}
