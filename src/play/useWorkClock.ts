import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import { workClock } from '../world/workClock';
export function useWorkClock(onFinish: () => void) {
  const w = useWorld();
  const { t } = useI18n();
  if (w.phase !== 'office') return null;
  const clock = workClock(w);
  const finish = () => {
    w.dispatch({ type: 'end-day' });
    if (useWorld.getState().phase === 'home') onFinish();
  };
  return { w, t, clock, finish };
}
