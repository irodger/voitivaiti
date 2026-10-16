import { Clock3,Users } from 'lucide-react';
import '../content/priorityImpact';
import type { WorkKind } from '../world/lifeTypes';
import './priorityImpact.css';
import { usePriorityImpact } from './usePriorityImpact';
import { WorkItemContext } from './WorkItemContext';

export function PriorityImpact({chosen}:{chosen:WorkKind}){
const model=usePriorityImpact({chosen});if(!model)return null;const {w,t,waiting}=model;

 return <aside className="priority-impact"><h4><Users size={16}/>{t('priorityImpact.title')}</h4><p><Clock3 size={14}/>{t('priorityImpact.hint')}</p><ul>{waiting.map(q=><li key={q.id}><b>{t('life.work.'+q.id)}</b><WorkItemContext item={q}/><small>{t('priorityImpact.'+(q.expectation?(w.life!.calendarDay>q.expectation.dueDay?'overdue':w.life!.calendarDay===q.expectation.dueDay?'today':'later'):'unagreed'))}</small></li>)}</ul></aside>;
}
