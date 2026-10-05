import {addWorkdays,isWorkday,nextWorkdayOnOrAfter} from './calendar';
import {changeStress} from './stress';
import type {Campaign} from './types';
import type {WorkItem,WorkKind} from './lifeTypes';
import {ordinaryProblem} from './roleRouting';
import {availableWork,workOwner} from './workLoop';
import '../content/expectations';

export function ensureWorkExpectations(c:Campaign){
 const ch=c.characters.find(x=>x.id===c.activeCharacterId);
 if(!ch||!c.life||ch.completedWork.length<1||!ch.firstDay?.onboardingCompleted)return;
 for(const q of c.life.queue){
  if(q.status==='done'||!availableWork(ch).includes(q.id))continue;
  const {project,problem}=ordinaryProblem(c,q.id);
  if(problem){q.projectId=project.id;q.problemId=problem.id;}
  q.expectation??={state:q.status==='selected'?'assigned':'waiting',dueDay:q.promisedDay??addWorkdays(c.life.calendarDay,2)};
  if(['assigned','waiting'].includes(q.expectation.state))q.expectation.dueDay=nextWorkdayOnOrAfter(q.expectation.dueDay);
 }
}
/** One agreed date for queue promises and the colleague's visible expectation. */
export function setWorkDeadline(q:WorkItem,day:number){
 const dueDay=nextWorkdayOnOrAfter(day);
 q.promisedDay=dueDay;
 if(q.expectation){q.expectation.dueDay=dueDay;q.expectation.state='waiting';q.expectation.lastReactionDay=undefined;q.expectation.reactionKey=undefined;}
}
export function communicateExpectation(c:Campaign,id:WorkKind,choice:'postpone'|'blocker'|'defer'){
 ensureWorkExpectations(c);
 const q=c.life!.queue.find(q=>q.id===id),e=q?.expectation;
 if(c.phase!=='office'||!q||q.status==='done'||q.delegatedTo||!e||e.state==='resolved'||e.communication===choice)return false;
 const day=c.life!.calendarDay;
 // A repeated promise is not a fresh postponement. It must lead to work or handoff.
 if(choice!=='defer'&&e.extensionUsed)return false;
 e.communication=choice;e.lastCommunicationDay=day;
 if(choice!=='defer'){e.extensionUsed=true;setWorkDeadline(q,addWorkdays(Math.max(day,e.dueDay),choice==='blocker'?1:2));}
 e.reactionKey='expect.reply.'+choice;
 c.time+=choice==='defer'?2:10;
 const event={id:`expect-${q.id}-${day}-${choice}`,day,kind:'obligation',key:e.reactionKey,actorId:workOwner[q.id],projectId:q.projectId,problemId:q.problemId,values:{characterId:c.activeCharacterId,work:q.id,choice}};
 c.company!.history.push(event);
 return true;
}
export function expectationPressure(c:Campaign){
 ensureWorkExpectations(c);
 if(!isWorkday(c.life!.calendarDay))return;
 const l=c.life!,ch=c.characters.find(x=>x.id===c.activeCharacterId)!;
 l.obligations??=[];
 for(const q of l.queue){
  const e=q.expectation;
  if(!e||q.status==='done'||q.delegatedTo||e.state==='resolved'||l.calendarDay<=e.dueDay||e.lastReactionDay===l.calendarDay)continue;
  const escalated=l.calendarDay>=addWorkdays(e.dueDay,2);
  e.state=escalated?'escalated':'overdue';e.lastReactionDay=l.calendarDay;
  e.reactionKey='expect.reaction.'+(escalated?'escalated':e.communication?'explained':'waiting');
  const npcId=workOwner[q.id];
  l.obligations.push({day:l.calendarDay,work:q.id,npcId,kind:e.communication||q.promisedDay!==undefined?'promise':'waiting'});
  c.company!.history.push({id:`expect-${q.id}-${l.calendarDay}`,day:l.calendarDay,kind:'obligation',key:e.reactionKey,actorId:npcId,projectId:q.projectId,problemId:q.problemId,values:{characterId:c.activeCharacterId,work:q.id,reaction:escalated?'escalated':'overdue',communication:e.communication??'none',dueDay:e.dueDay}});
  const r=ch.relationships.find(r=>r.characterId===npcId);
  if(r)r.trust=Math.max(0,r.trust-(e.communication?1:3));
  if(escalated&&!e.escalationRecorded){
   e.escalationRecorded=true;
   const kind=e.communication?'deadlineFailures':'communicationFailures';
   l.decisions[kind]++;l.decisionHistory.push({day:l.calendarDay,kind});
   changeStress(ch,e.communication?1:3);
  }
 }
}
