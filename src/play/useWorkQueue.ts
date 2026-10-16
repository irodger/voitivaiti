import { useState } from 'react';
import { gameConfig } from '../config/game';
import { useI18n } from '../content/localization';
import type { WorkKind } from '../world/lifeTypes';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useWorkQueue() {
    const w = useWorld();
    const { t } = useI18n();
    const ch = activeCharacter(w);
    const [chosen, setChosen] = useState<WorkKind | null>(null);
    const l = w.life;
    if (!l)
        return null;
    if (l.reviewDue || w.time >= gameConfig.clock.lastTaskStart || w.schedule.some(e => e.type === 'sync' && e.status === 'pending'))
        return null;
    const selected = l.queue.find(q => q.status === 'selected' && !q.delegatedTo);
    return { w, t, ch, chosen, setChosen, l, selected };
}
