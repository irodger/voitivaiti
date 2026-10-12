import {it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {beginPlaytest} from './playtestHelpers';
import {activeCharacter} from './simulation';
import {closeWorkDay} from './life';
import {setWorkDeadline} from './expectations';
import {addWorkdays} from './calendar';
function setup(){
 const c=beginPlaytest('frontend'),ch=activeCharacter(c);ch.completedWork=['one','two','three'];ch.firstDay!.onboardingCompleted=true;
 ch.relationships.push({characterId:'max',trust:50});c.activeTaskId=null;c.phase='office';c.time=1080;
 c.life!.queue.forEach(q=>{q.status='done';q.urgency=5;});
 const selected=c.life!.queue.find(q=>q.id==='feature')!,waiting=c.life!.queue.find(q=>q.id==='bug')!;
 selected.status='selected';selected.explained=true;waiting.status='waiting';
 waiting.expectation={state:'waiting',dueDay:addWorkdays(c.life!.calendarDay,2)};
 return {c,ch,waiting};
}
it('choosing other work does not punish a high-urgency obligation before its agreed deadline',()=>{
 const {c,ch,waiting}=setup(),trust=ch.relationships.find(r=>r.characterId==='max')!.trust;
 closeWorkDay(c);expect(ch.relationships.find(r=>r.characterId==='max')!.trust).toBe(trust);expect(c.life!.decisions.ignoredQa).toBe(0);expect(waiting.expectation!.state).toBe('waiting');
});
it('overdue work has one deadline reaction and an agreed extension clears its current pressure after reload',()=>{
 const {c,ch,waiting}=setup();waiting.expectation!.dueDay=c.life!.calendarDay-1;
 const trust=ch.relationships.find(r=>r.characterId==='max')!.trust;
 closeWorkDay(c);expect(ch.relationships.find(r=>r.characterId==='max')!.trust).toBe(trust-3);expect(c.life!.decisions.ignoredQa).toBe(0);
 expect(c.company!.history.filter(e=>e.kind==='obligation'&&e.values?.work==='bug')).toHaveLength(1);
 setWorkDeadline(waiting,addWorkdays(c.life!.calendarDay,2));waiting.expectation!.communication='postpone';
 const loaded=JSON.parse(JSON.stringify(c)),before=activeCharacter(loaded).relationships.find(r=>r.characterId==='max')!.trust;
 closeWorkDay(loaded);expect(activeCharacter(loaded).relationships.find(r=>r.characterId==='max')!.trust).toBe(before);
});
