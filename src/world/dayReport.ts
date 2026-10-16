import { findActiveCharacter } from './selectors';
import type {Campaign} from './types';
import {availableWork} from './workLoop';
import type {WorkKind} from './lifeTypes';

export type DayReport={companyId:string;characterId:string;day:number;calendarDay:number;
 tasks:{id:string;state:'delivered'|'waiting'|'carried';summaryKey?:string;temporary:boolean;evidenceOnly:boolean;recipientTeamId?:string}[];
 waiting:{id:WorkKind;projectId?:string;problemId?:string;dueDay?:number;overdue:boolean}[]};

/** Capture actual end-of-day facts; never expose future follow-up text. */
export function captureDayReport(c:Campaign):DayReport|undefined{
 const company=c.company,life=c.life,ch=findActiveCharacter(c);if(!company||!life||!ch)return;
 const completed=new Set(ch.completedWork.slice(c.dayWorkStart));
 const tasks=c.tasks.filter(task=>task.characterId===ch.id&&(task.rewarded?completed.has(task.id):task.paused||task.id===c.activeTaskId));
 return {companyId:company.id,characterId:ch.id,day:company.currentDay,calendarDay:life.calendarDay,
  tasks:tasks.map(task=>({id:task.id,state:task.rewarded?'delivered':Object.values(task.progress).some(p=>p.dependency&&!p.dependency.ready)?'waiting':'carried',summaryKey:task.rewarded?task.outcome?.summaryKey:undefined,temporary:task.rewarded&&task.outcome?.kind==='temporary',evidenceOnly:task.rewarded&&task.outcome?.systemChanged===false,recipientTeamId:task.rewarded&&Object.values(task.progress).some(p=>p.actionHistory?.includes('handoff')||p.actionHistory?.includes('verified-result')||p.actionHistory?.includes('bounded-result'))?task.encounter?.teamContext?.ownerTeamId:undefined})),
  waiting:life.queue.filter(q=>q.status!=='done'&&!q.delegatedTo&&availableWork(ch).includes(q.id)&&!tasks.some(task=>!task.rewarded&&task.workKind===q.id)).map(q=>({id:q.id,projectId:q.projectId,problemId:q.problemId,dueDay:q.expectation?.dueDay,overdue:!!q.expectation&&life.calendarDay>q.expectation.dueDay}))};
}
