import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import { availableWork, workOwner } from '../world/workLoop';
export function useWorkExpectations(props: { npcId?: string }) {
  const { npcId } = props;
  const w = useWorld();
  const { t, locale } = useI18n();
  const ch = activeCharacter(w);
  const waiting =
    w.life?.queue.filter(
      (q) =>
        (!npcId || workOwner[q.id] === npcId) &&
        q.expectation &&
        q.status !== 'done' &&
        !q.delegatedTo &&
        availableWork(ch).includes(q.id),
    ) ?? [];
  if (!waiting.length) return null;
  return { w, t, locale, waiting };
}
