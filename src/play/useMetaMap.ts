import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
export function useMetaMap() {
  const w = useWorld();
  const m = w.meta!;
  const { t } = useI18n();
  return { w, m, t };
}
