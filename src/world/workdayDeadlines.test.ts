import {it,expect} from 'vitest';
import {addWorkdays,nextWorkdayOnOrAfter} from './calendar';
import {transition} from './engine';
import {activeCharacter,emptyCampaign} from './simulation';
import {communicateExpectation,expectationPressure,ensureWorkExpectations} from './expectations';
import {assignResponsibility,ensureResponsibilities,resolveResponsibilities} from './responsibility';
import {migrateLegacy} from './store';
function ready(){const c=transition(emptyCampaign(),{type:'new',name:'Dates',avatarId:'1',professionId:'frontend',seed:1427}).campaign;const ch=activeCharacter(c);ch.firstDay!.onboardingCompleted=true;ch.firstDay!.currentOnboardingStep='done';ch.completedWork=['one','two'];c.life!.calendarDay=2;return c;}
it('counts working days across Friday and a year boundary',()=>{
 expect(addWorkdays(2,1)).toBe(5);expect(addWorkdays(2,2)).toBe(6);expect(nextWorkdayOnOrAfter(3)).toBe(5);expect(addWorkdays(365,1)).toBe(366);
});
it('new and extended obligations land on weekdays and a repeat extension is rejected',()=>{
 const c=ready(),q=c.life!.queue.find(q=>q.id==='bug')!;q.expectation=undefined;ensureWorkExpectations(c);expect(q.expectation!.dueDay).toBe(6);
 q.expectation!.dueDay=2;expect(communicateExpectation(c,'bug','blocker')).toBe(true);expect(q.expectation!.dueDay).toBe(5);expect(communicateExpectation(c,'bug','postpone')).toBe(false);
});
it('weekends cannot turn a Friday obligation into an escalation',()=>{
 const c=ready(),q=c.life!.queue.find(q=>q.id==='bug')!;q.expectation={state:'waiting',dueDay:2};const trust=activeCharacter(c).relationships.map(r=>r.trust);
 for(const day of [3,4]){c.life!.calendarDay=day;expectationPressure(c);expect(q.expectation.state).toBe('waiting');expect(activeCharacter(c).relationships.map(r=>r.trust)).toEqual(trust);}
 c.life!.calendarDay=5;expectationPressure(c);expect(q.expectation.state).toBe('overdue');c.life!.calendarDay=6;expectationPressure(c);expect(q.expectation.state).toBe('escalated');
});
it('Friday delegation returns Tuesday and existing weekend deadlines survive reload on Monday',()=>{
 const c=ready();expect(assignResponsibility(c,'feature','oleg')).toBe(true);const job=c.company!.delegations![0];expect(job.dueDay).toBe(6);
 for(const day of [3,4,5]){c.life!.calendarDay=day;resolveResponsibilities(c);expect(job.status).toBe('working');}
 c.life!.calendarDay=6;resolveResponsibilities(c);expect(job.status).toBe('returned');
 job.status='working';job.dueDay=4;ensureResponsibilities(c);expect(job.dueDay).toBe(5);
 const q=c.life!.queue.find(q=>q.id==='bug')!;q.expectation={state:'waiting',dueDay:3};const loaded=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(loaded.life!.queue.find(q=>q.id==='bug')!.expectation!.dueDay).toBe(5);
});
