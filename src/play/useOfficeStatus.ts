import { useAppActions } from '../hooks/useAppActions';
import { useI18n } from '../content/localization';
import { taskContext } from '../utils/taskContext';
import { deskAvailability } from '../world/deskAvailability';
import { activeCharacter, activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
export function useOfficeStatus() {
  const { openLaptop } = useAppActions();
  const w = useWorld();
  const { t } = useI18n();
  const task = activeTask(w);
  const { template: current } = taskContext(task && !task.rewarded ? task : undefined);
  const ch = activeCharacter(w);
  const queue = deskAvailability(w).eligible.length;
  return { openLaptop, w, t, current, ch, queue };
}
