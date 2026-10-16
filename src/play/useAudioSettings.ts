import { Volume2, VolumeX } from 'lucide-react';
import { useI18n, usePreferences } from '../content/localization';
export function useAudioSettings() {
    const { t } = useI18n();
    const prefs = usePreferences();
    const Icon = prefs.soundEnabled ? Volume2 : VolumeX;
    return { t, prefs, Icon };
}
