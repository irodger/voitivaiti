import type {Campaign,Problem,Task,TechnicalAction} from './types';
import type {PaymentCausalState} from './paymentCausalTypes';
import {addWorkdays,isWorkday} from './calendar';
import {causalKey} from '../content/paymentCausalCopy';
export function paymentState(problem:Problem):PaymentCausalState{
 if(problem.paymentCausal)return problem.paymentCausal;
 const chain=problem.paymentChain,fixed=chain?.stage==='fixed'||chain?.stage==='verified';
 return problem.paymentCausal={phase:fixed?'stable':'dependency',cause:fixed?'verified_fix':chain?.stage==='returned'?'qa_reproduction':chain?'unresolved_limit':'fresh_problem',revision:1,peerRevision:0,originTaskId:chain?.taskId,lastTaskId:chain?.fixedTaskId??chain?.taskId,previousDecisionId:chain?(chain.fixedTaskId??chain.taskId)+':'+(fixed?'verify-shared':'limited'):undefined,limitation:chain&&!fixed?'lost-reply':undefined,pending:[],facts:[]};
}
function event(c:Campaign,p:Problem,key:string,id:string,actorId:string){
 const project=c.company!.projects.find(project=>project.problems.some(problem=>problem.id===p.id))!;
 const entry={projectId:project.id,id,day:c.life!.calendarDay,kind:'payment-causal',key,actorId,problemId:p.id};
 if(!p.history.some(e=>e.id===id)){p.history.push(entry);project.history.push(entry);c.company!.history.push(entry);}
 p.latestOutcomeKey=key;const s=paymentState(p);s.facts=[...new Set([...s.facts,key])];
}
function queue(c:Campaign,p:Problem,kind:PaymentCausalState['pending'][number]['kind'],sourceId:string,npcId:string,days=1){
 const s=paymentState(p),id=sourceId+':'+kind;if(s.pending.some(e=>e.id===id)||p.history.some(e=>e.id===id))return;
 s.pending.push({id,kind,sourceId,npcId,day:addWorkdays(c.life!.calendarDay,days)});
}
export function resolvePaymentEvents(c:Campaign){
 if(!c.life||!c.company||!isWorkday(c.life.calendarDay))return;
 for(const p of c.company.projects.flatMap(p=>p.problems)){
  const s=p.paymentCausal;if(!s)continue;
  for(const e of s.pending.filter(e=>e.day<=c.life!.calendarDay)){
   if(e.kind==='incident'&&!s.acceptedRisk)continue;
   if(e.kind==='contract'){s.contractChanged=true;s.revision++;s.limitation='pending';s.metrics={duplicates:0,pending:1};s.phase='dependency';s.cause='backend_contract';event(c,p,causalKey('contractChanged'),e.id,e.npcId);}
   if(e.kind==='review'){s.phase='review';s.cause='returned_review';event(c,p,causalKey('reviewDue'),e.id,e.npcId);}
   if(e.kind==='incident'&&s.acceptedRisk){s.phase='incident';s.cause='accepted_risk';s.metrics={duplicates:3,pending:2};event(c,p,causalKey('incident'),e.id,e.npcId);}
   if(e.kind==='evidence'){s.phase='dependency';s.cause='qa_reproduction';event(c,p,causalKey('qaEvidence'),e.id,e.npcId);}
   if(e.kind==='scope'){s.scope='completed-only';s.acceptedRisk=true;s.phase='review';s.cause='unresolved_limit';event(c,p,causalKey('scope'),e.id,e.npcId);}
   s.previousDecisionId=e.sourceId;p.status='planned';p.discovered=true;
  }
  s.pending=s.pending.filter(e=>e.day>c.life!.calendarDay);
 }
}
export function applyPaymentAction(c:Campaign,task:Task,action:TechnicalAction){
 if(!action.paymentCausal)return;const p=c.company!.projects.find(p=>p.id===task.projectId)?.problems.find(p=>p.id===task.problemId);if(!p)return;
 const s=paymentState(p),id=task.id+':'+action.id;s.previousDecisionId=id;s.lastTaskId=task.id;
 if(action.paymentCausal==='backend-reply')s.facts=[...new Set([...s.facts,action.observationKey])];
 if(action.paymentCausal==='request-rework'){event(c,p,causalKey('reviewComment'),id,task.characterId);}
 if(action.paymentCausal==='read-rework')event(c,p,causalKey('reviewNew'),id,'ilya');
 if(action.paymentCausal==='accept-risk'){s.scope='full';s.acceptedRisk=true;s.limitation='pending';queue(c,p,'incident',id,'max',2);event(c,p,causalKey('risk'),id,task.characterId);}
 if(action.paymentCausal==='mitigate'){s.cause='mitigation_effect';event(c,p,causalKey('mitigated'),id,task.characterId);}
 if(action.paymentCausal==='observe-mitigation')event(c,p,causalKey('effect'),id,task.characterId);
 if(action.paymentCausal==='request-contract')queue(c,p,'evidence',id,'max');
 if(action.paymentCausal==='defer-contract'){s.limitation=s.contractChanged?'pending':s.limitation??'lost-reply';s.phase='dependency';s.cause='unresolved_limit';queue(c,p,'evidence',id,'max');}
 if(action.paymentCausal==='approve-rework'||action.paymentCausal==='proper-fix'){
  s.phase='stable';s.cause='verified_fix';s.pending=s.pending.filter(e=>e.kind==='contract');s.acceptedRisk=false;s.limitation=undefined;if(action.paymentCausal==='proper-fix')s.metrics={duplicates:0,pending:0};event(c,p,causalKey(action.paymentCausal==='approve-rework'?'reviewApproved':'proper'),id,task.characterId);
  if(action.paymentCausal==='approve-rework'&&(s.metrics?.pending??0)>0){s.phase='dependency';s.cause='mitigation_effect';s.limitation='contained-pending';queue(c,p,'evidence',id,'max');}
  if(!s.contractChanged)queue(c,p,'contract',id,'sergey',3);
  else if(s.phase==='stable')p.status='resolved';
  if(action.paymentCausal==='proper-fix'&&p.paymentChain){p.paymentChain.stage='fixed';p.paymentChain.fixedBy=task.characterId;p.paymentChain.fixedTaskId=task.id;p.paymentChain.debt=0;}
 }
}
export function recordPaymentCompletion(c:Campaign,task:Task,p:Problem){
 if(p.category!=='payment'||!p.paymentCausal)return;
 const s=p.paymentCausal,actions=Object.values(task.progress).flatMap(v=>v.actionHistory??[]);
 s.originTaskId??=task.id;s.lastTaskId=task.id;
 if(actions.includes('verify-limited')&&!actions.some(a=>a.startsWith('causal-'))){s.cause='unresolved_limit';s.phase='dependency';s.limitation='lost-reply';s.previousDecisionId=task.id+':limited';queue(c,p,'evidence',s.previousDecisionId,'max',2);}
 if(actions.includes('verify-shared')&&!actions.some(a=>a.startsWith('causal-'))){s.phase='stable';s.cause='verified_fix';s.limitation=undefined;s.acceptedRisk=false;s.pending=s.pending.filter(e=>e.kind==='contract');s.previousDecisionId=task.id+':shared';queue(c,p,'review',s.previousDecisionId,'ilya');}
}
export function choosePaymentConversation(c:Campaign,problemId:string,choice:string,npcId:string,sourceId:string){
 const p=c.company?.projects.flatMap(p=>p.problems).find(p=>p.id===problemId);if(!p||!p.paymentCausal||c.phase!=='office')return false;
 if(choice==='evidence')queue(c,p,c.characters.find(n=>n.id===npcId)?.profession==='backend'?'contract':'evidence',sourceId,npcId);
 else if(choice==='scope')queue(c,p,'scope',sourceId,npcId);
 else if(choice==='risk'){p.paymentCausal.acceptedRisk=true;queue(c,p,'incident',sourceId,npcId,2);}
 else return false;
 p.paymentCausal.previousDecisionId=sourceId;return true;
}

export function deliverPaymentReply(c:Campaign,task:Task,progress:import('./types').StepProgress){
 const d=progress.dependency;if(!d?.ready||d.delivered||!d.responseKey)return;
 const p=c.company?.projects.find(p=>p.id===task.projectId)?.problems.find(p=>p.id===task.problemId);if(!p?.paymentCausal)return;
 d.delivered=true;
 if(d.responseKey===causalKey('effect')){p.paymentCausal.metrics={duplicates:0,pending:7};p.paymentCausal.limitation='contained-pending';}
 if(d.responseKey===causalKey('reviewNew')){p.paymentCausal.peerRevision++;event(c,p,d.responseKey,task.id+':rework-delivered',d.npcId);}
}
