import { FileCheck2, ShieldAlert, Trophy } from 'lucide-react';
import { useI18n } from '../content/localization';
import { resolveTaskTemplate } from '../content/scenarios';
import { activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
export function useTaskResult() {
  const w = useWorld();
  const task = activeTask(w);
  const { t } = useI18n();
  if (!task) return null;
  const template = resolveTaskTemplate(task);
  const choiceStep = template.steps.find(
    (step) =>
      step.type !== 'review' &&
      step.options?.some((option) => option.id === task.progress[step.id]?.choiceId),
  );
  const choice = choiceStep?.options?.find(
    (option) => option.id === task.progress[choiceStep.id].choiceId,
  );
  const evidence = template.steps.find((step) => step.items && step.resolution === 'consequential');
  const resultKind =
    task.outcome?.kind === 'temporary'
      ? 'temporary'
      : task.outcome?.systemChanged === true
        ? 'system'
        : task.outcome
          ? 'evidence'
          : 'finished';
  const ResultIcon =
    resultKind === 'temporary' ? ShieldAlert : resultKind === 'evidence' ? FileCheck2 : Trophy;
  const completed = template.steps.filter(
    (s) => task.progress[s.id]?.status === 'completed',
  ).length;
  const delta = task.taskElapsedMinutes - template.estimate;
  return {
    w,
    task,
    t,
    template,
    choiceStep,
    choice,
    evidence,
    resultKind,
    ResultIcon,
    completed,
    delta,
  };
}
