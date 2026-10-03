import {resolveTaskTemplate} from '../content/scenarios';
import {templateById} from '../content/scenarios';
import type {Campaign} from './types';
import {rememberExperience,rankOf} from './mastery';
export function startPerspective(c:Campaign){const task=c.tasks.find(t=>t.id===c.activeTaskId),ch=c.characters.find(ch=>ch.id===c.activeCharacterId)!;if(!task?.rewarded||ch.completedWork.length<2||c.perspective||ch.experience?.some(e=>e.id==='perspective:'+task.id))return false;c.perspective={taskId:task.id,profession:ch.profession==='qa'?'frontend':'qa',stage:0,observations:[],completed:false};return true;}
export function perspectiveAction(c:Campaign,id:string){const ep=c.perspective,ch=c.characters.find(ch=>ch.id===c.activeCharacterId)!;if(!ep)return false;const task=c.tasks.find(t=>t.id===ep.taskId)!;
 if(id==='close'){c.perspective=undefined;return true;}if(ep.completed)return false;
 const sequence=['reproduce','environment','regression'];if(ep.stage<3){if(id!==sequence[ep.stage])return false;ep.observations.push('mastery.'+(ep.profession==='qa'?'qa':'front')+(ep.stage+1));if(ep.stage===1){const original=resolveTaskTemplate(task),lens=templateById['lens.'+ep.profession+'.'+original.category];const fact=lens?.steps[0].actionFlow?.actions.find(a=>a.id==='trace')?.observationKey;if(fact)ep.observations.push(fact,'mastery.originalConditions');}if(ep.stage===2&&task.outcome){const lens=templateById['lens.'+ep.profession+'.'+resolveTaskTemplate(task).category];const result=lens?.steps[1].actionFlow?.actions.find(a=>a.id==='verify-'+(task.outcome!.kind==='temporary'?'limited':'shared'))?.observationKey;if(result)ep.observations.push(result);}ep.stage++;c.time+=5;return true;}
 if(ep.stage===3&&id==='mentor'){if(rankOf(ch)<1)return false;ep.stage=4;return true;}
 if(ep.stage===4){if(id!=='teach-case')return false;ep.observations.push('mastery.teachCaseResult');ep.stage=5;c.time+=10;return true;}
 const mentoring=ep.stage===5&&id==='teach-limits';
 if(!mentoring&&(ep.stage!==3||!['approve','request'].includes(id)))return false;
 const problem=c.company!.projects.find(p=>p.id===task.projectId)!.problems.find(p=>p.id===task.problemId)!;
 // A temporary workaround cannot become fully approved merely by visiting QA.
 const returned=id==='request'||!!problem.workaround;
 ep.choice=returned?'return':'approve';ep.observations.push('mastery.'+(mentoring?(returned?'mentorLimited':'mentorResult'):returned?'returnResult':'approveResult'));ep.completed=true;if(mentoring)c.time+=10;
 if(!returned&&!problem.contributions.includes(ep.profession==='qa'?'validation':'repair'))problem.contributions.push(ep.profession==='qa'?'validation':'repair');
 if(returned){problem.discovered=true;problem.status='planned';}else if(problem.contributions.includes('repair')&&problem.contributions.includes('validation'))problem.status='resolved';
 rememberExperience(c,['cross-team',...(mentoring?['mentoring']:['review'])],'perspective:'+task.id,'mastery.episodeTitle',task,{outcome:ep.observations.at(-1),recipientProfession:mentoring?ep.profession:undefined});
 c.meta!.perspectives[ep.profession]=[...new Set([...(c.meta!.perspectives[ep.profession]??[]),problem.category])];
 const event={id:'perspective:'+task.id,day:c.life!.calendarDay,kind:'perspective',key:ep.observations.at(-1)!,actorId:ch.id,problemId:problem.id,projectId:task.projectId};problem.history.push(event);c.company!.history.push(event);c.company!.projects.find(p=>p.id===task.projectId)!.history.push(event);return true;
}
