import {describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {deskAvailability} from './deskAvailability';
import {transition} from './engine';
import {activeCharacter,activeTask,emptyCampaign,makeSchedule,candidates} from './simulation';
import {migrateLegacy} from './store';
import {availableTechnicalActions} from './technicalActions';
import {resolveTaskTemplate} from '../content/scenarios';
import {addRunTime,newRunTiming} from './runTiming';
function start(){const c=transition(emptyCampaign(),{type:'new',name:'Audit',avatarId:'1',professionId:'frontend',seed:1427}).campaign;delete activeCharacter(c).firstDay;activeCharacter(c).completedWork=['one','two','three'];c.schedule.forEach(e=>e.status='completed');return c;}
describe('progression exit audit',()=>{
 it('reproduces the screenshot: locked jobs are not an actionable queue and the day can finish',()=>{
  const c=start();c.company!.currentDay=50;c.time=717;c.life!.queue.forEach(q=>q.status=['bug','feature'].includes(q.id)?'done':'waiting');
  const state=deskAvailability(c);expect(state.reason).toBe('empty');expect(state.eligible).toHaveLength(0);expect(state.locked).toBe(3);
  const home=transition(c,{type:'end-day'}).campaign;expect(home.phase).toBe('home');
  const next=transition(home,{type:'sleep'}).campaign;expect(next.phase).toBe('office');expect(deskAvailability(next).reason).toBe('sync');
 });
 it('explains pressure, time and grade constraints across all profession grades',()=>{
  const c=start();for(const grade of ['level-0','level-1','level-2','level-3']){
   activeCharacter(c).careerNodeId=grade;c.life!.queue.forEach(q=>q.status='waiting');c.time=540;c.life!.reviewDue=false;
   expect(deskAvailability(c).reason).toBeNull();c.time=1020;expect(deskAvailability(c).reason).toBe('late');
   c.life!.reviewDue=true;expect(deskAvailability(c).reason).toBe('review');
  }
 });
 it('repairs legacy placeholder action history without erasing real evidence or charging again',()=>{
  let c=start();c.schedule=makeSchedule(c);c.schedule[0].status='completed';const q=c.life!.queue.find(q=>q.id==='bug')!;q.status='selected';q.explained=true;c=transition(c,{type:'take-task'}).campaign;
  const task=activeTask(c)!,step=resolveTaskTemplate(task).steps[0],p=task.progress[step.id];p.actionHistory=['resume'];p.charged=true;p.observations={saved:'story.past'};
  c=migrateLegacy(JSON.parse(JSON.stringify(c)));const restored=activeTask(c)!.progress[step.id];expect(restored.actionHistory).toEqual([]);expect(restored.charged).toBe(true);expect(restored.observations).toEqual({saved:'story.past'});expect(availableTechnicalActions(step,restored).length).toBeGreaterThan(0);
 });
 it('tracks active time separately from real elapsed days and does not invent a legacy start',()=>{
  expect(addRunTime(undefined,15000,1000)).toEqual({observedAt:1000,activeMs:15000});
  expect(addRunTime(newRunTiming(1000),86400000,86401000).activeMs).toBe(30000);
  expect(addRunTime(newRunTiming(1000),NaN,2000).activeMs).toBe(0);
 });
 it('freezes predecessor time in the archive and starts the new hero in the same world',()=>{
  const c=start(),ch=activeCharacter(c);ch.careerNodeId='level-3';ch.runTiming={startedAt:1000,observedAt:1000,activeMs:125000};const id=candidates(c)[0].id;
  const next=transition(c,{type:'hire',id}).campaign;expect(next.activeCharacterId).toBe(id);expect(next.company!.id).toBe(c.company!.id);expect(next.meta!.careers.find(r=>r.characterId===ch.id)!.runTiming?.activeMs).toBe(125000);expect(activeCharacter(next).runTiming?.activeMs).toBe(0);expect(ch.runTiming.activeMs).toBe(125000);
 });
});
