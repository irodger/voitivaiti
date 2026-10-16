import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useMarketplace() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const { t, locale } = useI18n();
  const orders = ch.orders ?? [];
  const pending = orders.filter((o) => !o.received);
  const money = (n: number) => n.toLocaleString(locale);
  return { w, ch, t, orders, pending, money };
}
