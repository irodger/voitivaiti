import type { Campaign,Effect,Step,Task } from './types';
import type { ProfessionalDecision } from './lifeTypes';
export const isConsequential=(step:Step)=>step.resolution==='consequential';
// Fixed at commitment time: reloading cannot reroll a consequence.
export function recordDecision(c:Campaign,task:Task,step:Step,immediate:Effect[]){
 const entries=c.life!.professionalDecisions??=[],p=task.progress[step.id],ch=c.characters.find(x=>x.id===task.characterId)!;
 const decisionId=task.id+':'+step.id;if(entries.some(d=>d.decisionId===decisionId))return;
 const choiceId=p.choiceId??JSON.stringify(step.type==='resource-allocation'?p.allocation:p.draft);
 const option=step.options?.find(o=>o.id===choiceId);
 const selection=option?undefined:step.type==='resource-allocation'?step.items?.filter(i=>(p.allocation[i.id]??0)>0).map(i=>({labelKey:i.labelKey,amount:p.allocation[i.id]})):p.draft.map(id=>({labelKey:step.items!.find(i=>i.id===id)!.labelKey}));
 const debt=immediate.find(e=>e.target==='techDebt')?.value??0;
 const style=option?.decisionStyle??(debt>0?'speed':'quality');
 const tags:string[]=[style==='speed'?'productFirstDecisions':'qualityFirstDecisions',...(debt<0?['techDebtPrioritized']:debt>0?['techDebtIgnored']:[])];
 if(step.type==='incident-response'&&p.draft[0]!==step.items?.[0]?.id)tags.push('riskyDeploys');
 if(task.templateId==='lead-review'&&p.draft.includes('item-2'))tags.push('ignoredReview');
 if(task.templateId==='qa-regression'&&!p.draft.includes('item-1'))tags.push('ignoredQa');
 const context={stability:c.company!.stability,techDebt:c.company!.techDebt,culture:c.company!.culture};
 const seed=Array.from(decisionId+choiceId).reduce((n,ch)=>(Math.imul(n,31)+ch.charCodeAt(0))>>>0,c.company!.seed);
 const risk=Math.max(10,Math.min(80,100-context.stability+context.techDebt/3));
 const fast=tags.some(t=>['productFirstDecisions','riskyDeploys','ignoredQa','ignoredReview'].includes(t));
 const delayedEffects:Effect[]=fast?(seed%100<risk?[{target:'stability',value:-4},{target:'stress',value:3}]:[{target:'reputation',value:2}]):context.culture==='fast'?[{target:'stress',value:2},{target:'techDebt',value:-2}]:[{target:'stability',value:3}];
 entries.push({decisionId,choiceId,choiceLabelKey:option?.labelKey??step.titleKey,selection,profession:ch.profession,characterId:ch.id,companyId:c.company!.id,projectId:task.projectId,day:c.life!.calendarDay,minute:c.time,npcId:step.speaker??(tags.includes('ignoredQa')?'max':tags.includes('ignoredReview')?'ilya':'sergey'),tags,immediateEffects:structuredClone(immediate),delayedEffects,dueDay:c.life!.calendarDay+2+seed%3,resolved:false,context});
 c.life!.professionalDecisions=entries;
}
export function resolveDecisions(c:Campaign){for(const d of c.life?.professionalDecisions??[]){if(d.resolved||d.dueDay>c.life!.calendarDay||d.companyId!==c.company?.id)continue;d.resolved=true;if(d.delayedEffects.some(e=>e.target==='stability'&&e.value<0)){for(const kind of ['ignoredQa','ignoredReview','riskyDeploys'] as const){if(d.tags.includes(kind)){c.life!.decisions[kind]++;c.life!.decisionHistory.push({day:c.life!.calendarDay,kind});}}}const ch=c.characters.find(x=>x.id===d.characterId),project=c.company.projects.find(x=>x.id===d.projectId);if(!ch)continue;for(const e of d.delayedEffects){if(e.target==='stress')ch.stats.stress=Math.max(0,Math.min(100,ch.stats.stress+e.value));if(e.target==='reputation')ch.stats.reputation+=e.value;if(e.target==='techDebt'||e.target==='stability'){c.company[e.target]=Math.max(0,Math.min(100,c.company[e.target]+e.value));if(project)project[e.target]=Math.max(0,Math.min(100,project[e.target]+e.value));}}}}
export function decisionOutcome(d:ProfessionalDecision){return d.delayedEffects.some(e=>e.target==='stability'&&e.value<0)?'decision.followup.risk':d.delayedEffects.some(e=>e.target==='reputation')?'decision.followup.speed':'decision.followup.care';}
