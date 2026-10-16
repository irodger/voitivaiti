import { useI18n } from '../content/localization';
import { colleagueWorkMemory } from '../world/colleagueWorkMemory';
import { useWorld } from '../world/store';
export function useColleagueWorkMemory(props: { npcId: string }) {
  const { npcId } = props;
  const w = useWorld();
  const { t, locale } = useI18n();
  const memories = colleagueWorkMemory(w, npcId);
  return { t, locale, memories };
}
