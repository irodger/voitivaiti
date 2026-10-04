import { LaptopNavigation } from './LaptopNavigation';
import { useModalInteraction } from '../hooks/useModalInteraction';
import { useScrollReset } from '../hooks/useScrollReset';
import { LaptopAppHeader } from './LaptopAppHeader';
import { WorkDesk } from './WorkDesk';
import { ActionPanel } from './ActionDock';
import '../content/workspaceUx';
import './workspaceUx.css';
import './laptopApps.css';
import './laptopShell.css';
import { AppContext } from './AppContext';
import { resolveTaskTemplate } from '../content/scenarios';
import { TaskResult } from './TaskResult';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { X, LockKeyhole, Check } from 'lucide-react';
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
    useScrollReset(contentRef, [step?.id, task?.id, app, view?.id, board].join(':'));
    return <motion.div className="laptop-backdrop" style={{ pointerEvents: present ? 'auto' : 'none' }} initial={{ backgroundColor: '#17231d00', backdropFilter: 'blur(0px)' }} animate={{ backgroundColor: '#17231d99', backdropFilter: 'blur(8px)' }} exit={{ backgroundColor: '#17231d00', backdropFilter: 'blur(0px)' }} onClick={e => { if (e.target === e.currentTarget)
        onClose(); }}><motion.div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t('ui.laptop')} className="laptop-shell" layoutId="player-laptop" transition={{ type: 'spring', stiffness: 280, damping: 32 }}><div className="laptop-bezel"><i className="camera"/><span>almost.ready</span><button onClick={onClose} aria-label={t('ui.close')}><X size={18}/></button></div><div className="laptop-display" data-app={board ? 'browser' : view?.app ?? app} data-workdesk={board ? "true" : "false"}><LaptopNavigation day={world.company!.currentDay} time={world.time} board={board} selectedApp={view?.app ?? app} step={step} onDesk={() => { setBoard(true); setView(null); }} onApp={id => { setBoard(false); setApp(id); setView(null); }}/><div className="laptop-body"><aside className="laptop-apps">{template && <div className="laptop-step-list" aria-label={t('workspace.steps')}><p className="laptop-steps-label">{t('workspace.steps')}</p>{template.steps.filter(s => task!.progress[s.id].status !== 'locked').map(s => <button key={s.id} disabled={task!.progress[s.id].status === 'locked'} className={s.id === step?.id ? 'current' : ''} aria-current={s.id === step?.id ? 'step' : undefined} onClick={() => { setBoard(false); if (s.id === step?.id) {
        setView(null);
        setApp(s.app);
    }
    else
        setView(s); }}>{task!.progress[s.id].status === 'completed' ? <Check size={13}/> : task!.progress[s.id].status === 'locked' ? <LockKeyhole size={12}/> : <i className="live-dot"/>}<span>{t(s.titleKey)}</span></button>)}</div>}</aside>{!board && template && task && !task.rewarded && <label className="laptop-mobile-steps"><span>{t('workspace.steps')}</span><select aria-label={t('workspace.steps')} value={view?.id ?? step?.id ?? ''} onChange={e => { const selected = template.steps.find(s => s.id === e.target.value); if (!selected)
        return; if (selected.id === step?.id) {
        setView(null);
        setApp(selected.app);
    }
    else
        setView(selected); }}>{template.steps.filter(s => task.progress[s.id].status !== 'locked').map(s => <option key={s.id} value={s.id}>{task.progress[s.id].status === 'completed' ? '✓ ' : ''}{t(s.titleKey)}{s.id === step?.id ? ` · ${t('workspace.currentStep')}` : ''}</option>)}</select></label>}<ActionPanel className="laptop-workspace"><div className="laptop-content" ref={contentRef}>{!board && task && world.phase !== 'reward' && template && <LaptopAppHeader app={view?.app ?? app} task={task} steps={template.steps} view={view} onDesk={() => { setBoard(true); setView(null); }}/>}<AnimatePresence mode="wait"><motion.div key={board ? 'desk' : view?.id ?? `${task?.currentStepId}-${app}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}>{world.phase === 'reward' && task?.rewarded ? <TaskResult closeLabel="desk.back" onClose={() => { world.dispatch({ type: 'reward-close' }); setBoard(true); setView(null); }}/> : board ? <WorkDesk onOffice={onClose} onResume={() => { setBoard(false); setView(null); if (step)
        setApp(step.app); }}/> : !task ? <div className="empty-app"><h2>{t('ui.' + app)}</h2><p>{t('appPurpose.' + app)}</p><Button onClick={() => setBoard(true)}>{t('desk.back')}</Button></div> : task.rewarded && !view ? <AppContext app={app} task={task} onContinue={() => setBoard(true)}/> : task.status === 'blocked' ? <div className="empty-app"><LockKeyhole size={40}/><p>{t('ui.taskBlocked')}</p><Button onClick={() => setBoard(true)}>{t('desk.back')}</Button></div> : view ? <><div className="laptop-history-notice"><p className="read-only-notice">{t('ui.readOnly')}</p><button className="world-secondary" onClick={() => { setView(null); if (step)
        setApp(step.app); }}>{t('workspace.resumeStep')}</button></div><StepRenderer step={view} readOnly viewProgress={task.progress[view.id]}/></> : step && app === step.app ? <StepRenderer step={step}/> : <AppContext app={app} task={task} onContinue={() => setApp(step!.app)}/>}</motion.div></AnimatePresence></div></ActionPanel></div></div><div className="laptop-chin"><span>{t('ui.brand')}</span></div><div className="laptop-base"><i /></div></motion.div></motion.div>;
}
