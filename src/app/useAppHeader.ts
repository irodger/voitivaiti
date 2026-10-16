import { useAppActions } from '../hooks/useAppActions';
import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/selectors';
import { useWorld } from '../world/store';
export function useAppHeader() {
  const { toggleMode, openSettings } = useAppActions();
  const w = useWorld();
  const { t, locale, contentMode } = useI18n();
  const ch = w.company ? activeCharacter(w) : undefined;
  return {
    onboarding: w.phase === 'start' || w.phase === 'create',
    toggleMode,
    openSettings,
    w,
    t,
    locale,
    contentMode,
    ch,
  };
}
