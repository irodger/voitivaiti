import type {Campaign} from './types';
import type {WorkKind} from './lifeTypes';
import {hasRoleLens,supportedLensCategory} from '../content/roleLenses';

// The queue selects a world problem. A lens controls the interaction with it.
export function ordinaryProblem(c:Campaign,kind:WorkKind='bug'){
 const ch=c.characters.find(x=>x.id===c.activeCharacterId)!;
 const project=c.company!.projects.find(p=>ch.currentProjectIds.includes(p.id))??c.company!.projects[0];
 const item=c.life?.queue.find(q=>q.id===kind);
 const bound=c.company!.projects.find(p=>p.id===item?.projectId)?.problems.find(p=>p.id===item?.problemId&&p.status!=='resolved');
 if(bound&&supportedLensCategory(bound.category))return {project:c.company!.projects.find(p=>p.id===item!.projectId)!,problem:bound};
 const preference=kind==='feature'?'interface':kind==='debt'?'performance':kind==='support'?'payment':undefined;
 const candidates=project.problems.filter(p=>supportedLensCategory(p.category));
 candidates.sort((a,b)=>Number(b.status!=='resolved')-Number(a.status!=='resolved')||Number(b.category===preference)-Number(a.category===preference)||
  (b.severity+(b.workaround?4:0)-3*(ch.scenarioCounts[`lens.${ch.profession}.${b.category}`]??0))-(a.severity+(a.workaround?4:0)-3*(ch.scenarioCounts[`lens.${ch.profession}.${a.category}`]??0))||a.id.localeCompare(b.id));
 return {project,problem:candidates[0]};
}
export function ordinaryTemplateId(c:Campaign,kind:WorkKind){
 const ch=c.characters.find(x=>x.id===c.activeCharacterId)!;
 const problem=ordinaryProblem(c,kind).problem;
 return hasRoleLens(ch.profession)&&problem?`lens.${ch.profession}.${problem.category}`:undefined;
}
