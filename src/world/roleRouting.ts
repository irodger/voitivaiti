import {causalContext} from './causalRouting';
import {paymentEncounterAvailable} from './paymentCausal';
import type {Campaign} from './types';
import type {WorkKind} from './lifeTypes';
import {hasRoleLens,supportedLensCategory} from '../content/roleLenses';

// The queue selects a world problem. A lens controls the interaction with it.
export function ordinaryProblem(c:Campaign,kind:WorkKind='bug'){
 const ch=c.characters.find(x=>x.id===c.activeCharacterId)!;
 const project=c.company!.projects.find(p=>ch.currentProjectIds.includes(p.id))??c.company!.projects[0];
 const inherited=project.problems.find(p=>p.paymentChain?.stage==='fixed'&&p.paymentChain.fixedBy!==ch.id&&(!p.paymentCausal||p.paymentCausal.phase==='stable'));
 if(inherited)return {project,problem:inherited};
 const returned=project.problems.find(p=>p.category==='payment'&&p.paymentCausal?.ready&&paymentEncounterAvailable(p,ch.id));
 if(returned&&(kind==='bug'||kind==='support'))return {project,problem:returned};
 const continuing=project.problems.filter(p=>supportedLensCategory(p.category)&&causalContext(c,p));
 continuing.sort((a,b)=>{const x=causalContext(c,a)!,y=causalContext(c,b)!;return Number(y.family==='incident')-Number(x.family==='incident')||x.day-y.day||a.id.localeCompare(b.id);});
 if(continuing.length)return {project,problem:continuing[0]};
 const item=c.life?.queue.find(q=>q.id===kind);
 const bound=c.company!.projects.find(p=>p.id===item?.projectId)?.problems.find(p=>p.id===item?.problemId);
 if(bound&&supportedLensCategory(bound.category)&&paymentEncounterAvailable(bound,ch.id))return {project:c.company!.projects.find(p=>p.id===item!.projectId)!,problem:bound};
 const preference=kind==='feature'?'interface':kind==='debt'?'performance':kind==='support'?'payment':undefined;
 const candidates=project.problems.filter(p=>supportedLensCategory(p.category)&&paymentEncounterAvailable(p,ch.id));
 candidates.sort((a,b)=>Number(!!a.story?.encounters.length)-Number(!!b.story?.encounters.length)||Number(b.status!=='resolved')-Number(a.status!=='resolved')||Number(b.category===preference)-Number(a.category===preference)||
  (b.severity+(b.workaround?4:0))-(a.severity+(a.workaround?4:0))||a.id.localeCompare(b.id));
 return {project,problem:candidates[0]};
}
export function ordinaryTemplateId(c:Campaign,kind:WorkKind){
 const ch=c.characters.find(x=>x.id===c.activeCharacterId)!;
 const problem=ordinaryProblem(c,kind).problem;
 return hasRoleLens(ch.profession)&&problem?`lens.${ch.profession}.${problem.category}`:undefined;
}
