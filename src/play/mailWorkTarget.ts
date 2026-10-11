import {activeTask} from '../world/simulation';
import type {Campaign} from '../world/types';
import type {CompanyMailMessage} from '../world/companyMailTypes';

/** Navigation reads the world; it never creates or consumes a causal encounter. */
export function mailWorkTarget(world:Campaign,mail:CompanyMailMessage){
 const project=world.company?.projects.find(p=>p.id===mail.projectId);
 const problem=project?.problems.find(p=>p.id===mail.problemId);
 const current=activeTask(world);
 const related=[...world.tasks].reverse().find(task=>task.projectId===mail.projectId&&task.problemId===mail.problemId&&!task.rewarded&&task.characterId===world.activeCharacterId);
 const previous=world.tasks.find(task=>task.id===mail.taskId&&task.projectId===mail.projectId&&task.problemId===mail.problemId);
 const canOpen=!!related&&(related.id===current?.id||related.paused&&(!current||current.rewarded)&&world.phase==='office');
 const pending=problem?.consequences?.some(c=>!c.resolved);
 const state=canOpen?'active':world.phase!=='office'?'offDuty':current&&!current.rewarded?'busy':related?.paused?'paused':pending?'waiting':problem?.status==='resolved'?'completed':'queue';
 return {project,problem,related,previous,canOpen,state};
}
