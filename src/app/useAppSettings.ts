import { useI18n, usePreferences } from '../content/localization';
import { readAnalytics } from '../world/analytics';
import { useWorld } from '../world/store';
export type AppSettingsProps = {
  confirm: boolean;
  setConfirm: (confirm: boolean) => void;
  onClose: () => void;
  onReset: () => void;
  onToggleMode: () => void;
};
export function useAppSettings() {
  const hasCharacter = useWorld(
    (w) => !!w.company && !!w.characters.find((c) => c.id === w.activeCharacterId),
  );
  const { t, locale, contentMode } = useI18n();
  const prefs = usePreferences();
  const exportEvents = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(readAnalytics(), null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voiti-vaiti-events.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  return { hasCharacter, t, locale, contentMode, prefs, exportEvents };
}
