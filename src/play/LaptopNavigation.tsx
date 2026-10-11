import type {LaptopAppId} from './laptopAppIds';
import { Clock3, ListTodo, Code2, Globe, Terminal, MessageSquare, Mail } from 'lucide-react';
import { useI18n } from '../content/localization';
import { formatTime } from './shared';
import type { Step } from '../world/types';
const apps = [{ id: 'ide' as LaptopAppId, Icon: Code2 }, { id: 'browser' as LaptopAppId, Icon: Globe }, { id: 'console' as LaptopAppId, Icon: Terminal }, { id: 'chat' as LaptopAppId, Icon: MessageSquare }, { id: 'mail' as LaptopAppId, Icon: Mail }];
export function LaptopNavigation({ day, time, board, selectedApp, step, onDesk, onApp, unreadMail=0 }: {
    unreadMail?:number;
    day: number;
    time: number;
    board: boolean;
    selectedApp: LaptopAppId;
    step?: Step;
    onDesk: () => void;
    onApp: (id: LaptopAppId) => void;
}) { const { t } = useI18n(); return <header className="laptop-commandbar"><div className="laptop-wordmark"><span className="laptop-brand-icon"><Code2 size={23}/></span><div><b>{t('ui.brand')}</b><small>{t('desk.digital')}</small></div></div><nav className="laptop-launcher" aria-label={t('ui.workspace')}><button className={board ? 'active' : ''} aria-pressed={board} onClick={onDesk}><ListTodo size={23}/><span>{t('desk.tasks')}</span></button>{apps.map(({ id, Icon }) => <button key={id} className={!board && (selectedApp) === id ? 'active' : ''} aria-pressed={!board && (selectedApp) === id} title={t(id==='mail'?'mail.title':step?.app === id ? 'workspace.currentApp' : 'workspace.referenceApp')} onClick={() => onApp(id)}><Icon size={23}/><span>{t(`ui.${id}`)}</span>{step?.app === id && <i />}{id==='mail'&&unreadMail>0&&<span className="laptop-mail-badge">{unreadMail}</span>}</button>)}</nav><div className="laptop-system-clock"><small>{t('ui.day', { day: day })}</small><b><Clock3 size={14}/>{formatTime(time)}</b></div></header>; }
