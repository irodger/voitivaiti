import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
export function useWaitingWork() {
  const w = useWorld();
  const { t, locale } = useI18n();
  return { w, t, locale };
}
