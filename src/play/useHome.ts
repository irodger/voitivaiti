import { useRef, useState } from 'react';
import { gameConfig } from '../config/game';
import { useI18n } from '../content/localization';
import { useScrollReset } from '../hooks/useScrollReset';
import { formatNumber } from '../utils/format';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useHome() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const { t, locale } = useI18n();
  const [view, setView] = useState<'evening' | 'shop' | 'market'>('evening');
  const panelRef = useRef<HTMLDivElement>(null);
  useScrollReset(panelRef, view);
  const money = (n: number) => formatNumber(n, locale);
  const openView = (next: 'shop' | 'market') => {
    setView(next);
    if (window.matchMedia(gameConfig.ui.compactQuery).matches)
      requestAnimationFrame(() =>
        document
          .querySelector('.home-panel')
          ?.scrollIntoView({ block: 'start', behavior: 'smooth' }),
      );
  };
  const openMarket = () => {
    const parcel = ch.orders?.find((o) => !o.received && o.deliveryDay <= w.life!.calendarDay);
    if (w.phase === 'home' && parcel)
      w.dispatch({ type: 'inspect-delivery', itemId: parcel.itemId });
    else openView('market');
  };
  return { openMarket, w, ch, t, view, setView, panelRef, money, openView };
}
