import { findActiveCharacter } from './selectors';
import type {Campaign} from './types';
import {causalContext} from './causalRouting';
import {availableWork} from './workLoop';

export function morningBriefing(c:Campaign){
 const report=c.life?.dayReport,ch=findActiveCharacter(c);
 if(!report||!ch||report.companyId!==c.company?.id||report.characterId!==ch.id||report.calendarDay>=c.life!.calendarDay||c.phase!=='office')return;
 const items:{id:string;kind:'ready'|'waiting'|'carried'|'returned'|'open';taskId:string;titleKey:string;factKey?:string}[]=[];
 const seen=new Set<string>();
 for(const record of [...report.tasks].reverse()){
  const task=c.tasks.find(task=>task.id===record.id&&task.characterId===ch.id);if(!task)continue;
  const problem=c.company?.projects.find(p=>p.id===task.projectId)?.problems.find(p=>p.id===task.problemId);if(!problem)continue;
  const identity=task.projectId+':'+task.problemId;if(task.rewarded){if(seen.has(identity))continue;seen.add(identity);}
  if(!task.rewarded){
   const dependency=task.progress[task.currentStepId]?.dependency;
   items.push({id:task.id,taskId:task.id,titleKey:problem.titleKey,kind:dependency?(dependency.ready?'ready':'waiting'):'carried'});
  }else{
   const cause=causalContext(c,problem);
   const payment=problem.paymentCausal?.ready;
   const fact=cause?.previousTaskId===task.id?{id:cause.id,key:cause.key,day:cause.day}:payment&&problem.paymentCausal?.lastTaskId===task.id?{id:payment.id,key:payment.reasonKey,day:payment.day}:undefined;
   if(fact)items.push({id:fact.id,taskId:task.id,titleKey:problem.titleKey,kind:fact.day>report.calendarDay?'returned':'open',factKey:fact.key});
  }
 }
 const deadlines=c.life!.queue.filter(q=>q.status!=='done'&&!q.delegatedTo&&availableWork(ch).includes(q.id)&&q.expectation&&q.expectation.state!=='resolved'&&q.expectation.dueDay<=c.life!.calendarDay).map(q=>({id:q.id,titleKey:c.company?.projects.find(p=>p.id===q.projectId)?.problems.find(p=>p.id===q.problemId)?.titleKey??'life.work.'+q.id,dueDay:q.expectation!.dueDay,overdue:q.expectation!.dueDay<c.life!.calendarDay}));
 return {calendarDay:report.calendarDay,delivered:report.tasks.filter(task=>task.state==='delivered').length,items,deadlines};
}
