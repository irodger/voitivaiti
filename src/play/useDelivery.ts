import { useEffect, useRef } from 'react';
import { useI18n } from '../content/localization';
import { currentDelivery } from '../world/delivery';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useDelivery(onBack: (view: 'market' | 'evening') => void) {
    const w = useWorld();
    const ch = activeCharacter(w);
    const { t, locale } = useI18n();
    const delivery = currentDelivery(ch, w.life!.calendarDay)!;
    const { item, order } = delivery;
    const opened = order.received;
    const heading = useRef<HTMLHeadingElement>(null);
    const close = (view: 'market' | 'evening') => { w.dispatch({ type: 'close-delivery' }); onBack(view); };
    useEffect(() => { heading.current?.focus(); }, []);
    useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && !document.querySelector('[role="dialog"]'))
        close('evening'); }; addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey); }, [w.dispatch, onBack]);
    return { w, t, locale, item, opened, heading, close };
}
