import type {Campaign,Problem,SceneFamily} from './types';
export type CausalContext={id:string;day:number;family:SceneFamily;key:string;actorId?:string;previousTaskId?:string;decisionId?:string;contextKeys:string[]};
/** Read existing world evidence. No timer, counter or new simulation mechanic. */
export function causalContext(c:Campaign,p:Problem):CausalContext|undefined{
 if(p.category==='payment')return;
 const consumed=new Set(c.tasks.filter(t=>t.rewarded&&t.problemId===p.id).map(t=>t.encounter?.triggerId));
 const reserved=new Set(c.tasks.filter(t=>!t.rewarded&&t.problemId===p.id).map(t=>t.encounter?.triggerId));
 const last=p.story?.encounters.at(-1);
 const events=[...p.history,...(c.company?.history??[]).filter(e=>e.problemId===p.id)];
 const candidates:CausalContext[]=[];
 for(const event of events){
  let family:SceneFamily|undefined;
  if(event.kind==='scene-outcome'||event.kind==='scene-followup'){
   const origin=p.consequences?.find(e=>e.id===event.id||e.id+':followup'===event.id);
   if(!origin)continue;
   if(event.kind==='scene-outcome'&&origin.outcome.systemChanged!==false)continue;
   if(event.kind==='scene-followup'&&origin.outcome.systemChanged===false)continue;
   const index=p.consequences!.indexOf(origin);
   if(p.consequences!.slice(index+1).some(e=>e.outcome.systemChanged!==false&&e.outcome.kind==='durable'))continue;
   family=origin.outcome.systemChanged===false?(origin.outcome.kind==='temporary'?'coordination':'artifact'):origin.outcome.kind==='temporary'?'recurrence':'review';
  }else if(event.kind==='delegation-result'){
   if(c.company?.delegations?.some(d=>d.id+':result'===event.id&&d.status==='checked'))continue;
   family='review';
  }else if(event.kind==='incident' || event.kind==='incident-start')family='incident';
  else if(event.kind==='contract-change'||event.kind==='environment-change')family='artifact';
  if(!family||consumed.has(event.id)||reserved.has(event.id))continue;
  const previousTaskId=event.kind==='scene-followup'?event.id.slice(0,-':outcome:followup'.length):event.kind==='scene-outcome'?event.id.slice(0,-':outcome'.length):last?.taskId;
  const prior=c.tasks.find(t=>t.id===previousTaskId);
  candidates.push({id:event.id,day:event.day,family,key:event.key,actorId:event.actorId,previousTaskId,decisionId:prior?prior.id+':'+(Object.values(prior.progress).flatMap(p=>p.actionHistory??[]).at(-1)??'outcome'):event.id,contextKeys:[event.key,...(prior?.outcome?[prior.outcome.summaryKey]:[]),...(last?.observations??[]),...(p.story?.limitations??[])]});
 }
 return candidates.sort((a,b)=>Number(b.family==='incident')-Number(a.family==='incident')||a.day-b.day||a.id.localeCompare(b.id))[0];
}
