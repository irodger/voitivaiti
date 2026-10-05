import type {Campaign,Task} from './types';
import {activeTask} from './simulation';
/** Earlier stage replies cannot make the current dependency look ready. */
export function waitingTask(c:Campaign,task:Task){
 const dependency=task.progress[task.currentStepId]?.dependency,current=activeTask(c);
 const remaining=dependency?Math.max(0,(dependency.dueDay-(c.life?.calendarDay??dependency.dueDay))*1440+dependency.dueMinute-c.time):0;
 const busy=!!current&&!current.rewarded;
 return {dependency,today:dependency?.dueDay===c.life?.calendarDay,ready:dependency?.ready===true,remaining,busy,canResume:c.phase==='office'&&!busy&&task.paused===true&&!task.rewarded&&task.characterId===c.activeCharacterId};
}
