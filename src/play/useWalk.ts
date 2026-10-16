import { useEffect } from 'react';
import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import { availableWalkRoutes, currentWalk, walkRoutes } from '../world/walk';
export function useWalk() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const { t } = useI18n();
  const outing = currentWalk(ch, w.company!.currentDay)!;
  const available = availableWalkRoutes(ch, w.company!.currentDay, w.time);
  const route = walkRoutes.find((r) => r.id === outing.routeId);
  const finished = outing.status === 'finished';
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('[role="dialog"]'))
        w.dispatch({ type: 'end-walk' });
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [w.dispatch]);
  const choose = (id: string) => w.dispatch({ type: 'walk-route', id });
  const returnHome = () => w.dispatch({ type: 'end-walk' });
  return { w, ch, t, outing, available, route, finished, choose, returnHome };
}
