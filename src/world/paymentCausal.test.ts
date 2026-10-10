import {describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition} from './engine';
import {emptyCampaign,activeCharacter,activeTask,makeSchedule} from './simulation';
import {finishPlaytestTask} from './playtestHelpers';
import {resolveTaskTemplate} from '../content/scenarios';
import {availableTechnicalActions} from './technicalActions';
import {advanceCalendar} from './life';
import {migrateLegacy} from './store';
import {assignResponsibility} from './responsibility';
import {translate} from '../content/localization';
import {availableTopics} from '../content/contextDialogue';
import type {Campaign} from './types';
const problem=(c:Campaign)=>c.company!.projects[0].problems.find(p=>p.category==='payment')!;
function start(){const c=transition(emptyCampaign(),{type:'new',name:'Cause',avatarId:'1',professionId:'frontend',seed:1427}).campaign;delete activeCharacter(c).firstDay;activeCharacter(c).completedWork=['one','two'];return c;}
function assign(c:Campaign){c.phase='office';c.time=540;c.activeTaskId=null;c.schedule=makeSchedule(c);c.schedule[0].status='completed';const q=c.life!.queue.find(q=>q.id==='bug')!;q.status='selected';q.explained=true;q.delegatedTo=undefined;q.problemId=problem(c).id;q.projectId=c.company!.projects[0].id;return transition(c,{type:'take-task'}).campaign;}
function state(c:Campaign){const task=activeTask(c)!,step=resolveTaskTemplate(task).steps.find(s=>s.id===task.currentStepId)!;return {task,step,progress:task.progress[step.id]};}
function ids(c:Campaign){const s=state(c);return availableTechnicalActions(s.step,s.progress).map(a=>a.id);}
function doAction(c:Campaign,id:string){const s=state(c),a=availableTechnicalActions(s.step,s.progress).find(a=>a.id===id);expect(a,id).toBeTruthy();if(a!.artifact){for(const row of a!.artifact.rows.filter(r=>!r.optional))c=transition(c,{type:'artifact-inspect',actionId:id,rowId:row.id}).campaign;return transition(c,{type:'artifact-compare',id}).campaign;}return transition(c,{type:'technical-action',id}).campaign;}
function returned(){let c=finishPlaytestTask(assign(start()),'limited');c=transition(c,{type:'reward-close'}).campaign;while(c.life!.calendarDay<5)advanceCalendar(c);return c;}
function review(){let c=finishPlaytestTask(assign(returned()));advanceCalendar(c);return assign(c);}
function complete(c:Campaign){return finishPlaytestTask(c);}
describe('payment causal depth',()=>{
 it('retains the limited decision, limitation and cause independently of encounter count',()=>{
  let c=returned();const p=problem(c);expect(p.story!.limitations).toContain('payment.chain.temporary');const origin=p.paymentChain!.taskId;
  const variant=structuredClone(c);for(let i=0;i<25;i++)problem(variant).story!.encounters.push({...p.story!.encounters[0],taskId:'fixture-'+i});
  c=assign(c);const other=assign(variant);expect(activeTask(c)!.encounter!.cause).toBe('qa_reproduction');expect(activeTask(other)!.sceneFamily).toBe(activeTask(c)!.sceneFamily);expect(activeTask(c)!.encounter!.originTaskId).toBe(origin);expect(activeTask(c)!.encounter!.previousDecisionId).toContain(origin);
 });
 it('Backend refutes the client-only hypothesis, changes the action set and survives reload',()=>{
  let c=assign(returned());for(const id of ['previous','trace','causal-backend'])c=doAction(c,id);
  expect(state(c).progress.dependency!.responseKey).toBe('payment.causal.backendReply');expect(c.characters.find(n=>n.id===state(c).progress.dependency!.npcId)!.profession).toBe('backend');expect(ids(c)).not.toContain('causal-reply');
  c=migrateLegacy(JSON.parse(JSON.stringify(c)));c=doAction(c,'causal-wait-backend');c=doAction(c,'causal-reply');
  expect(ids(c)).toEqual(['causal-contract','causal-qa']);expect(ids(c)).not.toContain('shared');expect(state(c).progress.observations!['causal-reply']).toBe('payment.causal.backendReply');
  const loaded=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(state(loaded).progress).toEqual(state(c).progress);expect(problem(loaded).paymentCausal).toEqual(problem(c).paymentCausal);
 });
 it('review requires comment, actual colleague rework and inspection before approval',()=>{
  let c=review();expect(activeTask(c)!.sceneFamily).toBe('review');expect(activeTask(c)!.encounter!.cause).toBe('returned_review');
  const before=problem(c).paymentCausal!.peerRevision;c=doAction(c,'causal-diff');c=doAction(c,'causal-comment');expect(problem(c).paymentCausal!.peerRevision).toBe(before);expect(ids(c)).not.toContain('causal-approve');
  c=doAction(c,'causal-wait-rework');expect(problem(c).paymentCausal!.peerRevision).toBe(before+1);c=migrateLegacy(JSON.parse(JSON.stringify(c)));c=doAction(c,'causal-rework');
  expect(state(c).progress.artifactReadings!['causal-rework']).toHaveLength(2);c=doAction(c,'causal-approve');c=complete(c);expect(problem(c).paymentCausal!.phase).toBe('stable');expect(activeTask(c)!.outcome!.systemChanged).toBe(false);
 });
 it('accepted review risk causes an incident; containment cannot finish before observing partial effect',()=>{
  let c=review();c=doAction(c,'causal-diff');c=doAction(c,'causal-bounded');c=complete(c);const source=problem(c).paymentCausal!.previousDecisionId;
  for(let i=0;i<2;i++)advanceCalendar(c);c=assign(c);expect(activeTask(c)!.encounter!.cause).toBe('accepted_risk');expect(activeTask(c)!.encounter!.previousDecisionId).toBe(source);
  c=doAction(c,'causal-triage');c=doAction(c,'causal-contain');expect(activeTask(c)!.rewarded).toBe(false);expect(ids(c)).not.toContain('causal-observe');expect(problem(c).paymentCausal!.metrics).toEqual({duplicates:3,pending:2});
  const debt=c.company!.projects[0].techDebt;c=doAction(c,'causal-wait-effect');expect(problem(c).paymentCausal!.metrics).toEqual({duplicates:0,pending:7});c=doAction(c,'causal-observe');expect(ids(c)).toEqual(['causal-investigate','causal-keep']);expect(state(c).progress.observations!['causal-observe']).toBe('payment.causal.effect');expect(c.company!.projects[0].techDebt).toBe(debt);
  c=doAction(c,'causal-investigate');c=complete(c);advanceCalendar(c);c=assign(c);expect(activeTask(c)!.encounter!.cause).toBe('qa_reproduction');
 });
 it('verified peer work produces an external contract change instead of an encounter-count scene',()=>{
  let c=review();for(const id of ['causal-diff','causal-comment','causal-wait-rework','causal-rework','causal-approve'])c=doAction(c,id);c=complete(c);
  for(let i=0;i<5;i++)advanceCalendar(c);c=assign(c);expect(activeTask(c)!.encounter!.cause).toBe('backend_contract');expect(problem(c).paymentCausal!.contractChanged).toBe(true);expect(activeTask(c)!.encounter!.recurrenceKind).toBe('external-contract-change');const row=resolveTaskTemplate(activeTask(c)!).steps[0].actionFlow!.actions.find(a=>a.id==='causal-contract')!.artifact!.rows[1];expect(translate(row.detailKey!)).toContain('statusUrl');expect(translate(row.detailKey!)).toContain('404');expect(problem(c).paymentCausal!.metrics!.pending).toBe(1);
 });
 it('working conversations lead to different world events without a universal numeric reward',()=>{
  for(const choice of ['evidence','scope','risk']){
   let c=returned();const npc=c.characters.find(n=>n.id==='oleg')!,topic=availableTopics(c,npc).find(t=>t.paymentProblemId===problem(c).id)!;const before={trust:activeCharacter(c).relationships.map(r=>r.trust),skill:activeCharacter(c).skills.communication};
   c=transition(c,{type:'conversation',npcId:npc.id,topicId:topic.id,choiceId:choice}).campaign;
   expect(activeCharacter(c).relationships.map(r=>r.trust)).toEqual(before.trust);expect(activeCharacter(c).skills.communication).toBe(before.skill);
   const queued=problem(c).paymentCausal!.pending.at(-1)!;expect(queued.kind).toBe(choice==='evidence'?'evidence':choice==='scope'?'scope':'incident');
  }
 });
});

it('ten linked episodes have explicit decision and event causes rather than a family cycle',()=>{
 let c=returned();const episodes: {cause:string;previous?:string;family:string}[]=[];
 const capture=()=>{const t=activeTask(c)!;episodes.push({cause:t.encounter!.cause!,previous:t.encounter!.previousDecisionId,family:t.sceneFamily!});};
 const waitEvent=()=>{const pending=problem(c).paymentCausal!.pending;expect(pending.length).toBeGreaterThan(0);const due=Math.max(...pending.map(e=>e.day));while(c.life!.calendarDay<due)advanceCalendar(c);};
 const finish=()=>{c=complete(c);c=transition(c,{type:'reward-close'}).campaign;};
 const episode=(actions:string[])=>{c=assign(c);capture();for(const id of actions)c=doAction(c,id);finish();};
 // 1: the original limited job was completed by returned().
 expect(problem(c).story!.encounters).toHaveLength(1);
 // 2: recurrence closes the original workaround debt.
 episode(['previous','trace','contract','shared','verify-shared']);waitEvent();
 // 3: review finds a concrete issue; independent QA is requested instead of approval.
 episode(['causal-diff','causal-comment','causal-wait-rework','causal-rework','causal-return']);waitEvent();
 // 4: the answer redirects ownership to the pending-state contract, deferred with its limit.
 episode(['causal-network','causal-client','causal-backend','causal-wait-backend','causal-reply','causal-qa','causal-defer']);waitEvent();
 // Product explicitly narrows scope: the next encounter reviews that bounded release.
 const npc=c.characters.find(n=>n.id==='oleg')!,topic=availableTopics(c,npc).find(t=>t.paymentProblemId===problem(c).id)!;
 c=transition(c,{type:'conversation',npcId:npc.id,topicId:topic.id,choiceId:'scope'}).campaign;waitEvent();
 // 5: accepted scope carries an untested pending risk into production.
 episode(['causal-diff','causal-bounded']);waitEvent();
 // 6: incident is only partly contained, so the team requests evidence.
 episode(['causal-triage','causal-contain','causal-wait-effect','causal-observe','causal-investigate']);waitEvent();
 // 7: the reply and contract are checked before a changed handler is verified.
 episode(['causal-network','causal-client','causal-backend','causal-wait-backend','causal-reply','causal-contract','causal-repair','causal-verify']);waitEvent();
 // 8: the announced Backend revision is a real world event; its uncovered state is deferred.
 episode(['causal-network','causal-client','causal-backend','causal-wait-backend','causal-reply','causal-contract','causal-defer']);waitEvent();
 // 9: QA evidence is read, not the old button report; a proper repair removes the accepted risk.
 episode(['causal-network','causal-client','causal-backend','causal-wait-backend','causal-reply','causal-qa','causal-repair','causal-verify']);
 // 10: a different employed QA inherits the concrete fixed result.
 c.activeCharacterId='max';c=assign(c);capture();finish();
 expect(problem(c).story!.encounters.length).toBeGreaterThanOrEqual(10);
 expect(episodes.every(e=>e.cause&&e.previous)).toBe(true);expect(new Set(episodes.map(e=>e.family)).size).toBeGreaterThanOrEqual(4);
 expect(problem(c).paymentCausal!.acceptedRisk).toBe(false);expect(problem(c).paymentCausal!.limitation).toBeUndefined();
 expect(problem(c).story!.encounters.every(e=>e.cause)).toBe(true);
 const loaded=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(problem(loaded).history).toEqual(problem(c).history);
});


it('grade changes responsibility through hypothesis choices, conflicting evidence and delegation',()=>{
 const shapes=[];
 for(const grade of [0,1,2,3]){
  let c=start();activeCharacter(c).careerNodeId='level-'+grade;if(grade===3){activeCharacter(c).scenarioCounts['lead-review']=1;activeCharacter(c).scenarioCounts['lead-plan']=1;}c=assign(c);
  const scene=resolveTaskTemplate(activeTask(c)!);shapes.push(JSON.stringify(scene.steps.map(s=>s.actionFlow?.actions.map(a=>[a.id,a.next,a.delegates]))));
  if(grade===2)expect(scene.steps[0].actionFlow!.actions.some(a=>a.id==='causal-metrics'&&a.artifact?.kind==='metrics')).toBe(true);
  if(grade===3)expect(scene.steps[0].actionFlow!.actions.find(a=>a.id==='causal-delegate')!.delegates).toBe(true);
 }
 expect(new Set(shapes).size).toBe(4);
});
it('historical evidence contains actual decisions and limitations without exposing the hidden root cause',()=>{
 const c=assign(returned()),task=activeTask(c)!;const artifact=resolveTaskTemplate(task).steps[0].actionFlow!.actions.find(a=>a.id==='previous')!.artifact!;
 expect(artifact.rows.some(r=>r.detailKey==='payment.chain.temporary')).toBe(true);expect(artifact.rows.some(r=>r.detailKey===problem(c).rootCause)).toBe(false);
 expect(problem(c).story!.encounters[0].approach).toContain('limited');expect(task.encounter!.causeKey).not.toBe(problem(c).rootCause);
});

it('a busy colleague cannot create fictional delegation experience',()=>{
 let c=start();const ch=activeCharacter(c);ch.careerNodeId='level-3';ch.scenarioCounts['lead-review']=1;ch.scenarioCounts['lead-plan']=1;
 const backend=c.characters.find(n=>n.id!==ch.id&&n.employed&&n.profession==='backend')!;
 expect(assignResponsibility(c,'feature',backend.id)).toBe(true);
 c=assign(c);c=doAction(c,'causal-delegate');expect(state(c).progress.dependency!.delegationId).toBeUndefined();expect(state(c).progress.observations!['causal-delegate']).toBe('payment.causal.delegateBusy');c=complete(c);
 const experience=activeCharacter(c).experience!.find(e=>e.id==='work:'+activeTask(c)!.id)!;
 expect(experience.tags).not.toContain('delegation');
});

it('approving peer code cannot silently finish physically pending payments',()=>{
 let c=review();problem(c).paymentCausal!.metrics={duplicates:0,pending:7};
 for(const id of ['causal-diff','causal-comment','causal-wait-rework','causal-rework','causal-approve'])c=doAction(c,id);
 expect(problem(c).paymentCausal!.metrics).toEqual({duplicates:0,pending:7});expect(problem(c).paymentCausal!.phase).toBe('dependency');expect(problem(c).paymentCausal!.limitation).toBe('contained-pending');
});

it('recurrence has valid next actions at every grade, including Lead delegation',()=>{
 for(const grade of [0,1,2,3]){
  let c=returned();activeCharacter(c).careerNodeId='level-'+grade;activeCharacter(c).scenarioCounts['lead-review']=1;activeCharacter(c).scenarioCounts['lead-plan']=1;c=assign(c);
  for(const step of resolveTaskTemplate(activeTask(c)!).steps){const flow=step.actionFlow;if(!flow)continue;const names=flow.actions.map(a=>a.id);for(const action of flow.actions)for(const next of action.next??[])expect(names).toContain(next);}
  if(grade===3)expect(resolveTaskTemplate(activeTask(c)!).steps[0].actionFlow!.actions.find(a=>a.id==='trace')!.next).toContain('causal-delegate');
 }
});
