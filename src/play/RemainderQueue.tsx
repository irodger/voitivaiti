import {gameConfig} from '../config/game';
import {WorkItemContext} from './WorkItemContext';
import {WorkKindIcon} from './WorkKindIcon';
import {DelegationResults} from './DelegationResults';
import {useState} from 'react';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {autonomy,availableWork,workOwner} from '../world/workLoop';
import {useI18n} from '../content/localization';
import {characterName} from './shared';
import type {WorkKind} from '../world/lifeTypes';

export function RemainderQueue(){
 const w=useWorld(),ch=activeCharacter(w),{t}=useI18n(),[chosen,setChosen]=useState<WorkKind|null>(null),level=autonomy(ch),queue=w.life!.queue;
 const selected=queue.find(q=>q.status==='selected'&&!q.delegatedTo);
 return <><DelegationResults/><div className="remainder-queue">{queue.filter(q=>q.status!=='done'&&(!!q.delegatedTo||availableWork(ch).includes(q.id))).map(q=>{
  const npc=w.characters.find(n=>n.id===workOwner[q.id]),delegated=!!q.delegatedTo;
  const canTake=availableWork(ch).includes(q.id)&&(!selected||selected.id===q.id);
  const takeReason=w.life!.reviewDue?'review':w.time>=gameConfig.clock.lastTaskStart?'late':null;
  const helpReason=w.time+q.minutes>gameConfig.clock.workdayEnd?'time':null;
  const choose=(explained:boolean)=>{w.dispatch({type:'priority',id:q.id,explained});setChosen(null);};
  return <article className="remainder-card" data-kind={q.id} key={q.id}>
   <h2><WorkKindIcon kind={q.id}/>{t('life.work.'+q.id)}</h2>
   <small>{npc?characterName(npc,t):t('ui.team')} · {t('loop.age',{days:q.age??0})} · ~{t('ui.min',{value:q.minutes})}</small>
   <WorkItemContext item={q}/><p>{t('life.work.'+q.id+'.body')}</p>
   {delegated?<small>{t('queue.delegated')}</small>:<div className="remainder-actions">
    {canTake&&!takeReason&&<button onClick={()=>selected?w.dispatch({type:'take-task'}):setChosen(chosen===q.id?null:q.id)}>{t(selected?'queue.start':'queue.choose')}</button>}
    {q.status==='waiting'&&availableWork(ch).includes(q.id)&&!helpReason&&<button onClick={()=>w.dispatch({type:'help-work',id:q.id})}>{t('queue.action.'+q.id)}</button>}
    {!helpReason&&level>=3&&npc&&npc.employed&&npc.id!==ch.id&&!queue.some(item=>item.delegatedTo===npc.id)&&<button onClick={()=>w.dispatch({type:'delegate-work',id:q.id,npcId:npc.id})}>{t('queue.delegate',{name:characterName(npc,t)})}</button>}
   </div>}
   {!delegated&&((canTake&&takeReason)||helpReason)&&<small className="queue-unavailable">{t('queue.reason.'+(canTake&&takeReason?takeReason:helpReason))}</small>}
   {chosen===q.id&&!selected&&canTake&&!takeReason&&<div className="queue-agreement"><p>{t('queue.agree')}</p><div className="remainder-actions"><button onClick={()=>choose(true)}>{t('life.explain')}</button><button onClick={()=>choose(false)}>{t('life.dismiss')}</button></div></div>}
  </article>;
 })}</div></>;
}
