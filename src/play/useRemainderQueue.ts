import { useState } from 'react';
import { useI18n } from '../content/localization';
import type { WorkKind } from '../world/lifeTypes';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import { autonomy } from '../world/workLoop';
export function useRemainderQueue() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const { t } = useI18n();
  const [chosen, setChosen] = useState<WorkKind | null>(null);
  const level = autonomy(ch);
  const queue = w.life!.queue;
  const selected = queue.find((q) => q.status === 'selected' && !q.delegatedTo);
  return { w, ch, t, chosen, setChosen, level, queue, selected };
}
