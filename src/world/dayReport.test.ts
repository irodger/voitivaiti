import {it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {beginPlaytest,finishPlaytestTask} from './playtestHelpers';
import {transition} from './engine';
import {activeCharacter,activeTask,makeTask} from './simulation';
import {captureDayReport} from './dayReport';
import {migrateLegacy} from './store';

it('reports actual completions from today and persists the report through reload without revealing future outcomes',()=>{
 let c=beginPlaytest('frontend');c=transition(c,{type:'take-task'}).campaign;c=finishPlaytestTask(c,'limited');const task=activeTask(c)!;
 c=transition(c,{type:'reward-close'}).campaign;c=transition(c,{type:'end-day'}).campaign;
 const report=c.life!.dayReport!;expect(report.tasks).toHaveLength(1);expect(report.tasks[0]).toMatchObject({id:task.id,state:'delivered'});
 expect(JSON.stringify(report)).not.toContain('followup');const before={tasks:JSON.stringify(c.tasks),xp:activeCharacter(c).stats.xp};
 c=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(c.life!.dayReport).toEqual(report);expect(JSON.stringify(c.tasks)).toBe(before.tasks);expect(activeCharacter(c).stats.xp).toBe(before.xp);
 c.dayWorkStart=activeCharacter(c).completedWork.length;expect(captureDayReport(c)!.tasks).toHaveLength(0);
});
it('keeps unfinished work distinct from delivered results and excludes other heroes and delegated queue items',()=>{
 const c=beginPlaytest('frontend'),task=makeTask(c);c.tasks.push(task);c.activeTaskId=task.id;
 const step=task.currentStepId;task.progress[step].dependency={npcId:'owner',dueDay:c.life!.calendarDay,dueMinute:900,ready:false};task.paused=true;c.activeTaskId=null;
 c.tasks.push({...structuredClone(task),id:'foreign',characterId:'other'});c.life!.queue.find(q=>q.id==='feature')!.delegatedTo='owner';
 const before=JSON.stringify(c),report=captureDayReport(c)!;expect(report.tasks).toEqual([{id:task.id,state:'waiting',summaryKey:undefined,temporary:false,evidenceOnly:false,recipientTeamId:undefined}]);expect(report.waiting.some(q=>q.id==='feature')).toBe(false);expect(JSON.stringify(c)).toBe(before);
});
