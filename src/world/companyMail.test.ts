import {describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition} from './engine';
import {emptyCampaign,activeCharacter,activeTask,makeSchedule} from './simulation';
import {advanceCalendar} from './life';
import {migrateLegacy} from './store';
import {syncCompanyMail,unreadCompanyMail} from './companyMail';
import {finishPlaytestTask} from './playtestHelpers';
import {resolveTaskTemplate} from '../content/scenarios';
import {availableTechnicalActions} from './technicalActions';
import {causalContext} from './causalRouting';
import type {Campaign} from './types';
function start(){const c=transition(emptyCampaign(),{type:'new',name:'Mail',avatarId:'1',professionId:'frontend',seed:1427}).campaign;delete activeCharacter(c).firstDay;activeCharacter(c).completedWork=['one','two'];return c;}
function launch(){const c=start();while(c.life!.calendarDay<c.company!.structure!.campaign.plannedDay)advanceCalendar(c);return c;}
const reload=(c:Campaign)=>migrateLegacy(JSON.parse(JSON.stringify(c)));
function assign(c:Campaign){c.activeTaskId=null;c.phase='office';c.time=540;c.schedule=makeSchedule(c);c.schedule[0].status='completed';const q=c.life!.queue.find(q=>q.id==='bug')!;q.status='selected';q.explained=true;q.projectId=c.company!.projects[0].id;q.problemId=c.company!.projects[0].problems.find(p=>p.category==='interface')!.id;return transition(c,{type:'take-task'}).campaign;}
function act(c:Campaign,id:string){const task=activeTask(c)!,step=resolveTaskTemplate(task).steps.find(s=>s.id===task.currentStepId)!,a=availableTechnicalActions(step,task.progress[step.id]).find(a=>a.id===id)!;expect(a,id).toBeDefined();if(a.artifact){for(const r of a.artifact.rows.filter(r=>!r.optional))c=transition(c,{type:'artifact-inspect',actionId:id,rowId:r.id}).campaign;return transition(c,{type:'artifact-compare',id}).campaign;}return transition(c,{type:'technical-action',id}).campaign;}
const letters=(c:Campaign)=>c.company!.mail!.messages;
const problem=(c:Campaign)=>c.company!.projects[0].problems.find(p=>p.id===c.company!.structure!.campaign.problemId)!;
describe('mail is a persistent channel for the same company chain',()=>{
 it('delivers the actual department request once and reading only marks it and encounters its sender',()=>{
  let c=launch();const org=c.company!.structure!,letter=letters(c)[0];expect(letters(c)).toHaveLength(1);expect(letter).toMatchObject({eventId:org.campaign.id+':risk',senderTeamId:org.campaign.sourceTeamId,recipientTeamId:org.campaign.targetTeamId,problemId:org.campaign.problemId,readBy:[]});expect(c.characters).toHaveLength(6);expect(unreadCompanyMail(c)).toBe(1);
  const before={time:c.time,tasks:JSON.stringify(c.tasks),stats:structuredClone(activeCharacter(c).stats),skills:structuredClone(activeCharacter(c).skills),cause:structuredClone(causalContext(c,problem(c)))};
  c=transition(c,{type:'mail-read',id:letter.id}).campaign;expect(unreadCompanyMail(c)).toBe(0);expect(letters(c)[0].senderCharacterId).toBe(c.company!.structure!.teams.find(t=>t.id===org.campaign.sourceTeamId)!.contactId);expect(c.characters).toHaveLength(7);
  expect(c.time).toBe(before.time);expect(JSON.stringify(c.tasks)).toBe(before.tasks);expect(activeCharacter(c).stats).toEqual(before.stats);expect(activeCharacter(c).skills).toEqual(before.skills);expect(causalContext(c,problem(c))).toEqual(before.cause);
  c=reload(c);syncCompanyMail(c);expect(letters(c)).toHaveLength(1);expect(unreadCompanyMail(c)).toBe(0);c=transition(c,{type:'mail-read',id:letter.id}).campaign;expect(c.characters).toHaveLength(7);c=transition(c,{type:'mail-unread',id:letter.id}).campaign;c=reload(c);expect(unreadCompanyMail(c)).toBe(1);
 });
 it('reflects request, clarification and the exact owner reply without marking task evidence as read',()=>{
  let c=assign(launch());for(const id of ['inspect','trace'])c=act(c,id);expect(letters(c).map(m=>m.subjectKey)).toEqual(['mail.campaign','mail.request']);expect(letters(c)[1]).toMatchObject({direction:'outgoing',senderCharacterId:c.activeCharacterId,recipientTeamId:c.company!.structure!.campaign.targetTeamId,taskId:activeTask(c)!.id});
  c=act(c,'campaign-local');expect(letters(c).map(m=>m.subjectKey)).toEqual(['mail.campaign','mail.request','mail.clarification','mail.result']);const reply=letters(c).at(-1)!,task=activeTask(c)!,progress=task.progress[task.currentStepId],saved=structuredClone(progress),xp=activeCharacter(c).stats.xp;
  expect(reply.senderCharacterId).toBe(progress.dependency!.npcId);expect(reply.senderTeamId).toBe(c.company!.structure!.campaign.targetTeamId);c=transition(c,{type:'mail-read',id:reply.id}).campaign;expect(activeTask(c)!.progress[task.currentStepId]).toEqual(saved);expect(activeCharacter(c).stats.xp).toBe(xp);expect(activeTask(c)!.rewarded).toBe(false);
  c=reload(c);syncCompanyMail(c);expect(letters(c)).toHaveLength(4);expect(letters(c).find(m=>m.id===reply.id)!.readBy).toContain(c.activeCharacterId);c=act(c,'campaign-reply');expect(activeTask(c)!.progress[task.currentStepId].status).toBe('completed');
 });
 it('keeps several letters in one thread and the bounded follow-up opens the same causal problem',()=>{
  let c=finishPlaytestTask(assign(launch()),'limited');const task=activeTask(c)!,due=problem(c).consequences![0].dueDay;expect(letters(c).at(-1)!.subjectKey).toBe('mail.handoff');while(c.life!.calendarDay<due)advanceCalendar(c);
  const followup=letters(c).at(-1)!,cause=causalContext(c,problem(c))!;expect(followup).toMatchObject({subjectKey:'mail.followup',bodyKeys:['org.campaign.returned'],problemId:task.problemId,taskId:task.id,senderTeamId:c.company!.structure!.campaign.consumerTeamId,eventId:cause.id});expect(new Set(letters(c).map(m=>m.threadId)).size).toBe(1);
  const saved=structuredClone(letters(c));c=reload(c);expect(letters(c)).toEqual(saved);c=transition(c,{type:'mail-read',id:followup.id}).campaign;expect(causalContext(c,problem(c))!.id).toBe(cause.id);c=assign(c);expect(activeTask(c)!.problemId).toBe(task.problemId);expect(activeTask(c)!.encounter!.triggerId).toBe(followup.eventId);
  c=finishPlaytestTask(c);const fixed=activeTask(c)!,reviewDue=problem(c).consequences!.find(e=>e.id===fixed.id+':outcome')!.dueDay;while(c.life!.calendarDay<reviewDue)advanceCalendar(c);expect(letters(c).at(-1)).toMatchObject({subjectKey:'mail.review',bodyKeys:['org.campaign.review'],problemId:task.problemId,taskId:fixed.id,senderTeamId:c.company!.structure!.campaign.consumerTeamId});expect(letters(c).find(m=>m.id===followup.id)!.bodyKeys).toEqual(['org.campaign.returned']);c=reload(c);expect(new Set(letters(c).map(m=>m.id)).size).toBe(letters(c).length);
 });
 it('projects existing facts from a prior save but never fabricates unrelated letters or work',()=>{
  let c=launch();delete c.company!.mail;const tasks=JSON.stringify(c.tasks),history=JSON.stringify(c.company!.history);c=reload(c);expect(letters(c)).toHaveLength(1);expect(JSON.stringify(c.tasks)).toBe(tasks);expect(JSON.stringify(c.company!.history)).toBe(history);
  c.company!.history.push({id:'unrelated',day:1,kind:'scene-outcome',key:'ui.work',problemId:c.company!.projects[0].problems[0].id});syncCompanyMail(c);expect(letters(c)).toHaveLength(1);expect(transition(c,{type:'mail-read',id:'missing'}).campaign).toEqual(c);
 });
});
