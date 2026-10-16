import { AudioSettings } from '../play/AudioSettings';
import { ProfileName } from '../play/ProfileName';
import { PwaSettings } from '../play/PwaSettings';
import { Button, Modal } from '../play/shared';
import { ThemeSettings } from '../play/ThemeSettings';
import { useAppSettings, type AppSettingsProps } from './useAppSettings';

export function AppSettings({
  confirm,
  setConfirm,
  onClose,
  onReset,
  onToggleMode: toggleMode,
}: AppSettingsProps) {
  const { hasCharacter, t, locale, contentMode, prefs, exportEvents } = useAppSettings();

  return (
    <Modal title={t(confirm ? 'ui.resetTitle' : 'ui.settings')} onClose={onClose}>
      {confirm ? (
        <>
          <p>{t('ui.resetBody')}</p>
          <div className="modal-actions">
            <Button secondary onClick={() => setConfirm(false)}>
              {t('ui.cancel')}
            </Button>
            <Button onClick={onReset}>{t('ui.resetYes')}</Button>
          </div>
        </>
      ) : (
        <>
          {hasCharacter && <ProfileName />}
          <label className="setting-row">
            {t('ui.language')}
            <select value={locale} onChange={(e) => prefs.setLocale(e.target.value as 'ru' | 'en')}>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </label>
          <div className="setting-row">
            {t('ui.content')}
            <button className="world-secondary" onClick={toggleMode}>
              {t(contentMode === 'clean' ? 'ui.clean' : 'ui.adult')}
            </button>
          </div>
          <p className="fine-print">{t('ui.saved')}</p>
          <ThemeSettings />
          <AudioSettings />
          <hr />
          <PwaSettings />
          <hr />
          <h3>{t('ui.analytics')}</h3>
          <p>{t('ui.analyticsCopy')}</p>
          <Button secondary onClick={exportEvents}>
            {t('ui.exportEvents')}
          </Button>
          <button className="reset-button" onClick={() => setConfirm(true)}>
            {t('ui.reset')}
          </button>
        </>
      )}
    </Modal>
  );
}
