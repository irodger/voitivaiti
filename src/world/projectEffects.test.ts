import {describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition} from './engine';
import {emptyCampaign,activeCharacter,activeTask,makeSchedule} from './simulation';
import {migrateLegacy} from './store';
import type {Campaign} from './types';

function ordinary(role='frontend',category='payment'){
 let c=transition(emptyCampaign(),{type:'new',name:'Test',avatarId:'1',professionId:role,seed:1427}).campaign;
 const ch=activeCharacter(c);ch.firstDay!.onboardingCompleted=true;ch.firstDay!.currentOnboardingStep='done';ch.completedWork=['first','second'];
 c.company!.currentDay=3;c.life!.calendarDay=3;c.schedule=makeSchedule(c);
 const project=c.company!.projects[0],problem=project.problems.find(p=>p.category===category)!;
 const q=c.life!.queue.find(q=>q.id==='bug')!;q.projectId=project.id;q.problemId=problem.id;
 c=transition(c,{type:'event',id:c.schedule[0].id,choiceId:'plan'}).campaign;
 return transition(c,{type:'take-task'}).campaign;
}
function action(c:Campaign,id:string){return transition(c,{type:'technical-action',id}).campaign;}
function complete(c:Campaign,style:'limited'|'shared'){
 c=action(c,'inspect');c=action(c,'trace');c=transition(c,{type:'advance'}).campaign;
 c=action(c,style);c=action(c,'verify-'+style);c=transition(c,{type:'advance'}).campaign;
 c=action(c,'handoff');return transition(c,{type:'advance'}).campaign;
}
import {commitSceneOutcome,resolveSceneConsequences} from './sceneConsequences';
describe('project effects follow actual work results',()=>{
 it.each(['support','data-engineer','project','product','designer','qa','ux-research'])('%s contributes without changing production',role=>{
  for(const style of ['limited','shared'] as const){
   const base=ordinary(role),p=base.company!.projects[0],before={debt:p.techDebt,stability:p.stability},money=activeCharacter(base).stats.money;
   const done=complete(base,style),project=done.company!.projects[0];
   expect(project.techDebt).toBe(before.debt);expect(project.stability).toBe(before.stability);
   expect(activeCharacter(done).stats.money).toBeGreaterThan(money);
   expect(activeTask(done)!.rewarded).toBe(true);expect(activeTask(done)!.progress.investigate.observations!.trace).toBeTruthy();
   expect(project.problems.find(p=>p.id===activeTask(done)!.problemId)!.contributions.length).toBeGreaterThan(0);
   expect(transition(done,{type:'advance'}).campaign).toEqual(done);
  }
 });
 it('keeps workaround debt after handoff, reload and completion',()=>{
  let c=ordinary();const before=c.company!.projects[0].techDebt,stability=c.company!.projects[0].stability;
  c=action(c,'inspect');c=action(c,'trace');c=transition(c,{type:'advance'}).campaign;c=action(c,'limited');c=action(c,'verify-limited');
  expect(c.company!.projects[0].techDebt).toBe(before+2);
  c=migrateLegacy(JSON.parse(JSON.stringify(c)));c=transition(c,{type:'advance'}).campaign;c=action(c,'handoff');c=transition(c,{type:'advance'}).campaign;
  expect(c.company!.projects[0].techDebt).toBe(before+2);expect(c.company!.projects[0].stability).toBe(stability);
  const problem=c.company!.projects[0].problems.find(p=>p.id===activeTask(c)!.problemId)!;
  c.life!.calendarDay=problem.consequences![0].dueDay;resolveSceneConsequences(c);
  expect(problem.workaround).toBe(true);expect(problem.latestOutcomeKey).toBe(activeTask(c)!.outcome!.followupKey);
  expect(c.company!.projects[0].stability).toBe(stability-2);
 });
 it('applies verified proper repair once, without a completion bonus',()=>{
  const base=ordinary(),p=base.company!.projects[0],debt=p.techDebt,stability=p.stability;
  const done=complete(base,'shared');expect(done.company!.projects[0].techDebt).toBe(debt-2);expect(done.company!.projects[0].stability).toBe(stability+2);
  expect(transition(done,{type:'advance'}).campaign).toEqual(done);
 });
 it('a later durable plan does not supersede an actual workaround',()=>{
  const c=complete(ordinary(),'limited'),task=activeTask(c)!;
  commitSceneOutcome(c,{...task,id:task.id+'-plan',outcome:{...task.outcome!,kind:'durable',systemChanged:false}});
  const problem=c.company!.projects[0].problems.find(p=>p.id===task.problemId)!;
  c.life!.calendarDay=problem.consequences![0].dueDay;resolveSceneConsequences(c);
  expect(problem.latestOutcomeKey).toBe(task.outcome!.followupKey);
 });
 it('a later verified repair supersedes the old workaround',()=>{
  const c=complete(ordinary(),'limited'),task=activeTask(c)!;
  commitSceneOutcome(c,{...task,id:task.id+'-fix',outcome:{...task.outcome!,kind:'durable',systemChanged:true}});
  const p=c.company!.projects[0],stability=p.stability,problem=p.problems.find(p=>p.id===task.problemId)!;
  c.life!.calendarDay=problem.consequences![0].dueDay;resolveSceneConsequences(c);
  expect(p.stability).toBe(stability);expect(problem.workaround).toBe(false);
 });
});
