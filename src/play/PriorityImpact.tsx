import {Clock3,Users} from 'lucide-react';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {activeCharacter} from '../world/simulation';
import {availableWork} from '../world/workLoop';
import {WorkItemContext} from './WorkItemContext';
import type {WorkKind} from '../world/lifeTypes';
import '../content/priorityImpact';
import './priorityImpact.css';

export function PriorityImpact({chosen}:{chosen:WorkKind}){
 const w=useWorld(),{t}=useI18n(),allowed=availableWork(activeCharacter(w));
 const waiting=w.life?.queue.filter(q=>q.id!==chosen&&q.status!=='done'&&!q.delegatedTo&&allowed.includes(q.id))??[];
 if(!waiting.length)return null;
 return <aside className="priority-impact"><h4><Users size={16}/>{t('priorityImpact.title')}</h4><p><Clock3 size={14}/>{t('priorityImpact.hint')}</p><ul>{waiting.map(q=><li key={q.id}><b>{t('life.work.'+q.id)}</b><WorkItemContext item={q}/><small>{t('priorityImpact.'+(q.expectation?(w.life!.calendarDay>q.expectation.dueDay?'overdue':w.life!.calendarDay===q.expectation.dueDay?'today':'later'):'unagreed'))}</small></li>)}</ul></aside>;
}
