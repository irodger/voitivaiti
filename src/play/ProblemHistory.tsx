import '../content/workHistoryUx';
import type { Task } from '../world/types';
import { characterName } from './shared';
import { TermText } from './TermText';
import { useProblemHistory } from './useProblemHistory';
import './workHistory.css';
export function ProblemHistory({task}:{task:Task}){
const model=useProblemHistory({task});if(!model)return null;const {w,t,story}=model;

 return <details className="problem-history"><summary>{t('workHistory.title')} · {story.encounters.length}</summary>{task.encounter?.causeKey&&<p><TermText>{t(task.encounter.causeKey)}</TermText></p>}<ol>{story.encounters.slice(-3).map(encounter=>{const actor=w.characters.find(c=>c.id===encounter.actorId),prior=w.tasks.find(x=>x.id===encounter.taskId);return <li key={encounter.taskId}><small>{t('workHistory.day',{day:encounter.day})} · {actor?characterName(actor,t):t('ui.team')}</small><p><TermText>{t(prior?.outcome?.summaryKey??'workHistory.checked')}</TermText></p>{encounter.observations.at(-1)&&<p className="history-observation"><TermText>{t(encounter.observations.at(-1)!)}</TermText></p>}</li>;})}</ol>{!!story.limitations.length&&<div className="history-limitations"><b>{t('workHistory.limits')}</b>{story.limitations.map(key=><p key={key}><TermText>{t(key)}</TermText></p>)}</div>}</details>;
}
