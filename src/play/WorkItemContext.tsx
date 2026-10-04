import {Clock3,History,UserRound} from 'lucide-react';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {workOwner} from '../world/workLoop';
import {characterName} from './shared';
import type {WorkItem} from '../world/lifeTypes';
import '../content/workHistoryUx';
import './workHistory.css';

export function WorkItemContext({item}:{item:WorkItem}){
 const w=useWorld(),{t}=useI18n(),owner=w.characters.find(c=>c.id===workOwner[item.id]),problem=w.company?.projects.find(p=>p.id===item.projectId)?.problems.find(p=>p.id===item.problemId),past=problem?.story?.encounters.length??0;
 return <span className="work-item-context"><span className="work-context-owner"><UserRound size={12}/>{owner?characterName(owner,t):t('ui.team')}{item.expectation&&<><Clock3 size={12}/>{t('workHistory.due',{day:item.expectation.dueDay})}</>}</span>{problem&&<span className="work-context-problem">{t(problem.titleKey)}</span>}{past>0&&<span className="work-context-history"><History size={12}/>{t('workHistory.visits',{count:past})}{problem?.workaround&&<b>{t('workHistory.temporary')}</b>}</span>}</span>;
}
