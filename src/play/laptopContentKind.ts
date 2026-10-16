import type { Campaign, Step, Task } from '../world/types';
import type { LaptopAppId } from './laptopAppIds';
export type LaptopLocation = { board: boolean; app: LaptopAppId; view: Step | null };
/** Preserve screen precedence: mail can be read even while a reward is pending. */
export function laptopContentKind(
  location: LaptopLocation,
  phase: Campaign['phase'],
  task?: Task,
  step?: Step,
) {
  if (!location.board && location.app === 'mail') return 'mail';
  if (phase === 'reward' && task?.rewarded) return 'reward';
  if (location.board) return 'desk';
  if (!task) return 'empty';
  if (task.rewarded && !location.view) return 'finished';
  if (task.status === 'blocked') return 'blocked';
  if (location.view) return 'history';
  return step && location.app === step.app ? 'step' : 'reference';
}
