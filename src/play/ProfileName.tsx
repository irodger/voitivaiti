import { text } from '../content/localization';
import { useProfileName } from './useProfileName';
text('profile.default', 'Саша', 'Alex');
text('profile.optional', 'Имя · необязательно', 'Name · optional');
text('profile.change', 'Имя персонажа', 'Character name');
text('profile.save', 'Сохранить имя', 'Save name');
text(
  'profile.hint',
  'Можно оставить пустым — подберём имя. Изменить его можно в настройках.',
  'Leave it blank and we will choose a name. You can change it in settings.',
);
export function ProfileName() {
  const { saveName, ch, t, name, setName } = useProfileName();
  return (
    <div>
      <label htmlFor="profile-name">{t('profile.change')}</label>
      <div className="profile-name">
        <input
          id="profile-name"
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="world-secondary"
          disabled={!name.trim() || name.trim() === ch.name}
          onClick={saveName}
        >
          {t('profile.save')}
        </button>
      </div>
    </div>
  );
}
