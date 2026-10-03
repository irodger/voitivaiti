import {resolveTaskTemplate} from '../content/scenarios';
import {professionById} from '../content/professions';
import type {Campaign,Character,Task,Experience} from './types';
export const rankOf=(ch:Character)=>Math.max(0,professionById[ch.profession].careers.findIndex(n=>n.id===ch.careerNodeId));
export function rememberExperience(c:Campaign,tags:string[],id:string,titleKey:string,task?:Task,proof?:Partial<Experience>){
 const ch=c.characters.find(ch=>ch.id===c.activeCharacterId)!;ch.experience??=[];if(ch.experience.some(e=>e.id===id))return;
 const tpl=task&&resolveTaskTemplate(task);
 ch.experience.push({id,titleKey,tags,taskId:task?.id,problemId:task?.problemId,projectId:task?.projectId,profession:ch.profession,grade:rankOf(ch),day:c.life!.calendarDay,context:tpl?.category,resultKind:task?.outcome?.kind??'checked',confirmed:!!task?.rewarded,...proof});
}
export function recordWorkExperience(c:Campaign,task:Task){
 const tpl=resolveTaskTemplate(task);if(!tpl||!task.rewarded)return;
 const ch=c.characters.find(n=>n.id===c.activeCharacterId)!,tags=['guided',tpl.category],lens=task.templateId.startsWith('lens.');
 if(lens||ch.completedWork.length>2)tags.push('autonomy');
 if(lens||tpl.steps.some(s=>['planning','estimate','resource-allocation','dependency-map','architecture-diagram'].includes(s.type)))tags.push('planning');
 if(lens||tpl.steps.some(s=>s.resolution==='consequential'))tags.push('tradeoff','ambiguity');
 if(tpl.steps.some(s=>s.app==='chat'||s.type==='review'))tags.push('communication','cross-team');
 // Ownership includes investigation, verification and handoff; it need not be a production code change.
 if(lens&&tpl.steps.every(s=>task.progress[s.id]?.status==='completed'))tags.push('ownership','review');
 else if(tpl.steps.some(s=>['review','release-check'].includes(s.type)))tags.push('review','ownership');
 if(tpl.category==='payment'||tpl.category==='performance'||tpl.steps.some(s=>s.type==='incident-response'))tags.push('production');
 if(task.workKind&&c.life!.queue.find(q=>q.id===task.workKind)?.explained)tags.push('prioritization');
 if(task.legacyActorId||task.outcome?.kind==='temporary')tags.push('consequences');
 if(task.templateId==='lead-review')tags.push('mentoring');
 rememberExperience(c,tags,'work:'+task.id,tpl.titleKey,task,{outcome:task.outcome?.summaryKey??'ui.taskComplete'});
}
// A single context contributes at most three stories per kind and grade.
// Assignment clicks and XP never replace different completed responsibilities.
function stories(ch:Character,rank:number){
 const groups=new Map<string,number>();
 return (ch.experience??[]).filter(e=>{
  if(!e.confirmed||e.grade<rank-1||!e.context)return false;
  const key=[e.context,e.tags.includes('delegation')?'delegation':e.tags.includes('mentoring')?'mentoring':e.id.startsWith('perspective:')?'review':'work'].join(':');
  const count=groups.get(key)??0;groups.set(key,count+1);return count<3;
 });
}
export function promotionChecks(ch:Character,nodeId:string){
 const rank=Number(nodeId.split('-')[1]),recent=stories(ch,rank),work=recent.filter(e=>e.id.startsWith('work:'));
 const count=(tag:string)=>recent.filter(e=>e.tags.includes(tag)).length;
 const contexts=(items:Experience[])=>new Set(items.map(e=>e.context)).size;
 const check=(key:string,current:number,required:number)=>({key:'mastery.'+key,met:current>=required,current,required});
 const checks=rank===1?[
  check('autonomy',work.filter(e=>e.tags.includes('autonomy')).length,4),check('variety',contexts(work),2),check('planning',count('planning'),3),check('cross-team',count('cross-team'),2)
 ]:rank===2?[
  check('responsibility',work.length,6),check('variety',contexts(work),2),check('ambiguity',count('ambiguity'),3),check('production',count('production'),2),check('ownership',count('ownership'),3),check('cross-team',count('cross-team'),3),check('mentoringOrReview',recent.filter(e=>e.tags.includes('mentoring')||e.tags.includes('review')).length,2)
 ]:[
  check('responsibility',work.length,6),check('delegation',count('delegation'),3),check('delegationVariety',contexts(recent.filter(e=>e.tags.includes('delegation'))),2),check('prioritization',count('prioritization'),3),check('people',count('people'),3),check('ownership',count('ownership'),3),check('consequences',count('consequences'),2)
 ];
 checks.push(check('warning',(ch.reviewStage??0)===0?1:0,1));checks.at(-1)!.key='promotion.warning';return checks;
}
export function restoreExperience(c:Campaign){
 for(const ch of c.characters){
  if(ch.experienceVersion===2)continue;
  const old=ch.experience??[];ch.experience=[];const active=c.activeCharacterId;c.activeCharacterId=ch.id;
  for(const task of c.tasks.filter(t=>t.characterId===ch.id&&t.rewarded)){
   recordWorkExperience(c,task);const restored=ch.experience.at(-1),previous=old.find(e=>e.id==='work:'+task.id);
   if(restored){restored.grade=previous?.grade??0;restored.day=previous?.day??(Number(task.id.split('-')[1])||1);}
  }
  for(const e of old.filter(e=>e.id.startsWith('perspective:')&&e.taskId)){
   const task=c.tasks.find(t=>t.id===e.taskId&&t.rewarded);if(task)ch.experience.push({...e,confirmed:true,context:resolveTaskTemplate(task)?.category,resultKind:task.outcome?.kind??'checked'});
  }
  ch.experienceVersion=2;c.activeCharacterId=active;
 }
}
