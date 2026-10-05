import {gameConfig} from '../config/game';
import type {Campaign,Task} from './types';
import {activeTask} from './simulation';
/** Earlier stage replies cannot make the current dependency look ready. */
export function waitingTask(c:Campaign,task:Task){
 const dependency=task.progress[task.currentStepId]?.dependency,current=activeTask(c);
 const remaining=dependency?Math.max(0,(dependency.dueDay-(c.life?.calendarDay??dependency.dueDay))*1440+dependency.dueMinute-c.time):0;
 const busy=!!current&&!current.rewarded;
 const waitMinutes=dependency&&!dependency.ready&&dependency.dueDay===c.life?.calendarDay?Math.max(0,Math.min(30,dependency.dueMinute-c.time,gameConfig.clock.workdayEnd-c.time)):0;
 const canWait=c.phase==='office'&&!busy&&!c.life?.reviewDue&&!c.schedule.some(e=>e.type==='sync'&&e.status==='pending')&&task.paused===true&&!task.rewarded&&task.characterId===c.activeCharacterId&&waitMinutes>0;
 return {waitMinutes,canWait,dependency,today:dependency?.dueDay===c.life?.calendarDay,ready:dependency?.ready===true,remaining,busy,canResume:c.phase==='office'&&!busy&&task.paused===true&&!task.rewarded&&task.characterId===c.activeCharacterId};
}
