import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
export function useDelegationResults() {
  const w = useWorld();
  const { t } = useI18n();
  const results =
    w.company?.delegations?.filter(
      (d) => d.actorId === w.activeCharacterId && d.status === 'returned',
    ) ?? [];
  if (!results.length) return null;
  return { w, t, results };
}
