import {appHasEvidence} from './appEvidence';
import {WorkClock} from './WorkClock';
import {FirstRunGuide} from './FirstRunGuide';
import {TaskJourney} from './StageJourney';
import { LaptopNavigation } from './LaptopNavigation';
import { useModalInteraction } from '../hooks/useModalInteraction';
import { useWorkspaceScroll } from '../hooks/useWorkspaceScroll';
import { LaptopAppHeader } from './LaptopAppHeader';
import { WorkDesk } from './WorkDesk';
import { ActionPanel } from './ActionDock';
import '../content/workspaceUx';
import './workspaceUx.css';
import './laptopApps.css';
import './laptopShell.css';
import './laptopDevices.css';
import { laptopFamily } from './laptopDevices';
import { LaptopTaskbar } from './LaptopTaskbar';
import { AppContext } from './AppContext';
import { resolveTaskTemplate } from '../content/scenarios';
import { TaskResult } from './TaskResult';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { X, LockKeyhole } from 'lucide-react';
import { useWorld } from '../world/store';
import { activeTask } from '../world/simulation';
import { useI18n } from '../content/localization';
import type { AppId, Step } from '../world/types';
import { StepRenderer } from './Mechanic';
import { Button } from './shared';
export function Laptop({ onClose }: {
    onClose: () => void;
}) {
    const present = useIsPresent(), world = useWorld(), { t } = useI18n(), task = activeTask(world), template = task ? resolveTaskTemplate(task) : undefined, step = template?.steps.find(s => s.id === task?.currentStepId), [app, setApp] = useState<AppId>(step?.app ?? 'ide'), [view, setView] = useState<Step | null>(null), [board, setBoard] = useState(!task || task.rewarded && world.phase !== 'reward'), ref = useRef<HTMLDivElement>(null), contentRef = useRef<HTMLDivElement>(null);
    const device = laptopFamily(world.characters.find(ch => ch.id === world.activeCharacterId)?.profession ?? '');
    const openDesk = () => { setBoard(true); setView(null); };
    const openApp = (id: AppId) => { setBoard(false); setApp(id); setView(null); };
    useModalInteraction(ref, onClose);
    useEffect(() => { if (step && !task?.rewarded) {
        setView(null);
        setBoard(false);
        setApp(step.app);
    }
    else if (task?.rewarded) {
        setView(null);
        setBoard(true);
    } }, [step?.id, task?.id, task?.rewarded]);
    useWorkspaceScroll(contentRef, [step?.id, task?.id, app, view?.id, board].join(':'), !board && !view && !task?.rewarded && world.phase !== 'reward' && app === step?.app ? step?.id : undefined);
    return <motion.div className="laptop-backdrop" style={{ pointerEvents: present ? 'auto' : 'none' }} initial={{ backgroundColor: '#17231d00', backdropFilter: 'blur(0px)' }} animate={{ backgroundColor: '#17231d99', backdropFilter: 'blur(8px)' }} exit={{ backgroundColor: '#17231d00', backdropFilter: 'blur(0px)' }} onClick={e => { if (e.target === e.currentTarget)
        onClose(); }}><motion.div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t('ui.laptop')} className="laptop-shell" data-device={device} layoutId="player-laptop" transition={{ type: 'spring', stiffness: 280, damping: 32 }}><div className="laptop-bezel"><i className="camera"/><span>almost.ready</span><button onClick={onClose} aria-label={t('ui.close')}><X size={18}/></button></div><div className="laptop-display" data-app={board ? 'browser' : view?.app ?? app} data-workdesk={board ? "true" : "false"}><LaptopNavigation day={world.company!.currentDay} time={world.time} board={board} selectedApp={view?.app ?? app} step={step} onDesk={openDesk} onApp={openApp}/><div className="laptop-body"><ActionPanel className="laptop-workspace"><div className="laptop-content" ref={contentRef}><WorkClock onFinish={onClose}/><FirstRunGuide compact/>{!board&&task&&template&&world.phase!=='reward'&&<TaskJourney compact task={task} steps={template.steps} selectedId={view?.id??step?.id??''} onSelect={selected=>{if(selected.id===step?.id){setView(null);setApp(selected.app);}else setView(selected);}}/>}{!board && task && world.phase !== 'reward' && template && <LaptopAppHeader emptyReference={!view&&app!==step?.app&&!appHasEvidence(task,app)} onCurrent={()=>{setView(null);if(step)setApp(step.app);}} app={view?.app ?? app} task={task} steps={template.steps} view={view} onDesk={() => { setBoard(true); setView(null); }}/>}<AnimatePresence mode="wait"><motion.div key={board ? 'desk' : view?.id ?? `${task?.currentStepId}-${app}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}>{world.phase === 'reward' && task?.rewarded ? <TaskResult closeLabel="desk.back" onClose={() => { world.dispatch({ type: 'reward-close' }); setBoard(true); setView(null); }}/> : board ? <WorkDesk onOffice={onClose} onResume={() => { setBoard(false); setView(null); if (step)
        setApp(step.app); }}/> : !task ? <div className="empty-app"><h2>{t('ui.' + app)}</h2><p>{t('appPurpose.' + app)}</p><Button onClick={() => setBoard(true)}>{t('desk.back')}</Button></div> : task.rewarded && !view ? <AppContext app={app} task={task} onContinue={() => setBoard(true)}/> : task.status === 'blocked' ? <div className="empty-app"><LockKeyhole size={40}/><p>{t('ui.taskBlocked')}</p><Button onClick={() => setBoard(true)}>{t('desk.back')}</Button></div> : view ? <><div className="laptop-history-notice"><p className="read-only-notice">{t('ui.readOnly')}</p><button className="world-secondary" onClick={() => { setView(null); if (step)
        setApp(step.app); }}>{t('workspace.resumeStep')}</button></div><StepRenderer step={view} readOnly viewProgress={task.progress[view.id]}/></> : step && app === step.app ? <StepRenderer step={step}/> : <AppContext app={app} task={task} onContinue={() => setApp(step!.app)}/>}</motion.div></AnimatePresence></div></ActionPanel></div>{device !== 'PacBook' && <LaptopTaskbar board={board} selectedApp={view?.app ?? app} time={world.time} onDesk={openDesk} onApp={openApp}/>}</div><div className="laptop-chin"><span>{device}</span></div><div className="laptop-base"><i /></div></motion.div></motion.div>;
}
