import type {Campaign,Task} from './types';

export function commitSceneOutcome(c:Campaign,task:Task){
 if(!task.outcome)return;
 const project=c.company!.projects.find(p=>p.id===task.projectId)!,problem=project.problems.find(p=>p.id===task.problemId)!;
 const outcome=task.outcome;
 problem.latestOutcomeKey=outcome.summaryKey;
 if(outcome.kind==='temporary')problem.workaround=true;
 else if(outcome.systemChanged!==false)problem.workaround=false;
 problem.causedBy=task.characterId;
 if(outcome.kind==='temporary')problem.status='planned';
 const id=task.id+':outcome';
 problem.consequences??=[];
 if(problem.consequences!.some(e=>e.id===id))return;
 problem.consequences.push({id,actorId:task.characterId,dueDay:c.life!.calendarDay+outcome.delayDays,outcome,resolved:false});
 const event={id,day:c.life!.calendarDay,kind:'scene-outcome',key:outcome.summaryKey,actorId:task.characterId,projectId:project.id,problemId:problem.id};
 problem.history.push(event);project.history.push(event);c.company!.history.push(event);
}
export function resolveSceneConsequences(c:Campaign){
 for(const project of c.company?.projects??[])for(const problem of project.problems)for(const pending of problem.consequences??[]){
  if(pending.resolved||pending.dueDay>c.life!.calendarDay)continue;
  pending.resolved=true;
  // A later durable contribution can supersede an earlier workaround.
  const superseded=problem.consequences!.some(e=>e!==pending&&e.outcome.kind==='durable'&&e.outcome.systemChanged!==false&&problem.consequences!.indexOf(e)>problem.consequences!.indexOf(pending));
  if(pending.outcome.kind==='temporary'&&superseded)continue;
  if(problem.paymentChain?.stage==='verified'&&pending.outcome.summaryKey==='payment.chain.fixed')continue;
  problem.latestOutcomeKey=pending.outcome.followupKey;
  if(pending.outcome.kind==='temporary'){
   if(problem.paymentChain?.stage==='workaround')problem.paymentChain.stage='returned';
   if(problem.story)problem.story.change='environment';problem.status='planned';problem.discovered=true;problem.workaround=true;problem.severity=Math.min(5,problem.severity+1);
   if(pending.outcome.systemChanged!==false)project.stability=Math.max(0,project.stability-2);
   const item=c.life!.queue.find(q=>q.problemId===problem.id);
   if(item&&item.status==='done'){item.status='waiting';item.age=0;item.expectation=undefined;}
  }
  const event={id:pending.id+':followup',day:c.life!.calendarDay,kind:'scene-followup',key:pending.outcome.followupKey,actorId:pending.actorId,projectId:project.id,problemId:problem.id};
  problem.history.push(event);project.history.push(event);c.company!.history.push(event);
 }
}
