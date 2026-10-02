import {professionById} from '../content/professions';
import {templateById} from '../content/scenarios';
import type {Campaign,Character,Task} from './types';
export const rankOf=(ch:Character)=>Math.max(0,professionById[ch.profession].careers.findIndex(n=>n.id===ch.careerNodeId));
export function rememberExperience(c:Campaign,tags:string[],id:string,titleKey:string,task?:Task){const ch=c.characters.find(ch=>ch.id===c.activeCharacterId)!;ch.experience??=[];if(ch.experience.some(e=>e.id===id))return;ch.experience.push({id,titleKey,tags,taskId:task?.id,problemId:task?.problemId,projectId:task?.projectId,profession:ch.profession,grade:rankOf(ch),day:c.life!.calendarDay});}
export function recordWorkExperience(c:Campaign,task:Task){
 const tpl=templateById[task.templateId];if(!tpl)return;
 const tags=['guided',tpl.category];
 if(task.templateId.startsWith('lens.'))tags.push('autonomy','planning','tradeoff');else {const ch=c.characters.find(n=>n.id===c.activeCharacterId)!;if(ch.completedWork.length>2)tags.push('autonomy');if(tpl.steps.some(s=>['planning','estimate','resource-allocation','dependency-map','architecture-diagram'].includes(s.type)))tags.push('planning');if(tpl.steps.some(s=>s.resolution==='consequential'))tags.push('tradeoff');if(ch.completedWork.length>2&&tpl.steps.some(s=>['review','release-check','terminal','visual-compare'].includes(s.type)))tags.push('ownership');}
 if(tpl.steps.some(s=>s.app==='chat'||s.type==='review'))tags.push('communication','cross-team');
 if(task.outcome?.kind==='durable')tags.push('ownership');
 if(tpl.category==='payment'||tpl.category==='performance'||tpl.steps.some(s=>s.type==='incident-response'))tags.push('production');
 if(task.templateId==='lead-plan')tags.push('prioritization','people');
 if(task.templateId==='lead-review')tags.push('mentoring');
 rememberExperience(c,tags,'work:'+task.id,tpl.titleKey,task);
}
export function promotionChecks(ch:Character,nodeId:string){
 const rank=Number(nodeId.split('-')[1]),all=ch.experience??[],recent=all.filter(e=>e.grade>=rank-1),has=(tag:string)=>recent.some(e=>e.tags.includes(tag));
 const needed=rank===1?['autonomy','planning','cross-team']:rank===2?['production','tradeoff','ownership','mentoring']:['prioritization','delegation','people','ownership'];
 const checks=needed.map(tag=>({key:'mastery.'+tag,met:has(tag)}));
 if(rank===1)checks.unshift({key:'mastery.variety',met:new Set(all.filter(e=>e.taskId).flatMap(e=>e.tags.filter(t=>['interface','payment','performance','access','delivery'].includes(t)))).size>=2});
 checks.push({key:'promotion.warning',met:(ch.reviewStage??0)===0});return checks;
}
export function restoreExperience(c:Campaign){for(const ch of c.characters){if(ch.experience!==undefined)continue;ch.experience=[];const active=c.activeCharacterId;c.activeCharacterId=ch.id;for(const task of c.tasks.filter(t=>t.characterId===ch.id&&t.rewarded)){recordWorkExperience(c,task);const restored=ch.experience.at(-1);if(restored){restored.grade=0;restored.day=Number(task.id.split('-')[1])||1;}}c.activeCharacterId=active;}}
