import {causalContext} from './causalRouting';
import {paymentState,recordPaymentCompletion,deliverPaymentReply} from './paymentCausal';
import {causalKey} from '../content/paymentCausalCopy';
import {paymentCausalScene} from '../content/paymentCausalScenes';
import type {Campaign,Problem,Task,TaskTemplate} from './types';
import {storyScene} from '../content/storyScenes';
import {rankOf} from './mastery';
import {paymentChainKeys,paymentChainScene} from '../content/paymentChain';

// Older saves can join this story only when their action log proves the work.
export function restorePaymentChains(c:Campaign){
 for(const project of c.company?.projects??[])for(const problem of project.problems){
  if(problem.paymentChain||problem.category!=='payment')continue;
  const tasks=c.tasks.filter(t=>t.problemId===problem.id&&t.rewarded),ids=(t:Task)=>Object.values(t.progress).flatMap(p=>p.actionHistory??[]);
  const origin=[...tasks].reverse().find(t=>c.characters.find(ch=>ch.id===t.characterId)?.profession==='frontend'&&t.outcome?.kind==='temporary'&&ids(t).includes('limited')&&ids(t).includes('verify-limited'));
  if(!origin)continue;
  const fix=tasks.slice(tasks.indexOf(origin)+1).find(t=>t.outcome?.systemChanged===true&&ids(t).includes('shared')&&ids(t).includes('verify-shared'));
  const pending=problem.consequences?.find(e=>e.id===origin.id+':outcome');
  problem.paymentChain={stage:fix?'fixed':pending?.resolved?'returned':'workaround',actorId:origin.characterId,taskId:origin.id,debt:fix?0:Math.max(0,origin.appliedWorldEffects?.filter(e=>e.target==='techDebt').reduce((n,e)=>n+e.value,0)??0),fixedBy:fix?.characterId,fixedTaskId:fix?.id};
  if(!fix&&pending){pending.outcome.followupKey=paymentChainKeys.recurrence;problem.latestOutcomeKey=pending.resolved?paymentChainKeys.recurrence:paymentChainKeys.temporary;}
 }
}

export function ensureProblemStory(c:Campaign,problem:Problem){
 if(problem.story)return problem.story;
 problem.story={version:1,limitations:[],observations:[],affectedRoles:[],encounters:[]};
 for(const task of c.tasks.filter(t=>t.problemId===problem.id&&t.rewarded))recordEncounter(c,task,problem);
 return problem.story;
}
export function prepareEncounter(c:Campaign,task:Task,base:TaskTemplate,problem:Problem){
 if(!task.templateId.startsWith('lens.'))return;
 const story=ensureProblemStory(c,problem),ch=c.characters.find(n=>n.id===task.characterId)!,grade=rankOf(ch),last=story.encounters.at(-1);
 const chain=problem.paymentChain;
 if(problem.category==='payment'){
  const state=paymentState(problem),fresh=!last&&!chain;
  if(state.cause==='fresh_problem'&&last&&c.tasks.some(t=>t.id===last.taskId&&t.rewarded&&t.outcome)){const prior=c.tasks.find(t=>t.id===last.taskId);if(prior?.outcome?.systemChanged===true){state.phase='stable';state.cause='verified_fix';}else if(story.limitations.length){state.cause='unresolved_limit';}state.previousDecisionId=last.taskId+':'+(Object.values(prior?.progress??{}).flatMap(p=>p.actionHistory??[]).at(-1)??'outcome');state.originTaskId??=last.taskId;}
  const inherited=chain?.stage==='fixed'&&chain.fixedBy!==ch.id;
  task.encounter={triggerId:state.ready?.id,triggerDay:state.ready?.day,cause:state.cause,causeKey:state.ready?.reasonKey??(fresh?base.descriptionKey:state.cause==='mitigation_effect'?causalKey('effect'):problem.latestOutcomeKey),recurrenceKind:chain?.stage==='returned'?'same-symptom-new-condition':state.contractChanged?'external-contract-change':state.phase==='incident'?'accepted-risk-impact':undefined,previousDecisionId:state.ready?.sourceId??state.previousDecisionId,version:story.version,grade,previousTaskId:state.lastTaskId??last?.taskId,originTaskId:chain?.taskId??state.originTaskId,previousActorId:chain?.fixedBy??chain?.actorId??last?.actorId,contextKeys:[...(state.ready?[state.ready.reasonKey]:[]),...(fresh?[]:['story.past']),...(state.cause==='verified_fix'||chain?.stage==='fixed'||last?.result==='durable'?['story.stable']:[]),...(chain?.stage==='returned'?['story.environment']:[]),...story.limitations]};
  if(inherited&&!state.contractChanged&&state.phase!=='incident'||state.phase==='stable'&&chain?.stage==='fixed'){
   if(inherited){task.encounter.triggerId=chain!.fixedTaskId+':handoff:'+ch.id;task.encounter.cause='verified_fix';task.encounter.causeKey=paymentChainKeys.fixed;task.encounter.contextKeys=[paymentChainKeys.fixed,'story.stable'];}
   task.sceneFamily='review';task.scene=paymentChainScene(base,problem,true,inherited);if(state.contractChanged){const verify=task.scene.steps[0].actionFlow!.actions.find(a=>a.id==='verify-inherited');verify?.artifact?.rows.push({id:'new-contract',labelKey:causalKey('contractChanged'),detailKey:causalKey('statusVerified')});}return;
  }
  if(chain?.stage==='returned'&&!state.contractChanged&&state.phase==='dependency'){
   task.sceneFamily='recurrence';task.scene=paymentChainScene(base,problem,false);if(state.ready)task.scene.descriptionKey=state.ready.reasonKey;
   const extra=paymentCausalScene(base,problem,grade).steps[0].actionFlow!.actions;
   task.scene.steps[0].actionFlow!.actions.find(a=>a.id==='trace')!.next=grade>=3?['causal-delegate','contract']:grade>=2?['contract','causal-backend','causal-metrics']:['contract','causal-backend'];
   task.scene.steps[0].actionFlow!.actions.push(...extra.filter(a=>!['causal-network','causal-client','causal-contract-hypothesis'].includes(a.id)));
   return;
  }
  if(fresh&&grade===0){
   task.sceneFamily='investigation';task.scene=structuredClone(base);
   const check=task.scene.steps.flatMap(s=>s.actionFlow?.actions??[]).find(a=>a.id==='verify-limited');
   if(check?.outcome){check.observationKey=paymentChainKeys.temporary;check.outcome.summaryKey=paymentChainKeys.temporary;check.outcome.followupKey=paymentChainKeys.recurrence;}
   return;
  }
  task.sceneFamily=state.phase==='stable'||state.phase==='review'?'review':state.phase==='incident'?'incident':grade>=3?'delegation':'dependency';
  task.scene=paymentCausalScene(base,problem,grade);if(state.ready){task.scene.descriptionKey=state.ready.reasonKey;task.scene.steps[0].bodyKey=state.ready.reasonKey;task.scene.steps[0].titleKey=state.ready.reasonKey;}return;
 }

 if(chain?.stage==='returned'&&ch.profession==='frontend'||chain?.stage==='fixed'){
  task.sceneFamily=chain.stage==='fixed'?'review':'recurrence';
  task.encounter={version:story.version,grade,previousTaskId:chain.fixedTaskId??chain.taskId,originTaskId:chain.taskId,previousActorId:chain.fixedBy??chain.actorId,contextKeys:[chain.stage==='fixed'?paymentChainKeys.fixed:paymentChainKeys.recurrence,...(chain.stage==='returned'?['story.environment']:[]),...story.limitations]};
  task.scene=paymentChainScene(base,problem,chain.stage==='fixed',chain.fixedBy!==ch.id);return;
 }
 const cause=causalContext(c,problem);
 const family=cause?.family??(grade>=3?'delegation':grade>=2?'dependency':grade===1?'artifact':'investigation');
 task.sceneFamily=family;
 task.encounter={triggerId:cause?.id,triggerDay:cause?.day,causeKey:cause?.key,previousDecisionId:cause?.decisionId,version:story.version,grade,previousTaskId:cause?.previousTaskId,originTaskId:cause?.previousTaskId,previousActorId:cause?.actorId,contextKeys:cause?['story.past',...cause.contextKeys]:[]};
 if(family!=='investigation')task.scene=storyScene(base,family,grade,problem);
 if(cause&&task.scene){task.scene.descriptionKey=cause.key;task.scene.steps[0].bodyKey=cause.key;}

}
export function recordEncounter(c:Campaign,task:Task,problem:Problem){
 const story=ensureProblemStory(c,problem);if(story.encounters.some(e=>e.taskId===task.id))return;
 const ch=c.characters.find(n=>n.id===task.characterId)!;
 const observations=Object.values(task.progress).flatMap(p=>Object.values(p.observations??{}));
 const debtImpact=task.appliedWorldEffects?.filter(e=>e.target==='techDebt').reduce((n,e)=>n+e.value,0);
 const actions=Object.values(task.progress).flatMap(p=>p.actionHistory??[]);
 const approach=actions.join(' → ');
 if(problem.category==='payment'&&ch.profession==='frontend'&&!problem.paymentChain&&actions.includes('limited')&&actions.includes('verify-limited')&&task.outcome?.kind==='temporary'){
  problem.paymentChain={stage:'workaround',actorId:ch.id,taskId:task.id,debt:Math.max(0,debtImpact??0)};
  problem.latestOutcomeKey=paymentChainKeys.temporary;
  const pending=problem.consequences?.find(e=>e.id===task.id+':outcome');if(pending){pending.outcome.summaryKey=paymentChainKeys.temporary;pending.outcome.followupKey=paymentChainKeys.recurrence;}
 }else if((problem.paymentChain?.stage==='returned'||problem.paymentChain?.stage==='workaround')&&actions.includes('shared')&&actions.includes('verify-shared')&&task.outcome?.systemChanged===true){
  problem.paymentChain.stage='fixed';problem.paymentChain.fixedBy=ch.id;problem.paymentChain.fixedTaskId=task.id;problem.paymentChain.debt=0;
 }else if(problem.paymentChain?.stage==='fixed'&&problem.paymentChain.fixedBy!==ch.id&&actions.includes('verify-inherited')&&actions.includes('handoff')){
  problem.paymentChain.stage='verified';problem.paymentChain.verifiedBy=ch.id;problem.status='resolved';
 }
 recordPaymentCompletion(c,task,problem);
 story.encounters.push({taskId:task.id,cause:task.encounter?.cause,previousDecisionId:task.encounter?.previousDecisionId,actorId:task.characterId,profession:ch.profession,grade:task.encounter?.grade??rankOf(ch),family:task.sceneFamily??'investigation',version:task.encounter?.version??story.version,approach,debtImpact,riskKeys:task.outcome?.kind==='temporary'?[task.outcome.summaryKey]:[],result:task.outcome?.kind??'checked',observations,day:c.life!.calendarDay});
 story.affectedRoles=[...new Set([...story.affectedRoles,ch.profession])];
 story.observations=[...new Set([...story.observations,...observations])].slice(-12);
 if(task.outcome?.kind==='temporary')story.limitations=[...new Set([...story.limitations,task.outcome.summaryKey])];
 else if(task.outcome?.systemChanged===true){story.version++;story.limitations=[];story.change=undefined;}
 const event={id:task.id+':encounter',day:c.life!.calendarDay,kind:'problem-encounter',key:task.outcome?.summaryKey??'story.past',actorId:task.characterId,projectId:task.projectId,problemId:task.problemId,values:{triggerId:task.encounter?.triggerId??'',triggerDay:task.encounter?.triggerDay??0,cause:task.encounter?.cause??'legacy',previousDecisionId:task.encounter?.previousDecisionId??'',family:task.sceneFamily??'investigation',version:story.version,approach}};
 problem.history.push(event);
}
export function refreshTaskReplies(c:Campaign){
 for(const task of c.tasks)for(const progress of Object.values(task.progress)){
  const d=progress.dependency;if(!d||d.ready)continue;
  const job=c.company!.delegations?.find(job=>job.id===d.delegationId);
  d.ready=d.delegationId?!!job&&job.status!=='working':c.life!.calendarDay>d.dueDay||(c.life!.calendarDay===d.dueDay&&c.time>=d.dueMinute);
  deliverPaymentReply(c,task,progress);
 }
}
