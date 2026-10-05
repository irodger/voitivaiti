import {gameConfig} from '../config/game';
import {activeCharacter,activeTask} from './simulation';
import {availableWork} from './workLoop';
import type {Campaign} from './types';
/** Shared explanation for a desk that cannot offer another task. */
export function deskAvailability(c:Campaign){
 const ch=activeCharacter(c),task=activeTask(c),allowed=availableWork(ch);
 const eligible=c.life?.queue.filter(q=>q.status!=='done'&&!q.delegatedTo&&allowed.includes(q.id))??[];
 const locked=c.life?.queue.filter(q=>q.status!=='done'&&!q.delegatedTo&&!allowed.includes(q.id)).length??0;
 const pending=c.schedule.filter(e=>e.status==='pending'&&e.type!=='task');
 const reason=c.phase!=='office'?'offDuty':pending.some(e=>e.type==='sync')?'sync':c.life?.reviewDue?'review':task&&!task.rewarded?'current':c.time>=gameConfig.clock.lastTaskStart?'late':!eligible.length?'empty':null;
 return {eligible,locked,pending,reason};
}
