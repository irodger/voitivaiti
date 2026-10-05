import {formatCalendarDate} from '../utils/format';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {activeCharacter} from '../world/simulation';
import {availableWork,workOwner} from '../world/workLoop';
import './workExpectations.css';
import {Button,Speech,characterName} from './shared';
import {TermText} from './TermText';

export function WorkExpectations({compact=false,npcId,showCosts=false}:{compact?:boolean;npcId?:string;showCosts?:boolean}={}){
 const w=useWorld(),{t,locale}=useI18n(),ch=activeCharacter(w);
 const waiting=w.life?.queue.filter(q=>(!npcId||workOwner[q.id]===npcId)&&q.expectation&&q.status!=='done'&&!q.delegatedTo&&availableWork(ch).includes(q.id))??[];
 if(!waiting.length)return null;
 return <div className="work-expectations"><h3>{t('expect.title')}</h3>{waiting.map(q=>{
  const e=q.expectation!,owner=w.characters.find(n=>n.id===workOwner[q.id]),project=w.company!.projects.find(p=>p.id===q.projectId),problem=project?.problems.find(p=>p.id===q.problemId);
  return <article className="expectation-card" key={q.id}><details open={compact?undefined:true}><summary><h4>{t(problem?.titleKey??'life.work.'+q.id)}</h4><p className="expectation-meta">{owner?characterName(owner,t):t('ui.team')} · {t('expect.'+e.state)} · {t('expect.dueDate',{date:formatCalendarDate(e.dueDay,locale)})}</p></summary>
   {e.reactionKey&&<Speech speaker={workOwner[q.id]}>{t(e.reactionKey)}</Speech>}
   {problem?.latestOutcomeKey&&<p><TermText>{t(problem.latestOutcomeKey)}</TermText></p>}
   {w.phase==='office'&&!w.life!.reviewDue&&<div className="expectation-actions">{(['postpone','blocker','defer'] as const).filter(choice=>e.communication!==choice&&(choice==='defer'||!e.extensionUsed)).map(choice=><Button key={choice} secondary onClick={()=>w.dispatch({type:'work-expectation',id:q.id,choice})}>{t('expect.'+choice)}{showCosts&&<small>{t('ui.min',{value:choice==='defer'?2:10})}</small>}</Button>)}</div>}
  </details></article>;
 })}</div>;
}
