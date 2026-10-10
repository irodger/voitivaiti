import { Grid2X2, ListTodo, Code2, Globe, Terminal, MessageSquare, Wifi, BatteryFull } from 'lucide-react';
import { useI18n } from '../content/localization';
import { formatTime } from './shared';
import type { AppId } from '../world/types';

const apps = [{ id: 'ide' as AppId, Icon: Code2 }, { id: 'browser' as AppId, Icon: Globe }, { id: 'console' as AppId, Icon: Terminal }, { id: 'chat' as AppId, Icon: MessageSquare }];

export function LaptopTaskbar({ board, selectedApp, time, onDesk, onApp }: {
    board: boolean; selectedApp: AppId; time: number; onDesk: () => void; onApp: (id: AppId) => void;
}) {
    const { t } = useI18n();
    return <footer className="laptop-taskbar">
        <nav aria-label={t('ui.workspace')}>
            <button className={board ? 'active' : ''} aria-pressed={board} aria-label={t('desk.tasks')} title={t('desk.tasks')} onClick={onDesk}><Grid2X2 size={17}/><ListTodo size={16}/></button>
            {apps.map(({ id, Icon }) => <button key={id} className={!board && selectedApp === id ? 'active' : ''} aria-pressed={!board && selectedApp === id} aria-label={t('ui.' + id)} title={t('ui.' + id)} onClick={() => onApp(id)}><Icon size={17}/></button>)}
        </nav>
        <div className="laptop-taskbar-status"><Wifi size={13} aria-hidden="true"/><BatteryFull size={16} aria-hidden="true"/><time>{formatTime(time)}</time></div>
    </footer>;
}
