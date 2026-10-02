import {templateById} from '../content/scenarios';
import type {Campaign} from './types';
import {rememberExperience,rankOf} from './mastery';
export function startPerspective(c:Campaign){const task=c.tasks.find(t=>t.id===c.activeTaskId),ch=c.characters.find(ch=>ch.id===c.activeCharacterId)!;if(!task?.rewarded||ch.completedWork.length<2||c.perspective||ch.experience?.some(e=>e.id==='perspective:'+task.id))return false;c.perspective={taskId:task.id,profession:ch.profession==='qa'?'frontend':'qa',stage:0,observations:[],completed:false};return true;}
export function perspectiveAction(c:Campaign,id:string){const ep=c.perspective,ch=c.characters.find(ch=>ch.id===c.activeCharacterId)!;if(!ep)return false;const task=c.tasks.find(t=>t.id===ep.taskId)!;
 if(id==='close'){delete c.perspective;return true;}if(ep.completed)return false;
 const sequence=['reproduce','environment','regression'];if(ep.stage<3){if(id!==sequence[ep.stage])return false;ep.observations.push('mastery.'+(ep.profession==='qa'?'qa':'front')+(ep.stage+1));if(ep.stage===1){const original=templateById[task.templateId],lens=templateById['lens.'+ep.profession+'.'+original.category];const fact=lens?.steps[0].actionFlow?.actions.find(a=>a.id==='trace')?.observationKey;if(fact)ep.observations.push(fact,'mastery.originalConditions');}if(ep.stage===2&&task.outcome){const lens=templateById['lens.'+ep.profession+'.'+templateById[task.templateId].category];const result=lens?.steps[1].actionFlow?.actions.find(a=>a.id==='verify-'+(task.outcome!.kind==='temporary'?'limited':'shared'))?.observationKey;if(result)ep.observations.push(result);}ep.stage++;c.time+=5;return true;}
 if(!['approve','request','mentor'].includes(id)||id==='mentor'&&rankOf(ch)<1)return false;
 const problem=c.company!.projects.find(p=>p.id===task.projectId)!.problems.find(p=>p.id===task.problemId)!;
 // A temporary workaround cannot become fully approved merely by visiting QA.
 const returned=id==='request'||id==='approve'&&!!problem.workaround;
 ep.choice=returned?'return':'approve';ep.observations.push('mastery.'+(id==='mentor'?'mentorResult':returned?'returnResult':'approveResult'));ep.completed=true;
 if(!returned&&!problem.contributions.includes(ep.profession==='qa'?'validation':'repair'))problem.contributions.push(ep.profession==='qa'?'validation':'repair');
 if(returned){problem.discovered=true;problem.status='planned';}else if(problem.contributions.includes('repair')&&problem.contributions.includes('validation'))problem.status='resolved';
 rememberExperience(c,['cross-team',...(id==='mentor'?['mentoring']:[])],'perspective:'+task.id,'mastery.episodeTitle',task);
 c.meta!.perspectives[ep.profession]=[...new Set([...(c.meta!.perspectives[ep.profession]??[]),problem.category])];
 const event={id:'perspective:'+task.id,day:c.company!.currentDay,kind:'perspective',key:ep.observations.at(-1)!,actorId:ch.id,problemId:problem.id,projectId:task.projectId};problem.history.push(event);c.company!.history.push(event);c.company!.projects.find(p=>p.id===task.projectId)!.history.push(event);return true;
}
