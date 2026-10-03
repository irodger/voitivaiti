import type {Campaign} from './types';
import type {Outcome} from './lifeTypes';
import {resolveTaskTemplate} from '../content/scenarios';
import {professionById} from '../content/professions';

export type ReportLine={key:string;values?:Record<string,string|number>;sources:string[];day?:number;titleKey?:string;detailKeys?:string[];person?:string;problemId?:string;taskId?:string};
export type CareerReport={version:1;reason:ReportLine[];timeline:ReportLine[];decisions:ReportLine[];patterns:ReportLine[];stats:Record<string,number>;gradeHistory:{day:number;titleKey:string}[]};

// A frozen evidence selection: no thresholds change, and no inferred personality scores.
export function buildCareerReport(c:Campaign,outcome:Outcome):CareerReport{
 const ch=c.characters.find(n=>n.id===c.activeCharacterId)!,l=c.life!,end=l.calendarDay;
 const tasks=c.tasks.filter(t=>t.characterId===ch.id&&t.rewarded),experience=(ch.experience??[]).filter(e=>e.confirmed);
 const allEvents=c.company!.history;
 const ownEvents=allEvents.filter(e=>e.actorId===ch.id||e.values?.characterId===ch.id);
 const recent=l.decisionHistory.filter(e=>end-e.day<=14&&e.day>=l.characterStartedDay);
 const absences=ownEvents.filter(e=>e.kind==='absence-unagreed');
 const obligations=[...new Map(ownEvents.filter(e=>e.kind==='obligation'&&e.values?.reaction==='escalated').map(e=>[[e.values?.work,e.projectId,e.problemId,e.values?.dueDay].join(':'),e])).values()];
 const communicated=ownEvents.filter(e=>e.kind==='obligation'&&e.values?.choice);
 const reviews=ownEvents.filter(e=>e.kind==='performance-review');
 const delegations=(c.company!.delegations??[]).filter(d=>d.actorId===ch.id);
 const mentoring=experience.filter(e=>e.tags.includes('mentoring'));
 const temp=tasks.filter(t=>t.outcome?.kind==='temporary');
 const fixes=tasks.filter(t=>t.outcome?.systemChanged===true&&t.outcome.kind==='durable');
 const followups=temp.flatMap(t=>allEvents.filter(e=>e.id===t.id+':outcome:followup'));
 const recurrence=c.company!.projects.flatMap(p=>p.problems.flatMap(p=>(p.story?.encounters??[]).filter(e=>{
  const task=c.tasks.find(t=>t.id===e.taskId);return task?.sceneFamily==='recurrence'&&tasks.some(t=>t.id===(task.encounter?.originTaskId??task.encounter?.previousTaskId)&&t.outcome?.kind==='temporary');
 })));
 const mainTasks=tasks.filter(t=>!['review','support'].includes(t.workKind??''));
 const stats:Record<string,number>={calendarDays:end-l.characterStartedDay+1,playedDays:l.characterPlayedDays,completedTasks:mainTasks.length,problemTypes:new Set(tasks.map(t=>resolveTaskTemplate(t).category)).size,structures:new Set(tasks.map(t=>t.sceneFamily??'investigation')).size,incidents:tasks.filter(t=>t.sceneFamily==='incident'||resolveTaskTemplate(t).steps.some(s=>s.type==='incident-response')).length,reviews:tasks.filter(t=>t.sceneFamily==='review'||t.workKind==='review').length+experience.filter(e=>e.id.startsWith('perspective:')&&!e.tags.includes('mentoring')).length,mentoring:mentoring.length,delegations:delegations.length,delegationsChecked:delegations.filter(d=>d.status==='checked').length,temporary:temp.length,recurrences:recurrence.length,properFixes:fixes.length,overdue:obligations.length,communicated:communicated.length,unagreed:absences.length,maxStress:Math.max(l.reportMaxStress??ch.stats.stress,ch.stats.stress),vacations:l.vacations?.length??0,vacationDays:(l.vacations??[]).reduce((n,v)=>n+v.days,0),recovery:ownEvents.filter(e=>e.kind==='evening').length};
 const line=(key:string,values:ReportLine['values']={},sources:string[]=[],extra:Partial<ReportLine>={}):ReportLine=>({key,values,sources,...extra});
 const reason=[line('report.end.'+outcome,{day:end},reviews.slice(-1).map(e=>e.id))];
 if(outcome==='fired'){
  reason.push(line('report.reviewChain',{count:reviews.length,stage:l.reviewStage},reviews.map(e=>e.id)));
  const issues=[...new Set(recent.map(e=>e.kind))];
  for(const kind of issues){const events=recent.filter(e=>e.kind===kind);reason.push(line('report.issue.'+kind,{count:events.length},events.map((e,i)=>`decision:${e.day}:${kind}:${i}`)));}
  const missed=absences.filter(e=>end-e.day<=14);if(missed.length)reason.push(line('report.unagreed',{count:missed.length},missed.map(e=>e.id)));
  if(!recent.length&&!missed.length)reason.push(line('report.incomplete',{},[]));
 }
 if(outcome==='burnout')reason.push(line('report.stress',{value:stats.maxStress,count:stats.recovery},ownEvents.filter(e=>e.kind==='evening').map(e=>e.id)));
 const gradeHistory=[{day:l.characterStartedDay,titleKey:professionById[ch.profession].careers[0].titleKey},...ch.careerHistory.filter(e=>e.kind==='promotion').map(e=>({day:e.day,titleKey:e.key}))];
 const timeline=[line('report.arrival',{day:l.characterStartedDay},[ch.id],{day:l.characterStartedDay,titleKey:gradeHistory[0].titleKey})];
 const events:ReportLine[]=[];
 for(const e of ch.careerHistory.filter(e=>e.kind==='promotion'))events.push(line('report.promotion',{day:e.day},[e.id],{day:e.day,titleKey:e.key}));
 for(const t of temp.slice(0,2)){const encounter=c.company!.projects.flatMap(p=>p.problems).flatMap(p=>p.story?.encounters??[]).find(e=>e.taskId===t.id);const day=encounter?.day??experience.find(e=>e.taskId===t.id)?.day;events.push(line('report.temporary',{day:day??l.characterStartedDay},[t.id],{day,titleKey:resolveTaskTemplate(t).titleKey}));}
 for(const e of followups.slice(0,2))events.push(line('report.return',{day:e.day},[e.id],{day:e.day,detailKeys:[e.key]}));
 const lastAbsence=absences.at(-1);if(lastAbsence)events.push(line('report.absence',{day:lastAbsence.day,count:absences.length},absences.map(e=>e.id),{day:lastAbsence.day}));
 if(stats.vacations)events.push(line('report.vacationPath',{days:stats.calendarDays,tasks:stats.completedTasks,count:stats.vacations,away:stats.vacationDays},(l.vacations??[]).map(v=>'vacation:'+v.day),{day:end}));
 for(const e of mentoring.slice(-1))events.push(line('report.mentor',{day:e.day},[e.id],{day:e.day,titleKey:e.titleKey,detailKeys:e.outcome?[e.outcome]:[]}));
 timeline.push(...events.sort((a,b)=>(a.day??end)-(b.day??end)).slice(-7),line('report.finished',{day:end},[ch.id],{day:end}));
 const decisions:ReportLine[]=[];
 // Prefer causal episodes to generic completed-work rows.
 for(const t of [...temp.slice(-2),...fixes.filter(t=>t.encounter?.previousTaskId).slice(-1)]){
  const next=c.tasks.find(n=>(n.encounter?.originTaskId??n.encounter?.previousTaskId)===t.id&&n.sceneFamily==='recurrence');const follow=allEvents.find(e=>e.id===t.id+':outcome:followup');
  const encounter=c.company!.projects.flatMap(p=>p.problems).flatMap(p=>p.story?.encounters??[]).find(e=>e.taskId===t.id);
  decisions.push(line(t.outcome!.kind==='temporary'?'report.tradeoff':'report.fix',{debt:encounter?.debtImpact??0},[t.id,...(follow?[follow.id]:[]),...(next?[next.id]:[])],{taskId:t.id,problemId:t.problemId,titleKey:resolveTaskTemplate(t).titleKey,detailKeys:[t.outcome!.summaryKey,...(encounter?.debtImpact?['report.debt']:[]),...(follow?[follow.key]:[]) ,next?'report.encountered':follow?'report.followupObserved':t.outcome!.kind==='temporary'?'report.pending':'report.changed']}));
 }
 for(const t of tasks.filter(t=>t.sceneFamily==='incident'||t.sceneFamily==='review').slice(-1)){const observations=Object.values(t.progress).flatMap(p=>Object.values(p.observations??{}));decisions.push(line('report.'+t.sceneFamily,{},[t.id],{taskId:t.id,problemId:t.problemId,titleKey:resolveTaskTemplate(t).titleKey,detailKeys:[...observations.slice(-2),...(t.outcome?[t.outcome.summaryKey]:[])]}));}
 for(const d of delegations.slice(-1))decisions.push(line('report.delegation.'+d.status,{day:d.startedDay},[d.id],{person:c.characters.find(n=>n.id===d.npcId)?.name??d.npcId,problemId:d.problemId,detailKeys:[...(d.result?['responsibility.result.'+d.result]:[]),...(d.response?['responsibility.response.'+d.response]:[])]}));
 for(const e of mentoring.slice(-1)){const outcomeEvent=allEvents.find(n=>n.id===e.id);decisions.push(line('report.mentoring',{},[e.id],{titleKey:e.recipientProfession?'role.'+e.recipientProfession:e.titleKey,detailKeys:outcomeEvent?[outcomeEvent.key]:e.outcome?[e.outcome]:['report.incomplete']}));}
 for(const e of [...obligations.slice(-1),...communicated.slice(-1),...absences.slice(-1)])decisions.push(line('report.obligation',{day:e.day},[e.id],{day:e.day,titleKey:e.values?.work?'life.work.'+e.values.work:undefined,detailKeys:[e.key]}));
 if(!decisions.length)for(const t of tasks.slice(-3))decisions.push(line('report.work',{},[t.id],{taskId:t.id,problemId:t.problemId,titleKey:resolveTaskTemplate(t).titleKey,detailKeys:t.outcome?[t.outcome.summaryKey]:['report.checked']}));
 const patterns:ReportLine[]=[];
 if(temp.length>=2)patterns.push(line('report.pattern.temporary',{count:temp.length,returned:recurrence.length},temp.map(t=>t.id)));
 const investigated=tasks.filter(t=>Object.values(t.progress).some(p=>p.actionHistory?.some(id=>['inspect','trace','crosscheck','experiment','triage','local','open-artifact'].includes(id))));
 if(investigated.length>=2)patterns.push(line('report.pattern.evidence',{count:investigated.length,total:tasks.length},investigated.map(t=>t.id)));
 if(stats.communicated>=2)patterns.push(line('report.pattern.communication',{count:stats.communicated},communicated.map(e=>e.id)));
 if(absences.length>=2)patterns.push(line('report.pattern.absence',{count:absences.length},absences.map(e=>e.id)));
 if(delegations.length>=2)patterns.push(line('report.pattern.delegation',{count:delegations.length,checked:stats.delegationsChecked},delegations.map(d=>d.id)));
 if(mentoring.length)patterns.push(line('report.pattern.mentoring',{count:mentoring.length},mentoring.map(e=>e.id)));
 if(stats.recovery>=2)patterns.push(line('report.pattern.recovery',{count:stats.recovery},ownEvents.filter(e=>e.kind==='evening').map(e=>e.id)));
 const systemic=fixes.filter(t=>[...tasks.slice(0,tasks.indexOf(t))].reverse().find(old=>old.problemId===t.problemId&&(old.outcome?.kind==='temporary'||old.outcome?.systemChanged===true))?.outcome?.kind==='temporary');
 if(systemic.length)patterns.push(line('report.pattern.systemic',{count:systemic.length},systemic.map(t=>t.id)));
 return {version:1,reason,timeline,decisions:decisions.slice(0,8),patterns:patterns.slice(0,8),stats,gradeHistory};
}
