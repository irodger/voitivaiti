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
 return <div className="remainder-queue">{queue.filter(q=>q.status!=='done').map(q=>{
  const npc=w.characters.find(n=>n.id===workOwner[q.id]),delegated=!!q.delegatedTo;
  const canTake=level>0&&availableWork(ch).includes(q.id)&&(!selected||selected.id===q.id);
  const takeReason=w.life!.reviewDue?'review':w.time>=1020?'late':null;
  const helpReason=w.time+q.minutes>1080?'time':null;
  const choose=(explained:boolean)=>{w.dispatch({type:'priority',id:q.id,explained});setChosen(null);};
  return <article className="remainder-card" key={q.id}>
   <h2>{t('life.work.'+q.id)}</h2>
   <small>{npc?characterName(npc,t):t('ui.team')} · {t('loop.age',{days:q.age??0})} · ~{t('ui.min',{value:q.minutes})}</small>
   <p>{t('life.work.'+q.id+'.body')}</p>
   {delegated?<small>{t('queue.delegated')}</small>:<div className="remainder-actions">
    {canTake&&!takeReason&&<button onClick={()=>selected?w.dispatch({type:'take-task'}):setChosen(chosen===q.id?null:q.id)}>{t(selected?'queue.start':'queue.choose')}</button>}
    {q.status==='waiting'&&!helpReason&&<button onClick={()=>w.dispatch({type:'help-work',id:q.id})}>{t('queue.action.'+q.id)}</button>}
    {!helpReason&&level===4&&npc&&npc.employed&&npc.id!==ch.id&&!queue.some(item=>item.delegatedTo===npc.id)&&<button onClick={()=>w.dispatch({type:'delegate-work',id:q.id,npcId:npc.id})}>{t('queue.delegate',{name:characterName(npc,t)})}</button>}
   </div>}
   {!delegated&&((canTake&&takeReason)||helpReason)&&<small className="queue-unavailable">{t('queue.reason.'+(canTake&&takeReason?takeReason:helpReason))}</small>}
   {chosen===q.id&&!selected&&canTake&&!takeReason&&<div className="queue-agreement"><p>{t('queue.agree')}</p><div className="remainder-actions"><button onClick={()=>choose(true)}>{t('life.explain')}</button><button onClick={()=>choose(false)}>{t('life.dismiss')}</button></div></div>}
  </article>;
 })}</div>;
}
