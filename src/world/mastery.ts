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
 const tags=['guided',tpl.category];
 const completed=tpl.steps.filter(s=>task.progress[s.id]?.status==='completed');
 const performed=completed.flatMap(s=>(task.progress[s.id]?.actionHistory??[]).flatMap(id=>s.actionFlow?.actions.filter(a=>a.id===id)??[]));
 const did=(ids:string[])=>performed.some(a=>ids.includes(a.id));
 const add=(...values:string[])=>tags.push(...values);
 for(const action of performed)add(...(action.experienceTags??[]));
 if(did(['limited','shared','apply-limited','apply-shared','split','full','comment','approve-bounds']))add('autonomy','planning','tradeoff');
 if(did(['trace','crosscheck','experiment','environment','metrics']))add('ambiguity');
 if(did(['handoff','request','reply','contract']))add('communication','cross-team');
 if(did(['verify-shared','verify-limited','verified-result','bounded-result'])&&did(['handoff']))add('ownership');
 if(did(['inspect-review','comment','approve-bounds']))add('review');
 if(task.outcome?.systemChanged===true&&did(['verify-shared','verified-result']))add('production');
 if(performed.some(a=>a.delegates&&(a.id!=='causal-delegate'||Object.values(task.progress).some(p=>p.dependency?.delegationId))))add('delegation');
 // Legacy mechanics have completion evidence even without an action log.
 const mechanical=completed.filter(s=>!s.actionFlow);
 if(mechanical.some(s=>['planning','estimate','resource-allocation','dependency-map','architecture-diagram'].includes(s.type)))add('planning');
 if(mechanical.some(s=>s.resolution==='consequential'))add('tradeoff','ambiguity');
 if(mechanical.some(s=>s.app==='chat'))add('communication','cross-team');
 if(mechanical.some(s=>['review','release-check'].includes(s.type)))add('review','ownership');
 if(mechanical.some(s=>s.type==='incident-response'))add('production');
 if(mechanical.length&&completed.length===tpl.steps.length&&c.characters.find(n=>n.id===task.characterId)!.completedWork.length>2)add('autonomy');
 if(task.workKind&&c.life!.queue.find(q=>q.id===task.workKind)?.explained)add('prioritization');
 if(task.outcome?.kind==='temporary'||did(['previous','inspect-inherited']))add('consequences');
 rememberExperience(c,[...new Set(tags)],'work:'+task.id,tpl.titleKey,task,{outcome:task.outcome?.summaryKey??'ui.taskComplete'});
}
// A single context contributes at most three stories per kind and grade.
// Assignment clicks and XP never replace different completed responsibilities.
function stories(ch:Character,rank:number){
 const groups=new Map<string,Experience[]>();
 for(const e of ch.experience??[]){
  if(!e.confirmed||e.grade<rank-1||!e.context)continue;
  const key=[e.context,e.tags.includes('delegation')?'delegation':e.tags.includes('mentoring')?'mentoring':e.id.startsWith('perspective:')?'review':'work'].join(':');
  groups.set(key,[...(groups.get(key)??[]),e]);
 }
 // Keep the same cap, but retain diverse demonstrated responsibilities rather
 // than letting the first three assignments hide all later evidence.
 return [...groups.values()].flatMap(entries=>{
  const selected:Experience[]=[],covered=new Set<string>();
  while(entries.length&&selected.length<3){
   const score=(e:Experience)=>e.tags.reduce((n,t)=>n+(covered.has(t)?1:4),0);
   entries.sort((a,b)=>score(b)-score(a)||b.day-a.day);
   const e=entries.shift()!;selected.push(e);e.tags.forEach(t=>covered.add(t));
  }
  return selected;
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
  if(ch.experienceVersion===3)continue;
  const old=ch.experience??[];ch.experience=[];const active=c.activeCharacterId;c.activeCharacterId=ch.id;
  for(const task of c.tasks.filter(t=>t.characterId===ch.id&&t.rewarded)){
   recordWorkExperience(c,task);const restored=ch.experience.at(-1),previous=old.find(e=>e.id==='work:'+task.id);
   if(restored){restored.grade=previous?.grade??0;restored.day=previous?.day??(Number(task.id.split('-')[1])||1);}
  }
  for(const e of old.filter(e=>e.id.startsWith('perspective:')&&e.taskId)){
   const task=c.tasks.find(t=>t.id===e.taskId&&t.rewarded);if(task)ch.experience.push({...e,confirmed:true,context:resolveTaskTemplate(task)?.category,resultKind:task.outcome?.kind??'checked'});
  }
  ch.experienceVersion=3;c.activeCharacterId=active;
 }
}
