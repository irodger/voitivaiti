import type {Campaign,Problem,Task,TaskTemplate,SceneFamily} from './types';
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
 const story=ensureProblemStory(c,problem),ch=c.characters.find(n=>n.id===task.characterId)!,grade=rankOf(ch),last=story.encounters.at(-1),count=story.encounters.length;
 const chain=problem.paymentChain;
 if(chain?.stage==='returned'&&ch.profession==='frontend'||chain?.stage==='fixed'){
  task.sceneFamily=chain.stage==='fixed'?'review':'recurrence';
  task.encounter={version:story.version,grade,previousTaskId:chain.fixedTaskId??chain.taskId,originTaskId:chain.taskId,previousActorId:chain.fixedBy??chain.actorId,contextKeys:[chain.stage==='fixed'?paymentChainKeys.fixed:paymentChainKeys.recurrence,...(chain.stage==='returned'?['story.environment']:[]),...story.limitations]};
  task.scene=paymentChainScene(base,problem,chain.stage==='fixed',chain.fixedBy!==ch.id);return;
 }
 if(problem.category==='payment'&&ch.profession==='frontend'&&!chain){
  task.scene=structuredClone(base);
  const check=task.scene.steps.flatMap(s=>s.actionFlow?.actions??[]).find(a=>a.id==='verify-limited')!;
  check.observationKey=paymentChainKeys.temporary;check.outcome!.summaryKey=paymentChainKeys.temporary;check.outcome!.followupKey=paymentChainKeys.recurrence;
 }
 let family:SceneFamily='investigation';
 if(grade>=3)family=count%2?'coordination':'delegation';
 else if(problem.workaround&&count&&count%2)family='recurrence';
 else if(count||grade){
  const families:SceneFamily[]=grade>=2?['dependency','review','incident','artifact','coordination']:['artifact','review','dependency','incident','coordination'];
  family=families[count%families.length];
 }
 // A new report names its changed condition. A verified earlier result remains in history.
 if(last&&!story.change)story.change=last.result==='temporary'?'environment':'contract';
 const origin=problem.workaround?[...story.encounters].reverse().find(e=>e.result==='temporary'):undefined;
 task.sceneFamily=family;
 task.encounter={version:story.version,grade,previousTaskId:last?.taskId,originTaskId:origin?.taskId,previousActorId:last?.actorId,contextKeys:[...(last?['story.past']:[]),...(problem.latestOutcomeKey?[problem.latestOutcomeKey]:[]),...(last?[last.result==='temporary'?'story.environment':'story.stable','story.'+(story.change??'contract')]:[]),...story.limitations]};
 if(family!=='investigation')task.scene=storyScene(base,family,grade,problem);
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
 story.encounters.push({taskId:task.id,actorId:task.characterId,profession:ch.profession,grade:task.encounter?.grade??rankOf(ch),family:task.sceneFamily??'investigation',version:task.encounter?.version??story.version,approach,debtImpact,riskKeys:task.outcome?.kind==='temporary'?[task.outcome.summaryKey]:[],result:task.outcome?.kind??'checked',observations,day:c.life!.calendarDay});
 story.affectedRoles=[...new Set([...story.affectedRoles,ch.profession])];
 story.observations=[...new Set([...story.observations,...observations])].slice(-12);
 if(task.outcome?.kind==='temporary')story.limitations=[...new Set([...story.limitations,task.outcome.summaryKey])];
 else if(task.outcome?.systemChanged===true){story.version++;story.limitations=[];story.change=undefined;}
 const event={id:task.id+':encounter',day:c.life!.calendarDay,kind:'problem-encounter',key:task.outcome?.summaryKey??'story.past',actorId:task.characterId,projectId:task.projectId,problemId:task.problemId,values:{family:task.sceneFamily??'investigation',version:story.version,approach}};
 problem.history.push(event);
}
export function refreshTaskReplies(c:Campaign){
 for(const task of c.tasks)for(const progress of Object.values(task.progress)){
  const d=progress.dependency;if(!d||d.ready)continue;
  const job=c.company!.delegations?.find(job=>job.id===d.delegationId);
  d.ready=d.delegationId?!!job&&job.status!=='working':c.life!.calendarDay>d.dueDay||(c.life!.calendarDay===d.dueDay&&c.time>=d.dueMinute);
 }
}
