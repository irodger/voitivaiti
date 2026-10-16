import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useHud() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const { t, locale } = useI18n();
  return { ch, t, locale };
}
