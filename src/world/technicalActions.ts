import type {Step,StepProgress} from './types';

export function availableTechnicalActions(step:Step,progress:StepProgress){
 const flow=step.actionFlow;if(!flow||progress.status==='completed')return [];
 const history=progress.actionHistory??[];
 const last=flow.actions.find(a=>a.id===history.at(-1));
 const ids=last?.next??(history.length?[]:flow.initial);
 return flow.actions.filter(a=>ids.includes(a.id)&&!history.includes(a.id));
}
