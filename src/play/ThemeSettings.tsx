import { Check, Palette } from 'lucide-react';
import { text } from '../content/localization';
import { useThemeSettings } from './useThemeSettings';
text('theme.title', 'Цветовая схема', 'Color scheme');
text('theme.green', 'Уютная зелёная', 'Cozy green');
text('theme.violet', 'Фиолетовый и жёлтый', 'Violet and yellow');
export function ThemeSettings() {
  const { t, p } = useThemeSettings();
  return (
    <fieldset className="theme-picker">
      <legend>
        <Palette size={17} /> {t('theme.title')}
      </legend>
      {(['green', 'violet'] as const).map((id) => (
        <button
          type="button"
          key={id}
          aria-pressed={(p.colorScheme ?? 'green') === id}
          onClick={() => p.setColorScheme(id)}
        >
          <span className={'theme-swatches swatches-' + id}>
            <i />
            <i />
          </span>
          <span>{t('theme.' + id)}</span>
          {(p.colorScheme ?? 'green') === id && <Check size={16} />}
        </button>
      ))}
    </fieldset>
  );
}
