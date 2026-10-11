import type {LaptopAppId} from './laptopAppIds';
import { Grid2X2, ListTodo, Code2, Globe, Terminal, MessageSquare, Mail, Wifi, BatteryFull } from 'lucide-react';
import { useI18n } from '../content/localization';
import { formatTime } from './shared';


const apps = [{ id: 'ide' as LaptopAppId, Icon: Code2 }, { id: 'browser' as LaptopAppId, Icon: Globe }, { id: 'console' as LaptopAppId, Icon: Terminal }, { id: 'chat' as LaptopAppId, Icon: MessageSquare }, { id: 'mail' as LaptopAppId, Icon: Mail }];

export function LaptopTaskbar({ board, selectedApp, time, onDesk, onApp }: {
    board: boolean; selectedApp: LaptopAppId; time: number; onDesk: () => void; onApp: (id: LaptopAppId) => void;
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
