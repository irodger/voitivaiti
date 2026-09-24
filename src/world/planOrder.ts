import type {Step} from './types';
export const isOrderedPlan=(step:Step)=>['planning','incident-response'].includes(step.type);
export function planOrder(step:Step,draft:string[]){
 const ids=step.items?.map(item=>item.id)??[];
 return [...new Set([...draft.filter(id=>ids.includes(id)),...ids])];
}
