import { gameConfig } from '../config/game';
import '../content/corrections';
import '../content/mastery';
import '../content/progressionUx';
import '../content/recovery';
import { deskAvailability } from '../world/deskAvailability';
import { autonomy } from '../world/workLoop';
import { Button } from './shared';
import { useTaskStartButton } from './useTaskStartButton';

export function TaskStartButton(){
const {w,ch,t}=useTaskStartButton();
if(w.phase!=='office')return <p role="status">{t('flow.offDuty')}</p>;const reason=w.schedule.some(e=>e.type==='sync'&&e.status==='pending')?'sync':w.life?.reviewDue?'review':w.time>=gameConfig.clock.lastTaskStart?'late':autonomy(ch)>0&&!w.life?.queue.some(q=>q.status==='selected'&&!q.delegatedTo)?'pick':null;if(deskAvailability(w).reason==='waiting')return null;if(deskAvailability(w).reason==='empty')return <p role="status">{t('flow.emptyBody')}</p>;if(reason==='pick')return null;return <div className="task-start">{reason?<p role="status" className="task-start-reason">{t('queue.reason.'+reason)}</p>:<Button onClick={()=>w.dispatch({type:'take-task'})}>{t('queue.start')}</Button>}</div>}
