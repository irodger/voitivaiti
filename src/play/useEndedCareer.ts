import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
export function useEndedCareer() {
  const w = useWorld();
  const { t } = useI18n();
  return { w, t };
}
