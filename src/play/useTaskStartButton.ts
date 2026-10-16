import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useTaskStartButton() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const { t } = useI18n();
  return { w, ch, t };
}
