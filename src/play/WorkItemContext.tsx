import { Clock3,History,UserRound } from 'lucide-react';
import '../content/workHistoryUx';
import type { WorkItem } from '../world/lifeTypes';
import { characterName } from './shared';
import { useWorkItemContext } from './useWorkItemContext';
import './workHistory.css';

export function WorkItemContext({item}:{item:WorkItem}){
const {t,owner,problem,past}=useWorkItemContext({item});

 return <span className="work-item-context"><span className="work-context-owner"><UserRound size={12}/>{owner?characterName(owner,t):t('ui.team')}{item.expectation&&<><Clock3 size={12}/>{t('workHistory.due',{day:item.expectation.dueDay})}</>}</span>{problem&&<span className="work-context-problem">{t(problem.titleKey)}</span>}{past>0&&<span className="work-context-history"><History size={12}/>{t('workHistory.visits',{count:past})}{problem?.workaround&&<b>{t('workHistory.temporary')}</b>}</span>}</span>;
}
