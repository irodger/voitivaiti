import {describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition} from './engine';
import {emptyCampaign,activeCharacter,activeTask,makeSchedule} from './simulation';
import {advanceCalendar} from './life';
import {advanceCompanyStructure,campaignTeams} from './companyEngine';
import {resolveTaskTemplate} from '../content/scenarios';
import {availableTechnicalActions} from './technicalActions';
import {finishPlaytestTask} from './playtestHelpers';
import {migrateLegacy} from './store';
import {causalContext} from './causalRouting';
import type {Campaign} from './types';
function start(seed=1427){const c=transition(emptyCampaign(),{type:'new',name:'Interaction',avatarId:'1',professionId:'frontend',seed}).campaign;delete activeCharacter(c).firstDay;activeCharacter(c).completedWork=['one','two'];return c;}
const reload=(c:Campaign)=>migrateLegacy(JSON.parse(JSON.stringify(c)));
function launch(c=start()){while(c.life!.calendarDay<c.company!.structure!.campaign.plannedDay)advanceCalendar(c);return c;}
function assign(c:Campaign){c.activeTaskId=null;c.phase='office';c.time=540;c.schedule=makeSchedule(c);c.schedule[0].status='completed';const q=c.life!.queue.find(q=>q.id==='bug')!;q.status='selected';q.explained=true;q.projectId=c.company!.projects[0].id;q.problemId=c.company!.projects[0].problems.find(p=>p.category==='interface')!.id;return transition(c,{type:'take-task'}).campaign;}
function state(c:Campaign){const task=activeTask(c)!,step=resolveTaskTemplate(task).steps.find(s=>s.id===task.currentStepId)!;return {task,step,progress:task.progress[step.id]};}
function ids(c:Campaign){const s=state(c);return availableTechnicalActions(s.step,s.progress).map(a=>a.id);}
function act(c:Campaign,id:string){const s=state(c),action=availableTechnicalActions(s.step,s.progress).find(a=>a.id===id);expect(action,id).toBeDefined();if(action!.artifact){for(const row of action!.artifact.rows.filter(r=>!r.optional))c=transition(c,{type:'artifact-inspect',actionId:id,rowId:row.id}).campaign;return transition(c,{type:'artifact-compare',id}).campaign;}return transition(c,{type:'technical-action',id}).campaign;}
const problem=(c:Campaign)=>c.company!.projects[0].problems.find(p=>p.id===c.company!.structure!.campaign.problemId)!;
describe('one complete department interaction',()=>{
 it.each([88,1427])('uses the saved ownership graph even with opaque IDs and a stale target in company %s',seed=>{
  let c=start(seed);const org=c.company!.structure!,names=new Map(org.teams.map((t,i)=>[t.id,'actual-team-'+seed+'-'+i]));
  for(const team of org.teams){team.id=names.get(team.id)!;team.dependsOn=team.dependsOn.map(id=>names.get(id)!);}
  for(const d of org.departments)d.teamIds=d.teamIds.map(id=>names.get(id)!);for(const p of c.company!.projects[0].problems)if(p.ownerTeamId)p.ownerTeamId=names.get(p.ownerTeamId);
  org.campaign.sourceTeamId=names.get(org.campaign.sourceTeamId)!;org.campaign.targetTeamId=org.teams.find(t=>t.owns.includes('sales'))!.id;
  const route=campaignTeams(c)!;c=launch(reload(c));const campaign=c.company!.structure!.campaign;
  expect(campaign.expectedLoad).toMatchObject({baselineMultiplier:1,expectedMultiplier:3});expect(campaign.result).toBeUndefined();expect(campaign.targetTeamId).toBe(route.owner.id);expect(campaign.routeTeamIds).toEqual([route.source.id,route.consumer.id,route.owner.id]);expect(problem(c).ownerTeamId).toBe(route.owner.id);
  c=assign(c);expect(activeTask(c)!.problemId).toBe(campaign.problemId);expect(activeTask(c)!.encounter!.teamContext).toMatchObject({sourceTeamId:route.source.id,consumerTeamId:route.consumer.id,ownerTeamId:route.owner.id,originEventId:campaign.id+':risk'});
 });
 it('does not invent a cross-department job when the product has no capacity dependency',()=>{
  const c=start(),route=campaignTeams(c)!;route.consumer.dependsOn=route.consumer.dependsOn.filter(id=>id!==route.owner.id);c.life!.calendarDay=c.company!.structure!.campaign.plannedDay;advanceCompanyStructure(c);
  expect(campaignTeams(c)).toBeUndefined();expect(c.company!.structure!.campaign.state).toBe('planned');expect(c.company!.history.some(e=>e.kind==='marketing-campaign')).toBe(false);expect(c.characters).toHaveLength(6);
 });
 it('waits for the actual owner, restores the request, and discovers a new capacity boundary before scope choice',()=>{
  let c=assign(launch());const org=c.company!.structure!,route=campaignTeams(c)!;expect(route.owner.contactId).toBeUndefined();expect(org.campaign.capacityCheck).toBeUndefined();
  c=act(c,'inspect');const xp=activeCharacter(c).stats.xp;c=act(c,'trace');expect(activeCharacter(c).stats.xp).toBe(xp);let s=state(c),owner=c.company!.structure!.teams.find(t=>t.id===route.owner.id)!;
  expect(s.progress.dependency!.npcId).toBe(owner.contactId);expect(c.characters.find(ch=>ch.id===owner.contactId)!.profession).toBe(owner.contactProfession);expect(s.progress.dependency!.ready).toBe(false);expect(ids(c)).not.toContain('campaign-reply');expect(c.company!.structure!.campaign.capacityCheck).toBeUndefined();
  const count=c.characters.length;c=reload(c);expect(c.characters).toHaveLength(count);expect(ids(c)).toEqual(['campaign-local']);expect(transition(c,{type:'technical-action',id:'campaign-reply'}).campaign).toEqual(c);
  c=act(c,'campaign-local');c=reload(c);expect(ids(c)).toEqual(['campaign-reply']);expect(c.company!.structure!.campaign.capacityCheck).toMatchObject({ownerTeamId:route.owner.id,testedMultiplier:2,expectedMultiplier:3});
  c=act(c,'campaign-reply');expect(activeCharacter(c).stats.xp).toBeGreaterThan(xp);const earned=activeCharacter(c).stats.xp;expect(activeCharacter(transition(c,{type:'technical-action',id:'campaign-reply'}).campaign).stats.xp).toBe(earned);s=state(c);expect(s.progress.observations!['campaign-reply']).toBe('org.campaign.reply.result');expect(s.progress.status).toBe('completed');c=transition(c,{type:'advance'}).campaign;expect(ids(c)).toEqual(['limited','shared']);
  c=reload(c);expect(c.characters).toHaveLength(count);expect(problem(c).history.filter(e=>e.kind==='company-team-result')).toHaveLength(1);
 });
 it('a bounded result creates a return of the same campaign problem; proper repair then hands a review to Product',()=>{
  let c=finishPlaytestTask(assign(launch()),'limited');const first=activeTask(c)!,relation=structuredClone(first.encounter!.teamContext!),due=problem(c).consequences![0].dueDay;
  expect(first.outcome!.summaryKey).toBe('org.campaign.bounded');expect(c.company!.structure!.campaign.result).toMatchObject({taskId:first.id,kind:'bounded',coverageMultiplier:2});expect(first.outcome!.teamContext).toEqual(relation);c=reload(c);while(c.life!.calendarDay<due)advanceCalendar(c);
  const cause=causalContext(c,problem(c))!;expect(cause).toMatchObject({family:'recurrence',key:'org.campaign.returned',previousTaskId:first.id,teamContext:relation});
  c=assign(c);expect(activeTask(c)!.problemId).toBe(first.problemId);expect(activeTask(c)!.encounter!.teamContext).toEqual(relation);expect(activeTask(c)!.encounter!.previousTaskId).toBe(first.id);
  c=finishPlaytestTask(c);const fixed=activeTask(c)!,followup=problem(c).consequences!.find(e=>e.id===fixed.id+':outcome')!;expect(fixed.outcome!.systemChanged).toBe(true);expect(fixed.outcome!.summaryKey).toBe('org.campaign.proper');expect(c.company!.structure!.campaign.result).toMatchObject({taskId:fixed.id,kind:'verified',coverageMultiplier:3});expect(followup.outcome.teamContext).toEqual(relation);
  c=reload(c);while(c.life!.calendarDay<followup.dueDay)advanceCalendar(c);c=assign(c);expect(activeTask(c)!.sceneFamily).toBe('review');expect(activeTask(c)!.encounter!.causeKey).toBe('org.campaign.review');expect(resolveTaskTemplate(activeTask(c)!).author).toBe(c.company!.structure!.teams.find(t=>t.id===relation.consumerTeamId)!.contactId);expect(activeTask(c)!.encounter!.teamContext).toEqual(relation);expect(activeTask(c)!.encounter!.previousTaskId).toBe(fixed.id);expect(activeTask(c)!.encounter!.triggerId).not.toBe(relation.originEventId);
 });
 it('continues an already launched v0.59.0 company using its existing graph',()=>{
  let c=launch(start(88));const org=c.company!.structure!,route=campaignTeams(c)!,count=c.company!.projects[0].problems.length;
  delete org.campaign.consumerTeamId;delete org.campaign.routeTeamIds;delete org.campaign.expectedLoad;
  for(const e of [...c.company!.history,...c.company!.projects[0].history,...problem(c).history])if(e.kind==='marketing-campaign'&&e.values){delete e.values.consumerTeamId;delete e.values.originEventId;}
  c=assign(reload(c));expect(c.company!.projects[0].problems).toHaveLength(count);expect(activeTask(c)!.encounter!.teamContext!.consumerTeamId).toBe(route.consumer.id);
  for(const id of ['inspect','trace','campaign-local'])c=act(c,id);c=reload(c);c=act(c,'campaign-reply');
  expect(problem(c).history.find(e=>e.kind==='company-team-result')!.values!.consumerTeamId).toBe(route.consumer.id);expect(c.company!.structure!.campaign.capacityCheck!.ownerTeamId).toBe(route.owner.id);
 });

});

 describe('campaign route regression with reload while waiting',()=>{
  it.each(['limited','shared'])('%s route preserves ownership, boundaries, handoff and consumed causes',style=>{
   let c=assign(launch());const initial=activeTask(c)!,trigger=initial.encounter!.triggerId!,route=campaignTeams(c)!;
   c=act(c,'inspect');c=act(c,'trace');
   const waiting=state(c).progress.dependency!;expect(waiting.ready).toBe(false);
   const actor=waiting.npcId;expect(actor).toBe(c.company!.structure!.teams.find(t=>t.id===route.owner.id)!.contactId);
   c=transition(c,{type:'pause-task'}).campaign;c=reload(c);
   expect(c.activeTaskId).toBeNull();expect(c.tasks.find(t=>t.id===initial.id)!.paused).toBe(true);
   for(let guard=0;guard<5&&!c.tasks.find(t=>t.id===initial.id)!.progress[initial.currentStepId].dependency!.ready;guard++){
    const before=c.time;c=transition(c,{type:'wait-for-reply',id:initial.id}).campaign;expect(c.time).toBeGreaterThan(before);c=reload(c);
   }
   const restored=c.tasks.find(t=>t.id===initial.id)!.progress[initial.currentStepId].dependency!;
   expect(restored).toMatchObject({ready:true,npcId:actor});
   expect(c.company!.mail!.messages.find(m=>m.subjectKey==='mail.result')).toMatchObject({senderCharacterId:actor,senderTeamId:route.owner.id});
   c=transition(c,{type:'resume-task',id:initial.id}).campaign;c=act(c,'campaign-reply');
   c=finishPlaytestTask(c,style);const done=activeTask(c)!;
   expect(done.outcome!.summaryKey).toBe(style==='limited'?'org.campaign.bounded':'org.campaign.proper');
   expect(c.company!.structure!.campaign.result!.coverageMultiplier).toBe(style==='limited'?2:3);
   c=reload(c);expect(c.company!.structure!.campaign.result!.coverageMultiplier).toBe(style==='limited'?2:3);
   expect(c.tasks.filter(t=>t.encounter?.triggerId===trigger)).toHaveLength(1);
   const pending=problem(c).consequences!.find(e=>e.id===done.id+':outcome')!;
   while(c.life!.calendarDay<pending.dueDay)advanceCalendar(c);
   const next=causalContext(c,problem(c))!;expect(next.family).toBe(style==='limited'?'recurrence':'review');
   c=assign(reload(c));const continuation=activeTask(c)!;expect(continuation.encounter!.triggerId).toBe(next.id);
   if(style==='shared')expect(resolveTaskTemplate(continuation).author).toBe(c.company!.structure!.teams.find(t=>t.id===route.consumer.id)!.contactId);
   const taskCount=c.tasks.length;c=transition(c,{type:'take-task'}).campaign;expect(c.tasks).toHaveLength(taskCount);
   c=finishPlaytestTask(c);c=reload(c);
   expect(causalContext(c,problem(c))?.id).not.toBe(next.id);
   expect(c.tasks.filter(t=>t.encounter?.triggerId===next.id)).toHaveLength(1);
   expect(problem(c).history.filter(e=>e.kind==='company-team-result')).toHaveLength(1);
  });
 });
