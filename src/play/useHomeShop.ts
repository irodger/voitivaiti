import { useI18n } from '../content/localization';
import { formatNumber } from '../utils/format';
import { homeState } from '../world/economy';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useHomeShop() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const home = homeState(ch);
  const { t, locale } = useI18n();
  const money = (n: number) => formatNumber(n, locale);
  return { w, ch, home, t, money };
}
