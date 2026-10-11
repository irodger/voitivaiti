import {describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition} from './engine';
import {emptyCampaign,activeCharacter,activeTask,makeSchedule} from './simulation';
import {finishPlaytestTask} from './playtestHelpers';
import {advanceCalendar} from './life';
import {causalContext} from './causalRouting';
import {ordinaryProblem} from './roleRouting';
import {migrateLegacy} from './store';
import type {Campaign,Problem} from './types';
function start(){const c=transition(emptyCampaign(),{type:'new',name:'Causal',avatarId:'1',professionId:'frontend',seed:1427}).campaign;delete activeCharacter(c).firstDay;activeCharacter(c).completedWork=['one','two'];return c;}
const problem=(c:Campaign,category:Problem['category'])=>c.company!.projects[0].problems.find(p=>p.category===category)!;
function assign(c:Campaign,category:Problem['category']){c.activeTaskId=null;c.phase='office';c.time=540;c.schedule=makeSchedule(c);c.schedule[0].status='completed';const q=c.life!.queue.find(q=>q.id==='bug')!;q.status='selected';q.explained=true;q.projectId=c.company!.projects[0].id;q.problemId=problem(c,category).id;return transition(c,{type:'take-task'}).campaign;}
describe('existing domain consequences route the next encounter',()=>{
 for(const category of ['interface','performance'] as const)it(category+' resumes the real workaround instead of a fresh bound problem, through reload',()=>{
  let c=finishPlaytestTask(assign(start(),category),'limited');const prior=activeTask(c)!,p=problem(c,category),due=p.consequences![0].dueDay;
  expect(causalContext(c,p)).toBeUndefined();while(c.life!.calendarDay<due)advanceCalendar(c);
  const context=causalContext(c,p)!;expect(context.family).toBe('recurrence');expect(context.previousTaskId).toBe(prior.id);expect(context.key).toBe(prior.outcome!.followupKey);
  activeCharacter(c).scenarioCounts['lens.frontend.'+category]=900;
  c=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(causalContext(c,problem(c,category))).toEqual(context);
  c=assign(c,category==='interface'?'performance':'interface');expect(activeTask(c)!.problemId).toBe(p.id);expect(activeTask(c)!.encounter).toMatchObject({triggerId:context.id,previousTaskId:prior.id,causeKey:context.key});expect(activeTask(c)!.encounter!.contextKeys).toContain(prior.outcome!.summaryKey);
  c=finishPlaytestTask(c);expect(causalContext(c,problem(c,category))?.id).not.toBe(context.id);
 });
 it('a verified repair produces review, whose concrete finding leads to artifact work',()=>{
  let c=finishPlaytestTask(assign(start(),'performance'));const p=problem(c,'performance'),due=p.consequences![0].dueDay;while(c.life!.calendarDay<due)advanceCalendar(c);
  c=assign(c,'interface');expect(activeTask(c)!.sceneFamily).toBe('review');c=finishPlaytestTask(c);
  const next=causalContext(c,problem(c,'performance'))!;expect(next.family).toBe('artifact');expect(next.previousTaskId).toBe(activeTask(c)!.id);
  c=migrateLegacy(JSON.parse(JSON.stringify(c)));c=assign(c,'interface');expect(activeTask(c)!.encounter!.triggerId).toBe(next.id);expect(activeTask(c)!.sceneFamily).toBe('artifact');
 });
 it('returned colleague work takes precedence over fresh work and a checked result stops routing',()=>{
  const c=start(),p=problem(c,'interface');c.company!.delegations=[{id:'handoff',actorId:c.activeCharacterId,npcId:'max',work:'bug',projectId:c.company!.projects[0].id,problemId:p.id,context:'interface',grade:0,profession:'frontend',startedDay:1,dueDay:2,status:'returned',result:'bounded'}];c.company!.history.push({id:'handoff:result',kind:'delegation-result',day:2,key:'responsibility.result.bounded',problemId:p.id,actorId:'max'});
  expect(ordinaryProblem(c,'debt').problem!.id).toBe(p.id);expect(causalContext(c,p)!.actorId).toBe('max');c.company!.delegations[0].status='checked';expect(causalContext(c,p)).toBeUndefined();
 });
});
