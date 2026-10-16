import { BriefcaseBusiness,CalendarDays,Check,Flag,LockKeyhole,Route,ShieldAlert,UsersRound } from 'lucide-react';
import { useI18n } from '../content/localization';
import '../content/premiumStages';
import type { DayEvent,Step,Task } from '../world/types';
import './stageJourney.css';
import { useTaskJourney,type Stage } from './useTaskJourney';
const eventIcons:Record<string,typeof CalendarDays>={sync:UsersRound,task:BriefcaseBusiness,career:Flag,incident:ShieldAlert};

function Journey({items,label}:{items:Stage[];label:string}){
 const {t}=useI18n(),done=items.filter(i=>i.state==='done').length;
 return <section className="stage-journey" aria-label={label}><header><span>{label}</span><strong>{t('premiumStage.progress',{done,total:items.length})}</strong></header><progress max={Math.max(1,items.length)} value={done} aria-label={label}/><ol>{items.map(({id,title,state,Icon,onClick,selected},index)=><li key={id} data-stage={state} data-selected={selected||undefined}><button title={title} disabled={!onClick||state==='locked'} aria-current={state==='current'?'step':undefined} onClick={onClick}><span className="journey-node">{state==='done'?<Check size={18}/>:state==='locked'?<LockKeyhole size={16}/>:<Icon size={18}/>}</span><span className="journey-copy"><small>{String(index+1).padStart(2,'0')} · {t('premiumStage.'+(state==='done'?'complete':state))}</small><b>{title}</b></span></button></li>)}</ol></section>;
}
export function TaskJourney({task,steps,selectedId,onSelect,compact=false}:{task:Task;steps:Step[];selectedId:string;onSelect:(step:Step)=>void;compact?:boolean}){
const {t,tools,done,current}=useTaskJourney({task,steps});

 const journey=<Journey label={t('premiumStage.path')} items={steps.map(s=>({id:s.id,title:t(s.titleKey),state:task.progress[s.id]?.status==='completed'?'done':s.id===task.currentStepId?'current':task.progress[s.id]?.status==='locked'?'locked':'next',Icon:tools.get(s.app).Icon,selected:s.id===selectedId,onClick:()=>onSelect(s)}))}/>;
 return compact?<details className="task-journey-fold"><summary><Route size={17} aria-hidden="true"/><span>{t('premiumStage.path')}{current&&<small className="journey-current-title">{t(current.titleKey)}</small>}</span><b>{t('premiumStage.progress',{done,total:steps.length})}</b></summary>{journey}</details>:journey;
}
export function WorkdayJourney({events,onOffice}:{events:DayEvent[];onOffice?:()=>void}){
 const {t}=useI18n(),current=events.find(e=>e.status==='pending')?.id;
 return <Journey label={t('desk.day')} items={events.map(e=>({id:e.id,title:t(e.key),state:e.status==='completed'?'done':e.id===current?'current':'next',Icon:eventIcons[e.type]??CalendarDays,onClick:e.id===current?onOffice:undefined}))}/>;
}
