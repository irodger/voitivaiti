import {describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition,type Action} from './engine';
import {activeCharacter,activeTask,emptyCampaign,makeSchedule,candidates} from './simulation';
import {finishPlaytestTask} from './playtestHelpers';
import {advanceCalendar} from './life';
import {migrateLegacy} from './store';
import {resolveTaskTemplate} from '../content/scenarios';
import {availableTechnicalActions} from './technicalActions';
import {paymentChainKeys} from '../content/paymentChain';
import type {Campaign} from './types';
const act=(c:Campaign,a:Action)=>transition(c,a).campaign;
const project=(c:Campaign)=>c.company!.projects[0];
const problem=(c:Campaign)=>project(c).problems.find(p=>p.category==='payment')!;
function start(){const c=act(emptyCampaign(),{type:'new',name:'Original',avatarId:'1',professionId:'frontend',seed:1427});delete activeCharacter(c).firstDay;activeCharacter(c).completedWork=['intro1','intro2'];return c;}
function assign(c:Campaign){c.phase='office';c.time=540;c.activeTaskId=null;c.schedule=makeSchedule(c);c.schedule[0].status='completed';const q=c.life!.queue.find(q=>q.id==='bug')!;q.status='selected';q.explained=true;q.projectId=project(c).id;q.problemId=problem(c).id;return act(c,{type:'take-task'});}
function perform(c:Campaign,id:string){const task=activeTask(c)!,step=resolveTaskTemplate(task).steps.find(s=>s.id===task.currentStepId)!;const action=availableTechnicalActions(step,task.progress[step.id]).find(a=>a.id===id)!;expect(action).toBeTruthy();if(action.artifact){for(const row of action.artifact.rows.filter(r=>!r.optional))c=act(c,{type:'artifact-inspect',actionId:id,rowId:row.id});return act(c,{type:'artifact-compare',id});}return act(c,{type:'technical-action',id});}
function returned(){let c=finishPlaytestTask(assign(start()),'limited');for(let i=0;i<2;i++)advanceCalendar(c);return c;}
describe('one causal payment history',()=>{
 it('keeps the workaround cost, waits for the report and returns the same problem with different evidence',()=>{
  let c=start();const debt=project(c).techDebt;c=finishPlaytestTask(assign(c),'limited');const id=problem(c).id,origin=activeTask(c)!.id;
  expect(project(c).techDebt).toBe(debt+2);expect(problem(c).paymentChain).toMatchObject({stage:'workaround',taskId:origin,debt:2});
  expect(problem(c).latestOutcomeKey).toBe(paymentChainKeys.temporary);expect(activeCharacter(c).experience!.at(-1)!.tags).not.toContain('review');
  advanceCalendar(c);expect(problem(c).paymentChain!.stage).toBe('workaround');advanceCalendar(c);c=assign(migrateLegacy(JSON.parse(JSON.stringify(c))));
  expect(activeTask(c)!.problemId).toBe(id);expect(activeTask(c)!.encounter!.originTaskId).toBe(origin);
  const actions=resolveTaskTemplate(activeTask(c)!).steps[0].actionFlow!.actions;
  expect(actions.find(a=>a.id==='trace')!.artifact!.rows[1].detailKey).toBe('payment.chain.before.1.data');
  expect(actions.some(a=>a.id==='contract')).toBe(true);expect(problem(c).paymentChain!.stage).toBe('returned');
 });
 it('restores an older action-proven workaround but never invents one from a template name',()=>{
  let c=returned();delete problem(c).paymentChain;c=migrateLegacy(JSON.parse(JSON.stringify(c)));
  expect(problem(c).paymentChain!.stage).toBe('returned');expect(problem(c).paymentChain!.debt).toBe(2);
  const fake=start();const t=activeTask(assign(fake))!;t.rewarded=true;fake.tasks.push(t);delete problem(fake).paymentChain;
  expect(problem(migrateLegacy(JSON.parse(JSON.stringify(fake)))).paymentChain).toBeUndefined();
 });
 it('inspection and deferral do not repair the system or reward a fictional review',()=>{
  let c=assign(returned());const debt=project(c).techDebt,stability=project(c).stability;
  c=perform(c,'previous');c=perform(c,'trace');c=perform(c,'contract');
  expect(project(c).techDebt).toBe(debt);expect(project(c).stability).toBe(stability);
  c=finishPlaytestTask(c,'limited');expect(problem(c).paymentChain!.stage).toBe('returned');expect(project(c).techDebt).toBe(debt);expect(project(c).stability).toBe(stability);
  expect(activeCharacter(c).experience!.at(-1)!.tags).not.toContain('review');expect(activeCharacter(c).experience!.at(-1)!.tags).not.toContain('production');
 });
 it('requires the changed build to be checked, repays only its own debt and cannot repeat rewards',()=>{
  let c=assign(returned());const debt=project(c).techDebt,stability=project(c).stability;
  expect(act(c,{type:'technical-action',id:'previous'})).toEqual(c);
  for(const id of ['previous','trace','contract','shared'])c=perform(c,id);
  expect(project(c).techDebt).toBe(debt);expect(problem(c).paymentChain!.stage).toBe('returned');
  c=migrateLegacy(JSON.parse(JSON.stringify(c)));c=perform(c,'verify-shared');
  expect(project(c).techDebt).toBe(debt-2);expect(project(c).stability).toBe(stability+2);
  expect(act(c,{type:'technical-action',id:'verify-shared'})).toEqual(c);
  c=finishPlaytestTask(c);expect(problem(c).paymentChain).toMatchObject({stage:'fixed',debt:0,fixedBy:activeCharacter(c).id});
  expect(problem(c).workaround).toBe(false);expect(problem(c).story!.limitations).toEqual([]);
  const tags=activeCharacter(c).experience!.at(-1)!.tags;expect(tags).toContain('production');expect(tags).not.toContain('review');
  const xp=activeCharacter(c).stats.xp;c=act(c,{type:'advance'});expect(activeCharacter(c).stats.xp).toBe(xp);
 });
 it('a hired Junior inherits the same world and verifies the actual repair without another system bonus',()=>{
  let c=finishPlaytestTask(assign(returned()));const original=activeCharacter(c).id,companyId=c.company!.id,pid=problem(c).id,fixId=activeTask(c)!.id;
  activeCharacter(c).careerNodeId='level-3';c.schedule.forEach(e=>e.status='completed');c.phase='office';const candidate=candidates(c).find(n=>n.profession==='qa')!;
  c=act(c,{type:'hire',id:candidate.id});expect(activeCharacter(c).id).toBe(candidate.id);expect(c.company!.id).toBe(companyId);
  // Complete the ordinary introduction through actual onboarding actions.
  c=act(c,{type:'sleep'});
  for(let i=0;i<15&&activeCharacter(c).firstDay!.currentOnboardingStep!=='work';i++){const step=activeCharacter(c).firstDay!.currentOnboardingStep;c=act(c,{type:'onboarding',name:'Successor',choice:step==='order'?'project':step==='meeting'?'quiet':undefined});}
  c=act(c,{type:'take-task'});expect(activeTask(c)).toBeTruthy();expect(activeTask(c)!.problemId).toBe(pid);expect(activeTask(c)!.encounter!.previousTaskId).toBe(fixId);
  expect(activeTask(c)!.encounter!.previousActorId).toBe(original);expect(activeTask(c)!.sceneFamily).toBe('review');
  const debt=project(c).techDebt,stability=project(c).stability;
  c=perform(c,'inspect-inherited');c=migrateLegacy(JSON.parse(JSON.stringify(c)));c=finishPlaytestTask(c);
  expect(project(c).techDebt).toBe(debt);expect(project(c).stability).toBe(stability);
  expect(problem(c).paymentChain).toMatchObject({stage:'verified',verifiedBy:candidate.id});expect(problem(c).status).toBe('resolved');expect(problem(c).latestOutcomeKey).toBe(paymentChainKeys.verified);
  expect(activeCharacter(c).experience!.at(-1)!.tags).toContain('review');expect(activeCharacter(c).experience!.at(-1)!.tags).not.toContain('production');
  for(let i=0;i<4;i++)advanceCalendar(c);expect(problem(c).workaround).toBe(false);expect(problem(c).paymentChain!.stage).toBe('verified');
 });
});
