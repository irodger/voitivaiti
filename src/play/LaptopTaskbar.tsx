import { BatteryFull, Grid2X2, ListTodo, Wifi } from 'lucide-react';
import { laptopAppOrder } from '../content/laptopTools';
import type { LaptopAppId } from './laptopAppIds';
import { formatTime } from './shared';
import { useLaptopTaskbar } from './useLaptopTaskbar';

export function LaptopTaskbar({
  board,
  selectedApp,
  time,
  onDesk,
  onApp,
}: {
  board: boolean;
  selectedApp: LaptopAppId;
  time: number;
  onDesk: () => void;
  onApp: (id: LaptopAppId) => void;
}) {
  const { t, tools } = useLaptopTaskbar();

  return (
    <footer className="laptop-taskbar">
      <nav aria-label={t('ui.workspace')}>
        <button
          className={board ? 'active' : ''}
          aria-pressed={board}
          aria-label={t('desk.tasks')}
          title={t('desk.tasks')}
          onClick={onDesk}
        >
          <Grid2X2 size={17} />
          <ListTodo size={16} />
        </button>
        {laptopAppOrder.map((id) => {
          const { Icon, name } = tools.get(id);
          return (
            <button
              key={id}
              className={!board && selectedApp === id ? 'active' : ''}
              aria-pressed={!board && selectedApp === id}
              aria-label={name}
              title={name}
              onClick={() => onApp(id)}
            >
              <Icon size={17} />
            </button>
          );
        })}
      </nav>
      <div className="laptop-taskbar-status">
        <Wifi size={13} aria-hidden="true" />
        <BatteryFull size={16} aria-hidden="true" />
        <time>{formatTime(time)}</time>
      </div>
    </footer>
  );
}
