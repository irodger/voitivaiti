import {beginPlaytest,finishPlaytestTask} from './playtestHelpers';
import {describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition,type Action} from './engine';
import {emptyCampaign,activeCharacter,activeTask,canPromote,makeSchedule} from './simulation';
import {migrateLegacy} from './store';
import {takeVacation,advanceCalendar,isWorkday} from './life';
import {promotionChecks,rememberExperience} from './mastery';
import type {Campaign} from './types';
function start(){const c=transition(emptyCampaign(),{type:'new',name:'Original',avatarId:'1',professionId:'frontend',seed:1427}).campaign;activeCharacter(c).firstDay!.onboardingCompleted=true;activeCharacter(c).firstDay!.currentOnboardingStep='done';activeCharacter(c).completedWork=['intro1','intro2'];return c;}
function act(c:Campaign,a:Action){return transition(c,a).campaign;}
function work(c:Campaign,category='interface',style='shared'){
 const q=c.life!.queue.find(q=>q.id==='bug')!,p=c.company!.projects[0];q.status='selected';q.explained=true;q.projectId=p.id;q.problemId=p.problems.find(p=>p.category===category)!.id;
 c.phase='office';c.time=540;c.activeTaskId=null;c.schedule=makeSchedule(c);c.schedule[0].status='completed';c=act(c,{type:'take-task'});
 return finishPlaytestTask(c,style);
}
import {absenceObligations} from './vacation';
import {dailySalary} from './economy';
import {availableWork,autonomy} from './workLoop';
describe('v0.24 confirmed responsibility',()=>{
 it('one episode and assignment cannot unlock several grades',()=>{
  let c=work(start(),'payment');c=act(c,{type:'perspective-start'});for(const id of ['reproduce','environment','regression','approve'])c=act(c,{type:'perspective-action',id});
  expect(canPromote(activeCharacter(c),'level-1')).toBe(false);
  expect(canPromote(activeCharacter(c),'level-2')).toBe(false);
  expect(canPromote(activeCharacter(c),'level-3')).toBe(false);
 });
 it('120 ordinary assignments reach Senior without optional mentoring',()=>{
  let c=start();for(let i=0;i<120;i++){
   c=work(c,['interface','payment','performance'][i%3]);
   for(const node of ['level-1','level-2'])if(canPromote(activeCharacter(c),node))c=act(c,{type:'promote',nodeId:node});
  }
  expect(activeCharacter(c).completedWork.length).toBe(122);
  expect(activeCharacter(c).careerNodeId).toBe('level-2');
  expect(activeCharacter(c).experience!.some(e=>e.tags.includes('mentoring'))).toBe(false);
  expect(canPromote(activeCharacter(c),'level-3')).toBe(false);
 },30000);
 it('repeating one context or unconfirmed tags cannot substitute for diversity',()=>{
  let c=start();for(let i=0;i<10;i++)c=work(c,'interface');
  rememberExperience(c,['delegation','people','ownership','planning'],'click','ui.work');
  expect(canPromote(activeCharacter(c),'level-1')).toBe(false);
  const check=promotionChecks(activeCharacter(c),'level-1').find(c=>c.key==='mastery.variety')!;expect(check.current).toBe(1);
 });
 it('delegation requires context, elapsed work, a result and the player response; reload cannot duplicate it',()=>{
  let c=start();activeCharacter(c).careerNodeId='level-2';c.phase='office';c.schedule.forEach(e=>e.status='completed');
  c=act(c,{type:'delegate-work',id:'feature',npcId:'oleg'});const d=c.company!.delegations![0];
  expect(d.context).toBeTruthy();expect(d.status).toBe('working');expect(activeCharacter(c).experience!.some(e=>e.tags.includes('delegation'))).toBe(false);
  c=act(c,{type:'delegation-result',id:d.id,response:'accept'});expect(c.company!.delegations![0].status).toBe('working');
  advanceCalendar(c);expect(c.company!.delegations![0].status).toBe('working');while(c.life!.calendarDay<d.dueDay)advanceCalendar(c);
  expect(c.company!.delegations![0].status).toBe('returned');expect(activeCharacter(c).experience!.some(e=>e.tags.includes('delegation'))).toBe(false);
  c=migrateLegacy(JSON.parse(JSON.stringify(c)));c=act(c,{type:'delegation-result',id:d.id,response:'clarify'});
  expect(c.life!.queue.find(q=>q.id==='feature')!.status).toBe('waiting');
  expect(activeCharacter(c).experience!.filter(e=>e.tags.includes('delegation'))).toHaveLength(1);
  expect(activeCharacter(c).experience!.find(e=>e.tags.includes('delegation'))!.outcome).toBe('responsibility.response.clarify');
  const before=JSON.stringify(c);c=act(c,{type:'delegation-result',id:d.id,response:'accept'});expect(JSON.stringify(c)).toBe(before);
 });
 it('legacy assignment tags lose eligibility without demoting existing careers or erasing completed work',()=>{
  let c=work(start(),'payment');activeCharacter(c).careerNodeId='level-2';delete activeCharacter(c).experienceVersion;
  activeCharacter(c).experience!.push({id:'delegate:old',titleKey:'ui.work',tags:['delegation','people'],grade:2,day:1,profession:'frontend'});
  c=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(activeCharacter(c).careerNodeId).toBe('level-2');
  expect(activeCharacter(c).experience!.some(e=>e.id==='delegate:old')).toBe(false);expect(activeCharacter(c).experience!.some(e=>e.id.startsWith('work:')&&e.confirmed)).toBe(true);
 });
});
describe('vacation with continuing obligations',()=>{
 it('handoff progresses during leave, preserves personal work and waits for review',()=>{
  let c=work(start(),'payment');c=act(c,{type:'reward-close'});c=act(c,{type:'end-day'});
  const arrangements=Object.fromEntries(absenceObligations(c).map(q=>[q.id,'handoff'])) as Record<'bug','handoff'>;
  c=act(c,{type:'vacation',days:7,arrangements});expect(c.life!.montage).toBeTruthy();
  expect(c.company!.delegations!.every(d=>d.status==='returned')).toBe(true);
  expect(c.life!.montage!.summary).toContain('absence.results');expect(c.life!.montage!.summary!.some(k=>k.startsWith('absence.waited'))).toBe(false);
  expect(activeCharacter(c).experience!.some(e=>e.tags.includes('delegation'))).toBe(false);
  c=act(c,{type:'montage-close'});const d=c.company!.delegations![0];c=act(c,{type:'delegation-result',id:d.id,response:'accept'});
  expect(c.company!.delegations![0].status).toBe('checked');expect(c.company!.delegations!.some(d=>d.id.startsWith('legacy-handoff:'))).toBe(false);
 });
 it('a one-time agreed extension protects leave; repeated extensions are not automatic',()=>{
  const c=start();activeCharacter(c).completedWork=['one'];c.phase='home';c.life!.queue.forEach(q=>q.status=q.id==='bug'?'waiting':'done');
  const q=c.life!.queue[0];q.urgency=2;q.expectation={state:'waiting',dueDay:2};
  expect(takeVacation(c,7,{bug:'postpone'})).toBe(true);expect(q.expectation!.dueDay).toBeGreaterThan(c.life!.calendarDay);expect(q.expectation!.extensionUsed).toBe(true);
  expect(c.life!.montage!.summary).toContain('absence.moved.bug');c.life!.montage=null;
  expect(takeVacation(c,7,{bug:'postpone'})).toBe(true);expect(q.expectation!.state).toBe('escalated');expect(c.life!.montage!.summary).toContain('absence.notAgreed');
 });
 it('salary follows working days; recovery does not remove an ignored obligation',()=>{
  const c=start();activeCharacter(c).completedWork=['one'];c.phase='home';activeCharacter(c).stats.stress=82;
  const startDay=c.life!.calendarDay,due=c.life!.queue[0].expectation?.dueDay;
  expect(takeVacation(c,14)).toBe(true);let weekdays=0;for(let day=startDay+1;day<=c.life!.calendarDay;day++)if(isWorkday(day))weekdays++;
  expect(weekdays).toBe(14);expect(c.life!.montage!.income).toBe(dailySalary(activeCharacter(c))*14+(activeCharacter(c).home?.finances?.records.filter(r=>r.day>startDay&&r.day<=c.life!.calendarDay&&r.amount>0).reduce((sum,r)=>sum+r.amount,0)??0));expect(activeCharacter(c).stats.stress).toBeLessThan(35);
  expect(c.life!.queue[0].status).not.toBe('done');if(due)expect(c.life!.queue[0].expectation!.dueDay).toBe(due);
  expect(c.life!.queue[0].expectation!.state).toBe('escalated');expect(c.company!.history.some(e=>e.kind==='absence-unagreed')).toBe(true);
 });
 it('support: one assignment and repeated 14-day leave cannot produce a neutral year',()=>{
  let c=beginPlaytest('support');c=act(c,{type:'take-task'});c=finishPlaytestTask(c);expect(activeTask(c)!.rewarded).toBe(true);c=act(c,{type:'reward-close'});c=act(c,{type:'end-day'});c=act(c,{type:'sleep'});
  for(let i=0;i<16;i++){if(c.phase==='office'){c=act(c,{type:'event',id:c.schedule.find(e=>e.type==='sync')!.id,choiceId:'plan'});c=act(c,{type:'end-day'});}c=act(c,{type:'vacation',days:14});c=act(c,{type:'montage-close'});}
  expect(c.life!.calendarDay).toBeGreaterThan(300);expect(activeCharacter(c).completedWork).toHaveLength(1);
  expect(c.life!.decisions.communicationFailures).toBeGreaterThanOrEqual(16);expect(c.life!.reviewDue).toBe(true);
  expect(c.company!.history.filter(e=>e.kind==='absence-unagreed')).toHaveLength(16);
  expect(c.life!.queue[0].expectation!.state).toBe('escalated');expect(c.life!.queue[0].status).toBe('waiting');
  expect(activeCharacter(c).stats.money).toBeGreaterThan(45000);expect(c.life!.vacations).toHaveLength(16);
 });
});

it('a natural daily career needs multiple confirmed stories before leadership',()=>{
 let c=beginPlaytest('frontend');const promotions:{node:string;tasks:number;day:number}[]=[];
 for(let day=0;day<35&&!c.life!.ended&&activeCharacter(c).careerNodeId!=='level-3';day++){
  for(const e of c.schedule.filter(e=>e.status==='pending'&&e.type!=='task'))c=act(c,{type:'event',id:e.id,choiceId:e.type==='sync'?'plan':e.type==='incident'?'rollback':e.type==='company'?'quality':e.type==='career'?'reflect':'skip'});
  if(c.life!.reviewDue)c=act(c,{type:'performance',accept:true});
  for(const d of c.company!.delegations!.filter(d=>d.actorId===c.activeCharacterId&&d.status==='returned'))c=act(c,{type:'delegation-result',id:d.id,response:'accept'});
  if(!activeTask(c)||activeTask(c)!.rewarded){
   const kinds=availableWork(activeCharacter(c)),q=c.life!.queue.filter(q=>q.status==='waiting'&&kinds.includes(q.id)).sort((a,b)=>(b.age??0)-(a.age??0)||b.urgency-a.urgency)[0];
   if(autonomy(activeCharacter(c))>0&&q)c=act(c,{type:'priority',id:q.id,explained:true});
   c=act(c,{type:'take-task'});
  }
  if(activeTask(c)&&!activeTask(c)!.rewarded)c=finishPlaytestTask(c);
  if(c.phase==='reward')c=act(c,{type:'reward-close'});
  if(activeCharacter(c).careerNodeId==='level-2')for(const q of c.life!.queue.filter(q=>q.status==='waiting')){
   const npc=c.characters.find(n=>n.id!==c.activeCharacterId&&n.employed&&!c.life!.queue.some(q=>q.delegatedTo===n.id)&&!c.company!.delegations!.some(d=>d.npcId===n.id&&d.status==='working'));
   if(npc)c=act(c,{type:'delegate-work',id:q.id,npcId:npc.id});
  }
  c=act(c,{type:'end-day'});
  c=act(c,{type:'start-walk'});c=act(c,{type:'walk-route',id:'park'});c=act(c,{type:'end-walk'});c=act(c,{type:'evening',id:'games'});
  for(const node of ['level-1','level-2','level-3'])if(canPromote(activeCharacter(c),node)){c=act(c,{type:'promote',nodeId:node});promotions.push({node,tasks:activeCharacter(c).completedWork.length,day:c.life!.characterPlayedDays});break;}
  if(activeCharacter(c).careerNodeId!=='level-3')c=act(c,{type:'sleep'});
 }
 console.log('v0.24 daily career:',promotions);
 expect(c.life!.ended).toBeUndefined();expect(activeCharacter(c).careerNodeId).toBe('level-3');
 expect(promotions.find(p=>p.node==='level-3')!.day).toBeGreaterThan(5);
 expect(activeCharacter(c).experience!.filter(e=>e.confirmed&&e.tags.includes('delegation')).length).toBeGreaterThanOrEqual(3);
});
