import { useI18n } from '../content/localization';
import { useEveningActivities } from '../hooks/useEveningActivities';
import { homeState } from '../world/economy';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import { dayPhase } from '../world/workLoop';
export function useApartmentScene() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const { t } = useI18n();
  const owned = homeState(ch).owned;
  const phase = dayPhase(w.time);
  const atHome = w.phase === 'home';
  const { done, available, act, hasActivity, minutes: eveningActivities } = useEveningActivities();
  const parcels = (ch.orders ?? []).filter(
    (o) => !o.received && o.deliveryDay <= w.life!.calendarDay,
  );
  return {
    w,
    t,
    owned,
    phase,
    atHome,
    done,
    available,
    act,
    hasActivity,
    eveningActivities,
    parcels,
  };
}
