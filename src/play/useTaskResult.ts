import { FileCheck2, ShieldAlert, Trophy } from 'lucide-react';
import { useI18n } from '../content/localization';
import { taskContext } from '../utils/taskContext';
import { activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
export function useTaskResult() {
  const w = useWorld();
  const task = activeTask(w);
  const { t } = useI18n();
  if (!task) return null;
  const { template, done: completed } = taskContext(task);
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
