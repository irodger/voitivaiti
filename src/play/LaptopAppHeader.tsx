import {Code2,Globe,Terminal,MessageSquare,ArrowLeft,Check} from 'lucide-react';
import {AppIllustration} from './AppIllustration';
import '../content/workspaceStudio';
import './workspaceStudio.css';
import {useI18n} from '../content/localization';
import type {AppId,Task,Step} from '../world/types';
const icons={ide:Code2,browser:Globe,console:Terminal,chat:MessageSquare};
export function LaptopAppHeader({app,task,steps,view,onDesk,onCurrent,emptyReference=false}:{app:AppId;task:Task;steps:Step[];view:Step|null;onDesk:()=>void;onCurrent?:()=>void;emptyReference?:boolean}){
 const {t}=useI18n(),Icon=icons[app],done=steps.filter(s=>task.progress[s.id]?.status==='completed').length;
 const shown=view??steps.find(s=>s.id===task.currentStepId);
 return <header className="app-work-header" data-current={!view&&shown?.app===app} data-empty-reference={emptyReference&&shown?.app!==app||undefined}><div className="app-work-top"><button onClick={onDesk}><ArrowLeft size={14}/>{t('desk.tasks')}</button><span>{t(view?'ui.readOnly':shown?.app===app?'workspace.currentApp':'workspace.referenceApp')}</span></div><div className="app-work-identity"><span className="app-work-icon" aria-hidden="true"><Icon size={26}/></span><div><h2>{t('ui.'+app)}</h2><p>{t('appPurpose.'+app)}</p></div><AppIllustration app={app}/>{!emptyReference&&<div className="app-work-count"><Check size={14}/><b>{done} / {steps.length}</b><small>{t('workspace.steps')}</small></div>}</div>{!view&&shown&&<div className="studio-app-context"><div><small>{t(shown.app===app?'studio.current':'studio.reference')}</small><b>{t(shown.app===app?shown.titleKey:'studio.'+app)}</b></div>{shown.app!==app&&!emptyReference&&onCurrent&&<button className="world-secondary" onClick={onCurrent}>{t('studio.goCurrent')}</button>}</div>}<div className="app-work-route" aria-label={t('workspace.steps')}>{steps.map(s=><span key={s.id} className={task.progress[s.id]?.status==='completed'?'done':s.id===shown?.id?'current':''} title={t(s.titleKey)}/>)}</div></header>;
}
