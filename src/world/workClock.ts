import {gameConfig} from '../config/game';
import type {Campaign} from './types';
import {activeCharacter} from './simulation';
export function workClock(c:Campaign){
 const remaining=Math.max(0,gameConfig.clock.workdayEnd-c.time),overtime=Math.max(0,c.time-gameConfig.clock.workdayEnd),duration=gameConfig.clock.workdayEnd-gameConfig.clock.workdayStart;
 const first=activeCharacter(c).firstDay;
 const canFinish=c.phase==='office'&&(first&&!first.onboardingCompleted?!c.schedule.some(e=>e.status==='pending'):!c.schedule.some(e=>e.type==='sync'&&e.status==='pending'));
 return {remaining,overtime,duration,spent:Math.min(duration,Math.max(0,c.time-gameConfig.clock.workdayStart)),nearEnd:remaining<=60,canFinish};
}
