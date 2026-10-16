import { ArrowLeft,Check } from 'lucide-react';
import { resolveTaskTemplate } from '../content/scenarios';
import '../content/workspaceStudio';
import type { AppId,Step,Task } from '../world/types';
import { AppIllustration } from './AppIllustration';
import { useLaptopAppHeader } from './useLaptopAppHeader';
import './workspaceStudio.css';
export function LaptopAppHeader({app,task,steps,view,onDesk,onCurrent,emptyReference=false}:{app:AppId;task:Task;steps:Step[];view:Step|null;onDesk:()=>void;onCurrent?:()=>void;emptyReference?:boolean}){
const {t,tools,tool,Icon,done,shown}=useLaptopAppHeader({app,task,steps,view});

 return <header className="app-work-header" data-current={!view&&shown?.app===app} data-empty-reference={emptyReference&&shown?.app!==app||undefined}><div className="app-work-top"><button onClick={onDesk}><ArrowLeft size={14}/>{t('desk.tasks')}</button><span>{t(view?'ui.readOnly':shown?.app===app?'workspace.currentApp':'workspace.referenceApp')}</span></div><div className="app-work-identity"><span className="app-work-icon" aria-hidden="true"><Icon size={26}/></span><div><h2>{tool.name}</h2><p>{tool.purpose}</p></div><AppIllustration app={app} editorKind={tools.editorKind}/>{!emptyReference&&<div className="app-work-count"><Check size={14}/><b>{done} / {steps.length}</b><small>{t('workspace.steps')}</small></div>}</div>{!view&&shown&&<div className="studio-app-context"><div><small>{t(shown.app===app?'studio.current':'studio.reference')}</small><b>{shown.app===app?t(shown.titleKey):tools.editorKind==='code'?t('studio.'+app):t(resolveTaskTemplate(task).titleKey)}</b></div>{shown.app!==app&&!emptyReference&&onCurrent&&<button className="world-secondary" onClick={onCurrent}>{t('studio.goCurrent')}</button>}</div>}<div className="app-work-route" aria-label={t('workspace.steps')}>{steps.map(s=><span key={s.id} className={task.progress[s.id]?.status==='completed'?'done':s.id===shown?.id?'current':''} title={t(s.titleKey)}/>)}</div></header>;
}
