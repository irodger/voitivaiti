import { useI18n } from '../content/localization';
import { useEveningActivities } from '../hooks/useEveningActivities';
import { formatNumber } from '../utils/format';
import { homeState, recovery } from '../world/economy';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useHomeEvening() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const home = homeState(ch);
  const rest = recovery(ch);
  const { t, locale } = useI18n();
  const money = (n: number) => formatNumber(n, locale);
  const {
    ids,
    done,
    available,
    act,
    hasActivity,
    minutes: eveningActivities,
  } = useEveningActivities();
  return { w, ch, home, rest, t, money, ids, done, available, act, hasActivity, eveningActivities };
}
