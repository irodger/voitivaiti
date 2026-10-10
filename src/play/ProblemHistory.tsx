import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {characterName} from './shared';
import {TermText} from './TermText';
import type {Task} from '../world/types';
import '../content/workHistoryUx';
import './workHistory.css';
export function ProblemHistory({task}:{task:Task}){
 const w=useWorld(),{t}=useI18n(),problem=w.company?.projects.find(p=>p.id===task.projectId)?.problems.find(p=>p.id===task.problemId),story=problem?.story;
 if(!story?.encounters.length)return null;
 return <details className="problem-history"><summary>{t('workHistory.title')} · {story.encounters.length}</summary>{task.encounter?.causeKey&&<p><TermText>{t(task.encounter.causeKey)}</TermText></p>}<ol>{story.encounters.slice(-3).map(encounter=>{const actor=w.characters.find(c=>c.id===encounter.actorId),prior=w.tasks.find(x=>x.id===encounter.taskId);return <li key={encounter.taskId}><small>{t('workHistory.day',{day:encounter.day})} · {actor?characterName(actor,t):t('ui.team')}</small><p><TermText>{t(prior?.outcome?.summaryKey??'workHistory.checked')}</TermText></p>{encounter.observations.at(-1)&&<p className="history-observation"><TermText>{t(encounter.observations.at(-1)!)}</TermText></p>}</li>;})}</ol>{!!story.limitations.length&&<div className="history-limitations"><b>{t('workHistory.limits')}</b>{story.limitations.map(key=><p key={key}><TermText>{t(key)}</TermText></p>)}</div>}</details>;
}
