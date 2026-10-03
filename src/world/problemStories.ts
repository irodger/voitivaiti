import type {Campaign,Problem,Task,TaskTemplate,SceneFamily} from './types';
import {storyScene} from '../content/storyScenes';
import {rankOf} from './mastery';

export function ensureProblemStory(c:Campaign,problem:Problem){
 if(problem.story)return problem.story;
 problem.story={version:1,limitations:[],observations:[],affectedRoles:[],encounters:[]};
 for(const task of c.tasks.filter(t=>t.problemId===problem.id&&t.rewarded))recordEncounter(c,task,problem);
 return problem.story;
}
export function prepareEncounter(c:Campaign,task:Task,base:TaskTemplate,problem:Problem){
 if(!task.templateId.startsWith('lens.'))return;
 const story=ensureProblemStory(c,problem),ch=c.characters.find(n=>n.id===task.characterId)!,grade=rankOf(ch),last=story.encounters.at(-1),count=story.encounters.length;
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
 const approach=Object.values(task.progress).flatMap(p=>p.actionHistory??[]).join(' → ');
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
