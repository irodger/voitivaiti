import { useState } from 'react';
import { useI18n } from '../content/localization';
import { resolveTaskTemplate } from '../content/scenarios';
import { useWorld } from '../world/store';
export function useDayReport() {
  const w = useWorld();
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const report = w.life?.dayReport;
  if (
    !report ||
    report.companyId !== w.company?.id ||
    report.characterId !== w.activeCharacterId ||
    report.calendarDay !== w.life?.calendarDay
  )
    return null;
  const task = w.tasks.find((task) => task.id === selected);
  const scene = task && resolveTaskTemplate(task);
  const completedSteps =
    scene?.steps.filter((step) => task?.progress[step.id]?.status === 'completed') ?? [];
  const observations =
    scene && task
      ? scene.steps.flatMap((step) =>
          (task.progress[step.id]?.actionHistory ?? []).flatMap((id) => {
            const action = step.actionFlow?.actions.find((a) => a.id === id);
            return action ? [{ action, progress: task.progress[step.id] }] : [];
          }),
        )
      : [];
  return { w, t, setSelected, report, task, scene, completedSteps, observations };
}
