import { useAppActions } from '../hooks/useAppActions';
import { useI18n } from '../content/localization';
import { taskContext } from '../utils/taskContext';
import { deskAvailability } from '../world/deskAvailability';
import { activeCharacter, activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
export function useOfficeBrief() {
  const { openLaptop, openTeam } = useAppActions();
  const w = useWorld();
  const { t } = useI18n();
  const ch = activeCharacter(w);
  const state = deskAvailability(w);
  const task = activeTask(w);
  const { template, step: current, done } = taskContext(task && !task.rewarded ? task : undefined);
  const reason =
    state.reason === 'current'
      ? 'current'
      : state.reason === 'sync'
        ? 'sync'
        : state.reason === 'review'
          ? 'review'
          : state.reason === 'waiting'
            ? 'waiting'
            : state.reason === 'empty'
              ? 'empty'
              : state.reason === 'late'
                ? 'late'
                : 'ready';
  const showCurrent = reason === 'current' && template;
  return {
    openLaptop,
    openTeam,
    w,
    t,
    ch,
    state,
    task,
    template,
    current,
    done,
    reason,
    showCurrent,
  };
}
