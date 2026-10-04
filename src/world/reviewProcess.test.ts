import {describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition} from './engine';
import {activeCharacter,activeTask,emptyCampaign,makeSchedule} from './simulation';
import {finishPlaytestTask} from './playtestHelpers';
import {resolveTaskTemplate} from '../content/scenarios';
import {availableTechnicalActions} from './technicalActions';
import {migrateLegacy} from './store';
import type {Campaign} from './types';
function assign(c:Campaign){const p=c.company!.projects[0],q=c.life!.queue.find(q=>q.id==='bug')!;q.status='selected';q.explained=true;q.projectId=p.id;q.problemId=p.problems.find(p=>p.category==='payment')!.id;c.phase='office';c.time=540;c.activeTaskId=null;c.schedule=makeSchedule(c);c.schedule[0].status='completed';return transition(c,{type:'take-task'}).campaign;}
function startReview(){let c=transition(emptyCampaign(),{type:'new',name:'Review',avatarId:'1',professionId:'frontend',seed:1427}).campaign;delete activeCharacter(c).firstDay;activeCharacter(c).completedWork=['one','two'];c=assign(finishPlaytestTask(assign(c)));expect(activeTask(c)!.sceneFamily).toBe('review');return c;}
const act=(c:Campaign,id:string)=>transition(c,{type:'technical-action',id}).campaign;
function state(c:Campaign){const task=activeTask(c)!,step=resolveTaskTemplate(task).steps[0];return {task,step,progress:task.progress[step.id]};}
describe('review as a colleague process',()=>{
 it('cannot invent a reply; local work advances the pending request through reload',()=>{
  let c=act(act(startReview(),'inspect-review'),'comment');let s=state(c);
  expect(s.progress.dependency?.ready).toBe(false);
  expect(availableTechnicalActions(s.step,s.progress).map(a=>a.id)).not.toContain('experiment');
  expect(act(c,'experiment')).toBe(c);
  expect(transition(c,{type:'artifact-inspect',actionId:'experiment',rowId:'neighbor'}).campaign).toBe(c);
  c=act(c,'review-context');c=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(state(c).progress.dependency?.ready).toBe(false);
  c=act(c,'review-boundary');s=state(c);expect(s.progress.dependency?.ready).toBe(true);
  expect(availableTechnicalActions(s.step,s.progress).map(a=>a.id)).toContain('experiment');
  expect(s.progress.observations?.['review-context']).toBe('story.review.wait.result');
 });
 it('requires visible returned evidence and records a finding without repairing production',()=>{
  let c=startReview();const p=c.company!.projects[0],before={debt:p.techDebt,stability:p.stability};
  for(const id of ['inspect-review','comment','review-context','review-boundary'])c=act(c,id);
  expect(act(c,'experiment')).toBe(c);
  for(const rowId of ['original','neighbor'])c=transition(c,{type:'artifact-inspect',actionId:'experiment',rowId}).campaign;
  c=transition(c,{type:'artifact-compare',id:'experiment'}).campaign;
  expect(state(c).progress.observations?.experiment).toBe('story.review.reply.result');
  c=finishPlaytestTask(c);const task=activeTask(c)!;
  expect(task.outcome?.systemChanged).toBe(false);expect(task.outcome?.summaryKey).toBe('story.review.handoff.result');
  expect(c.company!.projects[0].techDebt).toBe(before.debt);expect(c.company!.projects[0].stability).toBe(before.stability);
  expect(c.company!.projects[0].problems.find(p=>p.id===task.problemId)!.story!.observations).toContain('story.review.reply.result');
 });
 it('allows an honest bounded handoff without pretending the missing test passed',()=>{
  let c=act(startReview(),'inspect-review');c=act(c,'approve-bounds');c=finishPlaytestTask(c,'limited');
  const task=activeTask(c)!;expect(task.outcome?.kind).toBe('temporary');expect(task.outcome?.systemChanged).toBe(false);
  expect(Object.values(task.progress).some(p=>p.observations?.experiment)).toBe(false);
 });
 it('a waiting review can be paused and resumed with the same request',()=>{
  let c=act(act(startReview(),'inspect-review'),'comment');const id=activeTask(c)!.id,request=structuredClone(state(c).progress.dependency);
  c=transition(c,{type:'pause-task'}).campaign;c=migrateLegacy(JSON.parse(JSON.stringify(c)));
  expect(c.activeTaskId).toBeNull();expect(c.tasks.find(t=>t.id===id)!.paused).toBe(true);
  c=transition(c,{type:'resume-task',id}).campaign;expect(state(c).progress.dependency).toEqual(request);
 });
});
