import { useI18n } from '../content/localization';
import { recovery } from '../world/economy';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useHomeStatus() {
  const ch = useWorld((w) => activeCharacter(w));
  const { t } = useI18n();
  const rest = recovery(ch);
  return { ch, t, rest };
}
