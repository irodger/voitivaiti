import { Clock3, ListTodo, Code2, Globe, Terminal, MessageSquare } from 'lucide-react';
import { useI18n } from '../content/localization';
import { formatTime } from './shared';
import type { AppId, Step } from '../world/types';
const apps = [{ id: 'ide' as AppId, Icon: Code2 }, { id: 'browser' as AppId, Icon: Globe }, { id: 'console' as AppId, Icon: Terminal }, { id: 'chat' as AppId, Icon: MessageSquare }];
export function LaptopNavigation({ day, time, board, selectedApp, step, onDesk, onApp }: {
    day: number;
    time: number;
    board: boolean;
    selectedApp: AppId;
    step?: Step;
    onDesk: () => void;
    onApp: (id: AppId) => void;
}) { const { t } = useI18n(); return <header className="laptop-commandbar"><div className="laptop-wordmark"><span className="laptop-brand-icon"><Code2 size={23}/></span><div><b>{t('ui.brand')}</b><small>{t('desk.digital')}</small></div></div><nav className="laptop-launcher" aria-label={t('ui.workspace')}><button className={board ? 'active' : ''} aria-pressed={board} onClick={onDesk}><ListTodo size={23}/><span>{t('desk.tasks')}</span></button>{apps.map(({ id, Icon }) => <button key={id} className={!board && (selectedApp) === id ? 'active' : ''} aria-pressed={!board && (selectedApp) === id} title={t(step?.app === id ? 'workspace.currentApp' : 'workspace.referenceApp')} onClick={() => onApp(id)}><Icon size={23}/><span>{t(`ui.${id}`)}</span>{step?.app === id && <i />}</button>)}</nav><div className="laptop-system-clock"><small>{t('ui.day', { day: day })}</small><b><Clock3 size={14}/>{formatTime(time)}</b></div></header>; }
