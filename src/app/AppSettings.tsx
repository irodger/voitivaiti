import { useWorld } from '../world/store';
import { useI18n, usePreferences } from '../content/localization';
import { ProfileName } from '../play/ProfileName';
import { ThemeSettings } from '../play/ThemeSettings';
import { AudioSettings } from '../play/AudioSettings';
import { PwaSettings } from '../play/PwaSettings';
import { Button, Modal } from '../play/shared';
import { readAnalytics } from '../world/analytics';

type AppSettingsProps = {
  confirm: boolean;
  setConfirm: (confirm: boolean) => void;
  onClose: () => void;
  onReset: () => void;
  onToggleMode: () => void;
};

export function AppSettings({ confirm, setConfirm, onClose, onReset, onToggleMode: toggleMode }: AppSettingsProps) {
  const hasCharacter = useWorld(w => !!w.company && !!w.characters.find(c => c.id === w.activeCharacterId));
  const { t, locale, contentMode } = useI18n();
  const prefs = usePreferences();
const exportEvents=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(readAnalytics(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='voiti-vaiti-events.json';a.click();URL.revokeObjectURL(url);};
  return <Modal title={t(confirm?'ui.resetTitle':'ui.settings')} onClose={onClose}>{confirm?<>
    <p>{t('ui.resetBody')}</p>
    <div className="modal-actions">
    <Button secondary onClick={()=>setConfirm(false)}>{t('ui.cancel')}</Button>
    <Button onClick={onReset}>{t('ui.resetYes')}</Button>
    </div>
    </>:<>{hasCharacter&&<ProfileName/>}<label className="setting-row">{t('ui.language')}<select value={locale} onChange={e=>prefs.setLocale(e.target.value as 'ru'|'en')}>
    <option value="ru">Русский</option>
    <option value="en">English</option>
    </select>
    </label>
    <div className="setting-row">{t('ui.content')}<button className="world-secondary" onClick={toggleMode}>{t(contentMode==='clean'?'ui.clean':'ui.adult')}</button>
    </div>
    <p className="fine-print">{t('ui.saved')}</p>
    <ThemeSettings/>
    <AudioSettings/>
    <hr/>
    <PwaSettings/>
    <hr/>
    <h3>{t('ui.analytics')}</h3>
    <p>{t('ui.analyticsCopy')}</p>
    <Button secondary onClick={exportEvents}>{t('ui.exportEvents')}</Button>
    <button className="reset-button" onClick={()=>setConfirm(true)}>{t('ui.reset')}</button>
    </>}</Modal>;
}
