import { useI18n } from '../content/localization';
import { homeState, recovery } from '../world/economy';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useFirstEveningGuide() {
    const w = useWorld();
    const ch = activeCharacter(w);
    const { t, locale } = useI18n();
    if (w.phase !== 'home' || !ch.firstDay?.onboardingCompleted || w.life?.characterPlayedDays !== 1)
        return null;
    const home = homeState(ch);
    const rest = recovery(ch);
    return { w, ch, t, locale, home, rest };
}
