import '../content/premiumStages';
import {Check,LockKeyhole,Code2,Globe,Terminal,MessageSquare,CalendarDays,BriefcaseBusiness,UsersRound,Flag,ShieldAlert,Route} from 'lucide-react';
import type {AppId,DayEvent,Step,Task} from '../world/types';
import {useI18n} from '../content/localization';
import './stageJourney.css';
const appIcons={ide:Code2,browser:Globe,console:Terminal,chat:MessageSquare};
const eventIcons:Record<string,typeof CalendarDays>={sync:UsersRound,task:BriefcaseBusiness,career:Flag,incident:ShieldAlert};
type Stage={id:string;title:string;state:'done'|'current'|'next'|'locked';Icon:typeof Code2;selected?:boolean;onClick?:()=>void};
function Journey({items,label}:{items:Stage[];label:string}){
 const {t}=useI18n(),done=items.filter(i=>i.state==='done').length;
 return <section className="stage-journey" aria-label={label}><header><span>{label}</span><strong>{t('premiumStage.progress',{done,total:items.length})}</strong></header><progress max={Math.max(1,items.length)} value={done} aria-label={label}/><ol>{items.map(({id,title,state,Icon,onClick,selected},index)=><li key={id} data-stage={state} data-selected={selected||undefined}><button title={title} disabled={!onClick||state==='locked'} aria-current={state==='current'?'step':undefined} onClick={onClick}><span className="journey-node">{state==='done'?<Check size={18}/>:state==='locked'?<LockKeyhole size={16}/>:<Icon size={18}/>}</span><span className="journey-copy"><small>{String(index+1).padStart(2,'0')} · {t('premiumStage.'+(state==='done'?'complete':state))}</small><b>{title}</b></span></button></li>)}</ol></section>;
}
export function TaskJourney({task,steps,selectedId,onSelect,compact=false}:{task:Task;steps:Step[];selectedId:string;onSelect:(step:Step)=>void;compact?:boolean}){
 const {t}=useI18n(),done=steps.filter(s=>task.progress[s.id]?.status==='completed').length;
 const journey=<Journey label={t('premiumStage.path')} items={steps.map(s=>({id:s.id,title:t(s.titleKey),state:task.progress[s.id]?.status==='completed'?'done':s.id===task.currentStepId?'current':task.progress[s.id]?.status==='locked'?'locked':'next',Icon:appIcons[s.app as AppId],selected:s.id===selectedId,onClick:()=>onSelect(s)}))}/>;
 return compact?<details className="task-journey-fold"><summary><Route size={17} aria-hidden="true"/><span>{t('premiumStage.path')}</span><b>{t('premiumStage.progress',{done,total:steps.length})}</b></summary>{journey}</details>:journey;
}
export function WorkdayJourney({events,onOffice}:{events:DayEvent[];onOffice?:()=>void}){
 const {t}=useI18n(),current=events.find(e=>e.status==='pending')?.id;
 return <Journey label={t('desk.day')} items={events.map(e=>({id:e.id,title:t(e.key),state:e.status==='completed'?'done':e.id===current?'current':'next',Icon:eventIcons[e.type]??CalendarDays,onClick:e.id===current?onOffice:undefined}))}/>;
}
