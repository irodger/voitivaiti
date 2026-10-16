import { useI18n } from '../content/localization';
import { morningBriefing } from '../world/morningBriefing';
import { useWorld } from '../world/store';
export function useMorningBriefing() {
    const w = useWorld();
    const { t, locale } = useI18n();
    const brief = morningBriefing(w);
    if (!brief)
        return null;
    return { t, locale, brief };
}
