import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/selectors';
import { useWorld } from '../world/store';
export type AppHeaderProps = {
  onboarding: boolean;
  onToggleMode: () => void;
  onSettings: () => void;
};
export function useAppHeader() {
  const w = useWorld();
  const { t, locale, contentMode } = useI18n();
  const ch = w.company ? activeCharacter(w) : undefined;
  return { w, t, locale, contentMode, ch };
}
