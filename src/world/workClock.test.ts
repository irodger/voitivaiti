import {it,expect} from 'vitest';
import {workClock} from './workClock';
import {transition} from './engine';
import {emptyCampaign,activeCharacter,activeTask} from './simulation';
import {migrateLegacy} from './store';
const start=()=>transition(emptyCampaign(),{type:'new',name:'Clock',avatarId:'1',professionId:'frontend',seed:1427}).campaign;
it('reports the work boundary and never claims negative remaining time',()=>{
 const c=start();c.time=1020;expect(workClock(c)).toMatchObject({remaining:60,overtime:0,nearEnd:true});
 c.time=1080;expect(workClock(c)).toMatchObject({remaining:0,overtime:0});c.time=1117;expect(workClock(c)).toMatchObject({remaining:0,overtime:37,spent:540});
});
it('respects first-day and morning-sync restrictions',()=>{
 const c=start();expect(workClock(c).canFinish).toBe(false);activeCharacter(c).firstDay=undefined;expect(workClock(c).canFinish).toBe(false);
 c.schedule.find(e=>e.type==='sync')!.status='completed';expect(workClock(c).canFinish).toBe(true);c.phase='home';expect(workClock(c).canFinish).toBe(false);
});
it('keeps partial task work through ending the shift, reload and next morning',()=>{
 let c=start();activeCharacter(c).firstDay=undefined;c=transition(c,{type:'event',id:c.schedule[0].id,choiceId:'plan'}).campaign;c=transition(c,{type:'take-task'}).campaign;
 const task=activeTask(c)!;task.progress[task.currentStepId].draft=['kept-selection'];task.taskElapsedMinutes=41;c.time=1070;const saved=structuredClone(task);
 expect(workClock(c).canFinish).toBe(true);c=transition(c,{type:'end-day'}).campaign;expect(c.phase).toBe('home');c=migrateLegacy(JSON.parse(JSON.stringify(c)));c=transition(c,{type:'sleep'}).campaign;
 expect(c.phase).toBe('office');expect(activeTask(c)).toEqual(saved);expect(c.time).toBe(540);expect(c.schedule.find(e=>e.type==='sync')?.status).toBe('pending');
});
