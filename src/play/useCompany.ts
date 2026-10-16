import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
export function useCompany() {
  const w = useWorld();
  const co = w.company!;
  const { t } = useI18n();
  const events = [...co.history].reverse();
  return { w, co, t, events };
}
