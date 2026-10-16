import { Clock3, Settings2 } from 'lucide-react';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { ProfessionIcon } from '../components/ProfessionIcon';
import { professionById } from '../content/professions';
import { VersionPanel } from '../play/VersionPanel';
import { formatCalendarDate, formatTime } from '../utils/format';
import { useAppHeader } from './useAppHeader';

export function AppHeader() {
  const { onboarding, toggleMode, openSettings, w, t, locale, contentMode, ch } = useAppHeader();

  return (
    <header className="app-header">
      <div className="header-brand-group">
        <div className="brand">
          <img
            className="brand-logo"
            src={`${import.meta.env.BASE_URL}brand-logo.png`}
            alt=""
            width={52}
            height={52}
          />
          <span>
            {t('ui.brand')}
            <small>{t('ui.tagline')}</small>
          </span>
        </div>
        <button
          className={`adult-toggle ${contentMode === 'adult' ? 'enabled' : ''}`}
          aria-label={t('ui.content')}
          aria-pressed={contentMode === 'adult'}
          onClick={toggleMode}
        >
          18+
        </button>
      </div>
      {ch ? (
        <>
          <div className="header-clock" title={t('time.clockHint')}>
            <i className="live-dot" />
            <b>{t('ui.day', { day: w.company!.currentDay })}</b>
            <Clock3 size={14} />
            <span>{formatTime(w.time)}</span>
            {w.life && (
              <small className="header-calendar">
                {t('time.calendar', { date: formatCalendarDate(w.life.calendarDay, locale) })}
              </small>
            )}
          </div>
          <div className="header-player">
            <div>
              <b>{ch.name}</b>
              <small>
                {t(
                  professionById[ch.profession].careers.find((n) => n.id === ch.careerNodeId)!
                    .titleKey,
                )}
              </small>
            </div>
            <span className="header-profession-icon">
              <ProfessionIcon profession={ch.profession} size={32} />
            </span>
            <CharacterAvatar id={ch.avatarId} size={38} />
          </div>
        </>
      ) : (
        <span className="header-caption">{t('ui.introNote')}</span>
      )}
      <div className="header-actions">
        <button
          className="icon-button settings-button"
          aria-label={t('ui.settings')}
          onClick={openSettings}
        >
          <Settings2 size={20} />
        </button>
        <VersionPanel autoOpen={!onboarding} />
      </div>
    </header>
  );
}
