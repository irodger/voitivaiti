import '../content/progressionUx';
import {deskAvailability} from '../world/deskAvailability';
import {gameConfig} from '../config/game';
import '../content/mastery';
import '../content/recovery';
import '../content/corrections';
import {autonomy} from '../world/workLoop';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {useI18n} from '../content/localization';
import {Button} from './shared';

export function TaskStartButton(){const w=useWorld(),ch=activeCharacter(w),{t}=useI18n();if(w.phase!=='office')return <p role="status">{t('flow.offDuty')}</p>;const reason=w.schedule.some(e=>e.type==='sync'&&e.status==='pending')?'sync':w.life?.reviewDue?'review':w.time>=gameConfig.clock.lastTaskStart?'late':autonomy(ch)>0&&!w.life?.queue.some(q=>q.status==='selected'&&!q.delegatedTo)?'pick':null;if(deskAvailability(w).reason==='empty')return <p role="status">{t('flow.emptyBody')}</p>;if(reason==='pick')return null;return <div className="task-start">{reason?<p role="status" className="task-start-reason">{t('queue.reason.'+reason)}</p>:<Button onClick={()=>w.dispatch({type:'take-task'})}>{t('queue.start')}</Button>}</div>}
