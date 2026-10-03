import type {Campaign} from './types';
import type {WorkItem,WorkKind} from './lifeTypes';
import {workOwner} from './workLoop';
import {ordinaryProblem} from './roleRouting';
import {rememberExperience,rankOf} from './mastery';

export function ensureResponsibilities(c:Campaign){
 if(!c.company||!c.life)return;c.company.delegations??=[];
 for(const q of c.life.queue){
  if(q.status==='done'||!q.delegatedTo||c.company.delegations.some(d=>d.work===q.id&&d.npcId===q.delegatedTo&&d.status!=='checked'))continue;
  const ch=c.characters.find(n=>n.id===c.activeCharacterId)!;
  const problem=c.company.projects.find(p=>p.id===q.projectId)?.problems.find(p=>p.id===q.problemId);
  // Old assignments resume as pending work; their old immediate mastery tags are not restored.
  c.company.delegations.push({id:`legacy-handoff:${ch.id}:${q.id}:${c.life.calendarDay}`,actorId:ch.id,npcId:q.delegatedTo,work:q.id,projectId:q.projectId,problemId:q.problemId,context:problem?.category??q.id,grade:0,profession:ch.profession,startedDay:c.life.calendarDay,dueDay:Math.max(c.life.calendarDay+1,q.promisedDay??0),status:'working'});
 }
}

export function handoffCandidate(c:Campaign,q:WorkItem,reserved:string[]=[]){
 return [...c.characters].sort((a,b)=>Number(b.id===workOwner[q.id])-Number(a.id===workOwner[q.id])).find(n=>n.id!==c.activeCharacterId&&n.employed&&!reserved.includes(n.id)&&
  !c.company!.delegations?.some(d=>d.npcId===n.id&&d.status==='working')&&
  !c.life!.queue.some(item=>item.delegatedTo===n.id));
}
export function assignResponsibility(c:Campaign,work:WorkKind,npcId:string){
 const q=c.life!.queue.find(q=>q.id===work),ch=c.characters.find(ch=>ch.id===c.activeCharacterId)!;
 const npc=c.characters.find(n=>n.id===npcId&&n.id!==ch.id&&n.employed);
 if(!q||q.status==='done'||q.delegatedTo||!npc||c.life!.queue.some(item=>item.delegatedTo===npcId)||c.company!.delegations?.some(d=>d.npcId===npcId&&d.status==='working'))return false;
 const {project,problem}=ordinaryProblem(c,work);c.company!.delegations??=[];
 const id=`handoff:${ch.id}:${c.life!.calendarDay}:${work}:${c.company!.delegations.length}`;
 c.company!.delegations.push({id,actorId:ch.id,npcId,work,projectId:project.id,problemId:problem?.id,context:problem?.category??work,grade:rankOf(ch),profession:ch.profession,startedDay:c.life!.calendarDay,dueDay:c.life!.calendarDay+2,status:'working'});
 q.projectId=project.id;q.problemId=problem?.id;q.delegatedTo=npcId;q.status='selected';q.explained=true;q.promisedDay=c.life!.calendarDay+2;
 c.company!.history.push({id,day:c.life!.calendarDay,kind:'delegation-start',key:'responsibility.contextSent',actorId:ch.id,projectId:project.id,problemId:problem?.id});return true;
}
export function resolveResponsibilities(c:Campaign){
 for(const d of c.company?.delegations??[]){
  if(d.status!=='working'||d.dueDay>c.life!.calendarDay)continue;
  d.status='returned';d.result=d.work==='review'||d.work==='support'?'verified':'bounded';
  const q=c.life!.queue.find(q=>q.id===d.work&&q.delegatedTo===d.npcId);
  if(q){q.status='done';if(q.expectation)q.expectation.state='resolved';}
  c.company!.history.push({id:d.id+':result',day:c.life!.calendarDay,kind:'delegation-result',key:'responsibility.result.'+d.result,actorId:d.npcId,projectId:d.projectId,problemId:d.problemId});
 }
}
export function checkResponsibility(c:Campaign,id:string,response:'accept'|'clarify'){
 const d=c.company!.delegations?.find(d=>d.id===id&&d.actorId===c.activeCharacterId&&d.status==='returned');if(!d||!['office','home','reward'].includes(c.phase))return false;
 d.status='checked';d.response=response;c.time+=10;
 const q=c.life!.queue.find(q=>q.id===d.work&&q.delegatedTo===d.npcId);
 if(response==='accept'&&q)q.delegatedTo=undefined;
 if(response==='clarify'&&q){q.status='waiting';q.delegatedTo=undefined;q.promisedDay=undefined;q.expectation=undefined;}
 if(response==='clarify'){
  const problem=c.company!.projects.find(p=>p.id===d.projectId)?.problems.find(p=>p.id===d.problemId);
  if(problem){problem.status='planned';problem.discovered=true;}
 }
 rememberExperience(c,['delegation','people','ownership','consequences','prioritization'],d.id,'life.work.'+d.work,undefined,{confirmed:true,context:d.context,grade:d.grade,profession:d.profession,problemId:d.problemId,projectId:d.projectId,resultKind:d.result,outcome:'responsibility.response.'+response});
 c.company!.history.push({id:d.id+':checked',day:c.life!.calendarDay,kind:'delegation-checked',key:'responsibility.response.'+response,actorId:d.actorId,projectId:d.projectId,problemId:d.problemId});return true;
}
