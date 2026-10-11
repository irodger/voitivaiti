import {describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition} from './engine';
import {emptyCampaign,activeCharacter,activeTask,makeSchedule} from './simulation';
import {finishPlaytestTask} from './playtestHelpers';
import {resolveTaskTemplate} from '../content/scenarios';
import {availableTechnicalActions} from './technicalActions';
import {advanceCalendar} from './life';
import {migrateLegacy} from './store';
import {ordinaryProblem} from './roleRouting';
import {paymentEncounterAvailable,resolvePaymentEvents,paymentState} from './paymentCausal';
import {translate} from '../content/localization';
import {historyArtifact} from '../content/historyArtifacts';
import type {Campaign} from './types';
const problem=(c:Campaign)=>c.company!.projects[0].problems.find(p=>p.category==='payment')!;
const reload=(c:Campaign)=>migrateLegacy(JSON.parse(JSON.stringify(c)));
function start(){const c=transition(emptyCampaign(),{type:'new',name:'Trigger',avatarId:'1',professionId:'frontend',seed:1427}).campaign;delete activeCharacter(c).firstDay;activeCharacter(c).completedWork=['intro1','intro2'];return c;}
function assign(c:Campaign){c.phase='office';c.time=540;c.activeTaskId=null;c.schedule=makeSchedule(c);c.schedule[0].status='completed';const q=c.life!.queue.find(q=>q.id==='bug')!;q.status='selected';q.explained=true;q.problemId=problem(c).id;q.projectId=c.company!.projects[0].id;return transition(c,{type:'take-task'}).campaign;}
function state(c:Campaign){const task=activeTask(c)!,step=resolveTaskTemplate(task).steps.find(s=>s.id===task.currentStepId)!;return {task,step,progress:task.progress[step.id]};}
function ids(c:Campaign){const s=state(c);return availableTechnicalActions(s.step,s.progress).map(a=>a.id);}
function act(c:Campaign,id:string){const s=state(c),a=availableTechnicalActions(s.step,s.progress).find(a=>a.id===id);expect(a,id).toBeDefined();if(a!.artifact){for(const row of a!.artifact.rows.filter(r=>!r.optional))c=transition(c,{type:'artifact-inspect',actionId:id,rowId:row.id}).campaign;return transition(c,{type:'artifact-compare',id}).campaign;}return transition(c,{type:'technical-action',id}).campaign;}
function limited(){return transition(finishPlaytestTask(assign(start()),'limited'),{type:'reward-close'}).campaign;}
function report(c:Campaign){const due=problem(c).paymentCausal!.pending[0].day;while(c.life!.calendarDay<due)advanceCalendar(c);return c;}
describe('payment has an unhandled causal fact, not another cycle slot',()=>{
 it('waits for the QA consequence of the actual workaround; count and reload cannot produce it early',()=>{
  let c=limited();const p=problem(c),origin=activeTask(c)!.id,pending=structuredClone(p.paymentCausal!.pending[0]);
  expect(pending.sourceId).toBe(origin+':limited');expect(p.paymentCausal!.ready).toBeUndefined();
  for(let i=0;i<120;i++)p.story!.encounters.push({...p.story!.encounters[0],taskId:'cosmetic-'+i});activeCharacter(c).scenarioCounts['lens.frontend.payment']=120;
  c=reload(c);expect(paymentEncounterAvailable(problem(c),c.activeCharacterId!)).toBe(false);expect(ordinaryProblem(c).problem?.id).not.toBe(p.id);
  expect(problem(c).paymentCausal!.pending).toEqual([pending]);c=report(c);const ready=structuredClone(problem(c).paymentCausal!.ready!);
  expect(ready).toMatchObject({id:pending.id,sourceId:pending.sourceId,npcId:'max',day:pending.day,cause:'qa_reproduction',reasonKey:'payment.causal.whyEvidence'});
  resolvePaymentEvents(c);c=reload(c);expect(problem(c).paymentCausal!.ready).toEqual(ready);
  expect(problem(c).history.filter(e=>e.id===ready.id)).toHaveLength(1);expect(problem(c).history.find(e=>e.id===ready.id)!.values!.sourceId).toBe(pending.sourceId);
  c=assign(c);expect(activeTask(c)!.encounter).toMatchObject({triggerId:ready.id,triggerDay:ready.day,previousDecisionId:pending.sourceId,causeKey:ready.reasonKey});
  expect(historyArtifact(problem(c))!.rows.find(r=>r.id==='new-condition')!.detailKey).toBe(ready.reasonKey);
  expect(translate(resolveTaskTemplate(activeTask(c)!).descriptionKey)).not.toContain('statusUrl');
 });
 it('the delivered Backend fact revises the action set, then proper repair consumes this fact without inventing a new encounter',()=>{
  let c=assign(report(limited()));const trigger=structuredClone(problem(c).paymentCausal!.ready!),taskId=activeTask(c)!.id;
  for(const id of ['previous','trace','causal-backend'])c=act(c,id);
  expect(ids(c)).not.toContain('causal-reply');expect(ids(c)).not.toContain('causal-repair');
  c=reload(c);c=act(c,'causal-wait-backend');c=act(c,'causal-reply');
  expect(ids(c)).toEqual(['causal-contract','causal-qa']);expect(ids(c)).not.toContain('causal-client');expect(ids(c)).not.toContain('shared');
  c=reload(c);expect(state(c).progress.observations!['causal-reply']).toBe('payment.causal.backendReply');expect(problem(c).paymentCausal!.ready).toEqual(trigger);
  for(const id of ['causal-contract','causal-repair','causal-verify'])c=act(c,id);c=finishPlaytestTask(c);c=transition(c,{type:'reward-close'}).campaign;
  const s=problem(c).paymentCausal!;expect(s.handledEventIds).toContain(trigger.id);expect(s.ready).toBeUndefined();expect(s.pending).toEqual([]);expect(s.limitation).toBeUndefined();
  expect(problem(c).history.find(e=>e.id===taskId+':encounter')!.values).toMatchObject({triggerId:trigger.id,previousDecisionId:trigger.sourceId});
  c=reload(c);for(let i=0;i<12;i++)advanceCalendar(c);
  expect(paymentEncounterAvailable(problem(c),c.activeCharacterId!)).toBe(false);expect(ordinaryProblem(c).problem?.id).not.toBe(problem(c).id);expect(problem(c).paymentCausal!.ready).toBeUndefined();
 });
 it('an explicit new contract fact has a source and a non-spoiling brief, while its payload changes the investigation',()=>{
  let c=assign(report(limited()));for(const id of ['previous','trace','contract','shared','verify-shared'])c=act(c,id);c=finishPlaytestTask(c);c=report(c);c=assign(c);
  for(const id of ['causal-diff','causal-comment','causal-wait-rework','causal-rework','causal-approve'])c=act(c,id);c=finishPlaytestTask(c);
  const queued=problem(c).paymentCausal!.pending.find(e=>e.kind==='contract')!;expect(queued.sourceId).toContain(':causal-approve');
  c=report(reload(c));c=assign(c);const task=activeTask(c)!;
  expect(task.encounter).toMatchObject({triggerId:queued.id,previousDecisionId:queued.sourceId,cause:'backend_contract',causeKey:'payment.causal.whyContract'});
  expect(translate(resolveTaskTemplate(task).descriptionKey)).not.toMatch(/statusUrl|404/);
  expect(translate(problem(c).history.find(e=>e.id===queued.id)!.key)).not.toMatch(/statusUrl|404/);
  c=act(c,'causal-network');const observations=Object.values(state(c).progress.observations??{}).map(k=>translate(k)).join(' ');
  expect(observations).toBeTruthy();const artifact=state(c).step.actionFlow!.actions.find(a=>a.id==='causal-network')!.artifact!;
  expect(artifact.rows.map(r=>translate(r.detailKey!)).join(' ')).toMatch(/statusUrl/);
  c=reload(c);expect(activeTask(c)!.encounter).toEqual(task.encounter);expect(problem(c).paymentCausal!.contractChanged).toBe(true);
 });
 it('does not turn a legacy phase or a player action into a new world report',()=>{
  const c=limited(),p=problem(c),s=paymentState(p);delete s.causalVersion;s.pending=[];s.phase='dependency';s.cause='unresolved_limit';
  expect(paymentState(p).ready).toBeUndefined();expect(paymentEncounterAvailable(p,c.activeCharacterId!)).toBe(false);
  const restored=reload(c);expect(paymentState(problem(restored)).ready).toBeUndefined();
 });

});
