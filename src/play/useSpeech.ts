import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
export function useSpeech(speaker: string) {
    const { t } = useI18n();
    const ch = useWorld(s => s.characters.find(c => c.id === speaker));
    return { t, ch };
}
