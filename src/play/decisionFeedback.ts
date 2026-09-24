import type {Step,StepProgress} from '../world/types';
type Translate=(key:string,params?:Record<string,string|number>)=>string;

// Describe only committed choices and present risks, never a future outcome.
export function decisionFeedback(step:Step,p:StepProgress,t:Translate){
 const label=(id:string)=>t(step.items?.find(item=>item.id===id)?.labelKey??id);
 const option=step.options?.find(item=>item.id===p.choiceId);
 if(option){
  const debt=option.effects?.find(effect=>effect.target==='techDebt')?.value??0;
  return t(debt>0?'consequence.shortcut':debt<0?'consequence.foundation':'consequence.choice',{choice:t(option.labelKey)});
 }
 if(step.type==='resource-allocation'){
  const uncovered=step.items?.filter(item=>(p.allocation[item.id]??0)===0).map(item=>t(item.labelKey))??[];
  const remaining=(step.budget??0)-Object.values(p.allocation).reduce((a,b)=>a+b,0);
  return [t('consequence.allocated'),uncovered.length?t('consequence.uncovered',{items:uncovered.join('; ')}):'',remaining>0?t('consequence.reserve',{amount:remaining}):t('consequence.noReserve')].filter(Boolean).join(' ');
 }
 const expected=Array.isArray(step.solution)?step.solution:[],missing=expected.filter(id=>!p.draft.includes(id));
 const ordered=['planning','incident-response'].includes(step.type);
 if(ordered){
  const report=p.draft.indexOf('report'),edge=p.draft.indexOf('edge');
  if(report>=0&&(edge<0||report<edge))return t('consequence.earlyReport');
  if(missing.length)return t('consequence.incompletePlan',{items:missing.map(label).join('; ')});
  const reordered=expected.some((id,index)=>p.draft[index]!==id);
  return t(reordered?'consequence.reordered':'consequence.coveredPlan',{first:label(p.draft[0])});
 }
 return missing.length?t('consequence.missed',{items:missing.map(label).join('; ')}):t('consequence.covered');
}
