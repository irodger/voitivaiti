import {describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition,type Action} from './engine';
import {emptyCampaign,activeCharacter,activeTask,makeSchedule,plannedTemplateId,candidates} from './simulation';
import {templateById} from '../content/scenarios';
import {roleLenses,lensCases} from '../content/roleLenses';
import {professions} from '../content/professions';
import {availableTechnicalActions} from './technicalActions';
import {migrateLegacy} from './store';
import {advanceCalendar} from './life';
import {ensureWorkExpectations} from './expectations';
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
describe('world problems viewed through a role',()=>{
 it('routes one shared problem to different professions and different actions',()=>{
  const frontend=ordinary('frontend'),qa=ordinary('qa'),sre=ordinary('sre');
  expect(activeTask(frontend)!.problemId).toBe(activeTask(qa)!.problemId);
  expect(activeTask(frontend)!.problemId).toBe(activeTask(sre)!.problemId);
  const labels=(c:Campaign)=>availableTechnicalActions(templateById[activeTask(c)!.templateId].steps[0],activeTask(c)!.progress.investigate).map(a=>a.labelKey);
  expect(labels(frontend)).not.toEqual(labels(qa));expect(labels(qa)).not.toEqual(labels(sre));
  expect(activeTask(qa)!.templateId).toBe('lens.qa.payment');
 });
 it('an unsuccessful action produces new observations and actions, not the same quiz',()=>{
  let c=ordinary('backend');const task=activeTask(c)!,step=templateById[task.templateId].steps[0],before=activeCharacter(c).stats.money;
  c=action(c,'premature');let p=activeTask(c)!.progress.investigate;
  expect(p.status).toBe('active');expect(p.observations?.premature).toBeTruthy();expect(p.actionHistory).toEqual(['premature']);
  expect(availableTechnicalActions(step,p).map(a=>a.id)).toEqual(['inspect']);expect(activeCharacter(c).stats.money).toBe(before);
  expect(transition(c,{type:'advance'}).campaign).toEqual(c);
  c=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(activeTask(c)!.progress.investigate).toEqual(p);
  c=action(c,'inspect');p=activeTask(c)!.progress.investigate;expect(availableTechnicalActions(step,p).map(a=>a.id)).toEqual(['trace']);
  expect(action(c,'premature')).toEqual(c);c=action(c,'trace');expect(activeTask(c)!.progress.investigate.status).toBe('completed');
 });
 it('both tradeoffs succeed with distinct persistent world outcomes and delayed reactions',()=>{
  const base=ordinary('frontend'),limited=complete(structuredClone(base),'limited'),shared=complete(structuredClone(base),'shared');
  for(const c of [limited,shared])expect(activeTask(c)!.rewarded).toBe(true);
  const problem=(c:Campaign)=>c.company!.projects[0].problems.find(p=>p.id===activeTask(c)!.problemId)!;
  expect(problem(limited).workaround).toBe(true);expect(problem(shared).workaround).toBe(false);
  expect(problem(limited).latestOutcomeKey).not.toBe(problem(shared).latestOutcomeKey);
  expect(activeTask(shared)!.taskElapsedMinutes).toBeGreaterThan(activeTask(limited)!.taskElapsedMinutes);
  expect(activeTask(limited)!.progress.handoff.observations!.handoff).not.toBe(activeTask(shared)!.progress.handoff.observations!.handoff);
  const restored=migrateLegacy(JSON.parse(JSON.stringify(limited)));advanceCalendar(restored);advanceCalendar(restored);
  expect(problem(restored).latestOutcomeKey).toBe(activeTask(restored)!.outcome!.followupKey);
  expect(restored.company!.history.some(e=>e.kind==='scene-followup')).toBe(true);
  const count=restored.company!.history.filter(e=>e.kind==='scene-followup').length;advanceCalendar(restored);
  expect(restored.company!.history.filter(e=>e.kind==='scene-followup')).toHaveLength(count);
 });
 it.each(roleLenses.flatMap(r=>lensCases.map(category=>[r.id,category])))('every branch of %s / %s reaches completion and survives reload',(role,category)=>{
  const c=ordinary(role,category);for(const style of ['limited','shared'] as const){
   let next=action(structuredClone(c),'premature');next=migrateLegacy(JSON.parse(JSON.stringify(next)));next=complete(next,style);
   expect(activeTask(next)!.rewarded).toBe(true);expect(next.phase).toBe('reward');
  }
 });
 it('keeps every profession out of generic priority routing after its initial work',()=>{
  for(const role of professions){const c=ordinary(role.id);expect(plannedTemplateId(c).startsWith('priority.')).toBe(false);expect(activeTask(c)!.templateId.startsWith('priority.')).toBe(false);}
 });
 it('assisting a queue item starts professional interaction instead of auto-completing it',()=>{
  let c=ordinary('qa');c.tasks=[];c.activeTaskId=null;const q=c.life!.queue.find(q=>q.id==='bug')!;q.status='waiting';
  c=transition(c,{type:'help-work',id:'bug'}).campaign;expect(q.status).toBe('waiting');expect(c.life!.queue.find(q=>q.id==='bug')!.status).toBe('selected');
  expect(activeTask(c)!.templateId.startsWith('lens.qa.')).toBe(true);expect(activeTask(c)!.rewarded).toBe(false);
 });
 it('a successor inherits pending problem consequences',()=>{
  let c=complete(ordinary('frontend'),'limited');activeCharacter(c).careerNodeId='level-3';c.phase='home';c.schedule.forEach(e=>e.status='completed');
  const projectId=activeTask(c)!.projectId,problemId=activeTask(c)!.problemId,old=activeCharacter(c).id;
  c=transition(c,{type:'hire',id:candidates(c).find(n=>n.profession==='qa')!.id}).campaign;
  advanceCalendar(c);advanceCalendar(c);
  const problem=c.company!.projects.find(p=>p.id===projectId)!.problems.find(p=>p.id===problemId)!;
  expect(problem.consequences![0].resolved).toBe(true);expect(problem.causedBy).toBe(old);expect(problem.workaround).toBe(true);
 });
});
describe('observable work expectations',()=>{
 it('ignored work produces colleague reactions even without taking a task',()=>{
  let c=ordinary();c.tasks=[];c.activeTaskId=null;c.life!.queue.forEach(q=>q.status='waiting');
  ensureWorkExpectations(c);for(let i=0;i<6;i++){
   c=transition(c,{type:'end-day'}).campaign;c=transition(c,{type:'sleep'}).campaign;
   c=transition(c,{type:'event',id:c.schedule.find(e=>e.type==='sync')!.id,choiceId:'plan'}).campaign;
  }
  const e=c.life!.queue.find(q=>q.id==='bug')!.expectation!;
  expect(e.state).toBe('escalated');expect(e.reactionKey).toBe('expect.reaction.escalated');
  expect(c.company!.history.some(e=>e.kind==='obligation')).toBe(true);expect(c.life!.decisions.communicationFailures).toBeGreaterThan(0);
  expect(activeCharacter(c).completedWork).toHaveLength(2);
 });
 it('communication changes the expectation and cannot be used as an endless postponement',()=>{
  let c=ordinary(),q=c.life!.queue.find(q=>q.id==='bug')!,due=q.expectation!.dueDay;
  const perform=(a:Action)=>{c=transition(c,a).campaign;};perform({type:'work-expectation',id:'bug',choice:'postpone'});
  q=c.life!.queue.find(q=>q.id==='bug')!;expect(q.expectation!.dueDay).toBeGreaterThan(due);expect(q.expectation!.reactionKey).toBe('expect.reply.postpone');
  c=migrateLegacy(JSON.parse(JSON.stringify(c)));const before=structuredClone(c);perform({type:'work-expectation',id:'bug',choice:'postpone'});expect(c).toEqual(before);
  perform({type:'work-expectation',id:'bug',choice:'blocker'});expect(c).toEqual(before);
  perform({type:'work-expectation',id:'bug',choice:'defer'});expect(c.life!.queue.find(q=>q.id==='bug')!.expectation!.reactionKey).toBe('expect.reply.defer');
 });
});
it('support stops a password request and collects safe evidence without claiming a developer repair',()=>{let c=ordinary('support','payment');const initial={...activeCharacter(c).stats};c=action(c,'premature');expect(activeTask(c)!.completedStepIds).toEqual([]);expect(activeCharacter(c).stats.money).toBe(initial.money);c=action(c,'inspect');c=action(c,'contact');c=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(activeTask(c)!.progress.investigate.actionHistory).toEqual(['premature','inspect','contact']);c=action(c,'trace');c=transition(c,{type:'advance'}).campaign;c=action(c,'shared');c=action(c,'verify-shared');c=transition(c,{type:'advance'}).campaign;c=action(c,'handoff');c=transition(c,{type:'advance'}).campaign;const problem=c.company!.projects[0].problems.find(p=>p.id===activeTask(c)!.problemId)!;expect(problem.contributions).toContain('discovery');expect(problem.contributions).not.toContain('repair');expect(activeTask(c)!.rewarded).toBe(true);});
it('mobile can investigate connectivity and restore that knowledge before choosing a scope',()=>{let c=ordinary('mobile','payment');c=action(c,'inspect');c=action(c,'contact');c=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(activeTask(c)!.progress.investigate.actionHistory).toEqual(['inspect','contact']);const step=templateById[activeTask(c)!.templateId].steps[0];expect(availableTechnicalActions(step,activeTask(c)!.progress.investigate).map(a=>a.id)).toEqual(['trace']);c=action(c,'trace');expect(activeTask(c)!.progress.investigate.status).toBe('completed');expect(activeTask(c)!.templateId).toBe('lens.mobile.payment');});
it('DevOps records environment comparison without treating a green deployment as product success',()=>{let c=ordinary('devops','interface');c=action(c,'premature');expect(activeTask(c)!.completedStepIds).toEqual([]);c=action(c,'inspect');c=action(c,'contact');c=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(activeTask(c)!.progress.investigate.actionHistory).toEqual(['premature','inspect','contact']);c=action(c,'trace');expect(activeTask(c)!.progress.investigate.status).toBe('completed');expect(activeTask(c)!.templateId).toBe('lens.devops.interface');});
it('DBA checks restoration on a copy and does not claim a production repair',()=>{let c=ordinary('dba','payment');c=action(c,'inspect');c=action(c,'contact');c=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(activeTask(c)!.progress.investigate.actionHistory).toEqual(['inspect','contact']);c=action(c,'trace');c=transition(c,{type:'advance'}).campaign;const debt=c.company!.projects[0].techDebt;c=action(c,'shared');c=action(c,'verify-shared');expect(c.company!.projects[0].techDebt).toBe(debt);c=transition(c,{type:'advance'}).campaign;c=action(c,'handoff');c=transition(c,{type:'advance'}).campaign;const problem=c.company!.projects[0].problems.find(p=>p.id===activeTask(c)!.problemId)!;expect(problem.contributions).toContain('preparation');expect(problem.contributions).not.toContain('repair');expect(problem.status).not.toBe('resolved');});

it.each(['qa-automation','ux-research','analyst','business-analyst','data-analyst','data-engineer','sysadmin','security','project','delivery','solution-architect','architect'])('%s preserves investigation and contributes evidence without claiming repair',role=>{let c=ordinary(role,'payment');c=action(c,'premature');expect(activeTask(c)!.completedStepIds).toEqual([]);c=action(c,'inspect');c=action(c,'contact');c=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(activeTask(c)!.progress.investigate.actionHistory).toEqual(['premature','inspect','contact']);c=action(c,'trace');c=transition(c,{type:'advance'}).campaign;const debt=c.company!.projects[0].techDebt;c=action(c,'shared');c=action(c,'verify-shared');expect(c.company!.projects[0].techDebt).toBe(debt);c=transition(c,{type:'advance'}).campaign;c=action(c,'handoff');c=transition(c,{type:'advance'}).campaign;const problem=c.company!.projects[0].problems.find(p=>p.id===activeTask(c)!.problemId)!;expect(problem.contributions).toContain(role==='qa-automation'?'validation':['ux-research','data-analyst'].includes(role)?'discovery':'preparation');expect(problem.contributions).not.toContain('repair');expect(problem.status).not.toBe('resolved');expect(activeTask(c)!.rewarded).toBe(true);});

it('all professions have ordinary role-specific investigations after starting scenarios',()=>{expect(new Set(roleLenses.map(l=>l.id))).toEqual(new Set(professions.map(p=>p.id)));for(const role of professions)for(const category of lensCases){const c=ordinary(role.id,category);expect(activeTask(c)!.templateId).toBe(`lens.${role.id}.${category}`);}});
