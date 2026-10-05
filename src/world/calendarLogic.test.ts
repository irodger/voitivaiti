import {it,expect} from 'vitest';
import {transition} from './engine';
import {activeCharacter,emptyCampaign} from './simulation';
import {isWorkday,advanceToNextWorkday} from './life';
import {dailySalary} from './economy';
import {migrateLegacy} from './store';
import {formatCalendarDate} from '../utils/format';
function ready(day=2){const c=transition(emptyCampaign(),{type:'new',name:'Clock',avatarId:'1',professionId:'frontend',seed:1427}).campaign;activeCharacter(c).firstDay=undefined;c.life!.calendarDay=day;c.schedule.forEach(e=>e.status='completed');return c;}
it('skips Friday night to Monday, charges each weekend day and adds no weekend salary',()=>{
 const source=ready();activeCharacter(source).stats.stress=50;let c=transition(source,{type:'end-day'}).campaign;const stress=activeCharacter(c).stats.stress;const money=activeCharacter(c).stats.money,played=c.life!.playedDay;
 c=transition(c,{type:'sleep'}).campaign;
 expect(c.life!.calendarDay).toBe(5);expect(isWorkday(c.life!.calendarDay)).toBe(true);expect(c.time).toBe(540);expect(c.life!.playedDay).toBe(played+1);
 expect(activeCharacter(c).stats.energy).toBe(100);expect(activeCharacter(c).stats.stress).toBeLessThan(stress);
 expect(c.life!.weekendSkip).toEqual({days:2,income:0,expenses:1200});expect(activeCharacter(c).stats.money).toBe(money-1200);expect(c.life!.lastPaidCalendarDay).toBe(4);
 const restored=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(restored.life!.weekendSkip).toEqual(c.life!.weekendSkip);expect(transition(restored,{type:'sleep'}).campaign).toEqual(restored);
});
it('pays an actual legacy weekend shift once, then resumes weekday scheduling',()=>{
 const before=ready(3),money=activeCharacter(before).stats.money,pay=dailySalary(activeCharacter(before));let c=transition(before,{type:'end-day'}).campaign;
 expect(activeCharacter(c).stats.money).toBe(money+pay-600);expect(transition(c,{type:'end-day'}).campaign).toEqual(c);
 c=transition(c,{type:'sleep'}).campaign;expect(c.life!.calendarDay).toBe(5);expect(c.life!.weekendSkip?.days).toBe(1);
});
it('returning from a settled routine day starts a new payable weekday',()=>{
 const c=ready(2);c.phase='home';c.life!.lastPaidCalendarDay=2;c.life!.montage={days:1,income:100,expenses:20,stop:'life.continue'};
 const returned=transition(c,{type:'montage-close'}).campaign;expect(returned.life!.calendarDay).toBe(5);expect(returned.life!.montage).toBeNull();expect(returned.life!.lastPaidCalendarDay).not.toBe(5);
 returned.schedule.forEach(e=>e.status='completed');const closed=transition(returned,{type:'end-day'}).campaign;expect(activeCharacter(closed).home!.lastPay).toBeGreaterThan(0);
});
it('calendar consequences run over skipped days and pending wages are released only once',()=>{
 const c=ready(2);c.phase='home';c.life!.salaryHeld=2000;c.life!.worldEvents=[{id:'payroll',day:1,until:4}];const money=activeCharacter(c).stats.money;
 advanceToNextWorkday(c);expect(c.life!.salaryHeld).toBe(0);expect(activeCharacter(c).stats.money).toBe(money+2000-1200);
 const before=activeCharacter(c).stats.money;advanceToNextWorkday(c);expect(activeCharacter(c).stats.money).toBe(before);expect(c.life!.weekendSkip).toBeUndefined();
});
it('calendar dates use the same UTC origin as payroll',()=>{
 expect(formatCalendarDate(2,'en')).toContain('Fri');expect(formatCalendarDate(5,'en')).toContain('Mon');
});
