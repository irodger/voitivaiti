import {setWorkDeadline} from './expectations';
import {addWorkdays} from './calendar';
import type {Campaign} from './types';
import type {WorkKind} from './lifeTypes';
import {assignResponsibility,handoffCandidate} from './responsibility';
import {availableWork,workOwner} from './workLoop';

export type VacationArrangement='handoff'|'postpone'|'ignore'|{kind:'handoff';npcId:string};
export type VacationArrangements=Partial<Record<WorkKind,VacationArrangement>>;
export function absenceObligations(c:Campaign){
 const ch=c.characters.find(n=>n.id===c.activeCharacterId)!;
 return c.life!.queue.filter(q=>q.status!=='done'&&(q.expectation||q.promisedDay!==undefined||availableWork(ch).includes(q.id)));
}
export function arrangeAbsence(c:Campaign,returnDay:number,arrangements:VacationArrangements={}){
 const summary:string[]=[],unagreed:WorkKind[]=[];
 for(const q of absenceObligations(c)){
  if(q.delegatedTo){summary.push('absence.handed.'+q.id);continue;}
  const arrangement=arrangements[q.id]??'ignore',choice=typeof arrangement==='string'?arrangement:arrangement.kind,e=q.expectation;
  const npc=typeof arrangement==='object'?c.characters.find(n=>n.id===arrangement.npcId):handoffCandidate(c,q);
  if(choice==='handoff'&&npc&&assignResponsibility(c,q.id,npc.id)){summary.push('absence.handed.'+q.id);continue;}
  // A colleague can agree to one noncritical extension, not endless new promises.
  if(choice==='postpone'&&e&&!e.extensionUsed&&q.urgency<4&&e.state!=='escalated'){
   e.extensionUsed=true;e.communication='postpone';e.lastCommunicationDay=c.life!.calendarDay;setWorkDeadline(q,addWorkdays(returnDay,1));e.reactionKey='absence.agreed';
   summary.push('absence.moved.'+q.id);continue;
  }
  unagreed.push(q.id);summary.push('absence.waited.'+q.id);
  if(choice!=='ignore')summary.push('absence.notAgreed');
  c.company!.history.push({id:`absence:${c.activeCharacterId}:${c.life!.calendarDay}:${q.id}`,day:c.life!.calendarDay,kind:'absence-unagreed',key:'absence.waited.'+q.id,actorId:c.activeCharacterId,projectId:q.projectId,problemId:q.problemId,values:{work:q.id,characterId:c.activeCharacterId}});
  const ch=c.characters.find(n=>n.id===c.activeCharacterId)!,r=ch.relationships.find(r=>r.characterId===workOwner[q.id]);if(r)r.trust=Math.max(0,r.trust-2);
 }
 if(unagreed.length){
  c.life!.decisions.communicationFailures++;c.life!.decisionHistory.push({day:c.life!.calendarDay,kind:'communicationFailures'});
 }
 return {summary,unagreed};
}
