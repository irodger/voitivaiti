import { useI18n } from '../content/localization';
import type { WorkKind } from '../world/lifeTypes';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import { availableWork } from '../world/workLoop';
export function usePriorityImpact(props: { chosen: WorkKind }) {
  const { chosen } = props;
  const w = useWorld();
  const { t } = useI18n();
  const allowed = availableWork(activeCharacter(w));
  const waiting =
    w.life?.queue.filter(
      (q) => q.id !== chosen && q.status !== 'done' && !q.delegatedTo && allowed.includes(q.id),
    ) ?? [];
  if (!waiting.length) return null;
  return { w, t, waiting };
}
