import { Clock3, ListTodo } from 'lucide-react';
import { laptopAppOrder } from '../content/laptopTools';
import type { Step } from '../world/types';
import type { LaptopAppId } from './laptopAppIds';
import { formatTime } from './shared';
import { useLaptopNavigation } from './useLaptopNavigation';

export function LaptopNavigation({
  day,
  time,
  board,
  selectedApp,
  step,
  onDesk,
  onApp,
  unreadMail = 0,
}: {
  unreadMail?: number;
  day: number;
  time: number;
  board: boolean;
  selectedApp: LaptopAppId;
  step?: Step;
  onDesk: () => void;
  onApp: (id: LaptopAppId) => void;
}) {
  const { t, tools, BrandIcon } = useLaptopNavigation();
  return (
    <header className="laptop-commandbar">
      <div className="laptop-wordmark">
        <span className="laptop-brand-icon">
          <BrandIcon size={23} />
        </span>
        <div>
          <b>{t('ui.brand')}</b>
          <small>{t('desk.digital')}</small>
        </div>
      </div>
      <nav className="laptop-launcher" aria-label={t('ui.workspace')}>
        <button className={board ? 'active' : ''} aria-pressed={board} onClick={onDesk}>
          <ListTodo size={23} />
          <span>{t('desk.tasks')}</span>
        </button>
        {laptopAppOrder.map((id) => {
          const { Icon, name } = tools.get(id);
          return (
            <button
              key={id}
              className={!board && selectedApp === id ? 'active' : ''}
              aria-pressed={!board && selectedApp === id}
              title={t(
                id === 'mail'
                  ? 'mail.title'
                  : step?.app === id
                    ? 'workspace.currentApp'
                    : 'workspace.referenceApp',
              )}
              onClick={() => onApp(id)}
            >
              <Icon size={23} />
              <span>{name}</span>
              {step?.app === id && <i />}
              {id === 'mail' && unreadMail > 0 && (
                <span className="laptop-mail-badge">{unreadMail}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="laptop-system-clock">
        <small>{t('ui.day', { day: day })}</small>
        <b>
          <Clock3 size={14} />
          {formatTime(time)}
        </b>
      </div>
    </header>
  );
}
