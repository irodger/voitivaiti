import '../content/companyMail';
import {encounterTeam} from './companyEngine';
import type {Campaign,Character} from './types';
import type {CompanyMailMessage} from './companyMailTypes';
/** Project existing causal facts into correspondence; never create quests or outcomes. */
export function syncCompanyMail(c:Campaign){
 const co=c.company,campaign=co?.structure?.campaign;if(!co||!campaign?.problemId)return;
 co.mail??={version:1,messages:[]};const delivered=new Set(co.mail.messages.map(m=>m.id)),kinds=new Set(['marketing-campaign','company-team-request','company-team-context','company-team-result','scene-outcome','scene-followup']);
 for(const e of co.history.filter(e=>e.problemId===campaign.problemId)){
  if(!kinds.has(e.kind))continue;const id='mail:'+e.id;if(delivered.has(id))continue;
  const source=typeof e.values?.sourceTeamId==='string'?e.values.sourceTeamId:campaign.sourceTeamId;
  const owner=typeof e.values?.ownerTeamId==='string'?e.values.ownerTeamId:campaign.targetTeamId;
  const consumer=typeof e.values?.consumerTeamId==='string'?e.values.consumerTeamId:campaign.consumerTeamId??co.structure!.teams.find(t=>t.owns.includes('web'))?.id;
  let direction:CompanyMailMessage['direction']='incoming',senderTeamId:string|undefined,senderCharacterId:string|undefined,recipientTeamId:string|undefined,subjectKey:string,bodyKeys:string[],taskId:string|undefined;
  if(e.kind==='marketing-campaign'){senderTeamId=source;recipientTeamId=owner;subjectKey='mail.campaign';bodyKeys=[e.key];}
  else if(e.kind==='company-team-request'||e.kind==='company-team-context'){direction='outgoing';senderCharacterId=e.actorId;recipientTeamId=owner;subjectKey=e.kind==='company-team-request'?'mail.request':'mail.clarification';bodyKeys=[e.key];taskId=String(e.values?.sourceTaskId??'')||undefined;}
  else if(e.kind==='company-team-result'){senderTeamId=source;senderCharacterId=e.actorId;recipientTeamId=consumer;subjectKey='mail.result';bodyKeys=[e.key];taskId=String(e.values?.sourceTaskId??'')||undefined;}
  else if(e.kind==='scene-outcome'){direction='outgoing';senderCharacterId=e.actorId;recipientTeamId=consumer;subjectKey='mail.handoff';bodyKeys=[e.key];taskId=e.id.slice(0,-':outcome'.length);}
  else if(e.kind==='scene-followup'){senderTeamId=consumer;recipientTeamId=owner;subjectKey=e.key==='org.campaign.returned'?'mail.followup':'mail.review';bodyKeys=[e.key];taskId=e.id.slice(0,-':outcome:followup'.length);}
  else continue;
  if(senderTeamId&&!co.structure!.teams.some(t=>t.id===senderTeamId))continue;
  delivered.add(id);co.mail.messages.push({id,threadId:campaign.id,eventId:e.id,projectId:e.projectId??co.structure!.product.projectId,problemId:campaign.problemId,taskId,day:e.day,minute:typeof e.values?.minute==='number'?e.values.minute:undefined,direction,senderTeamId,senderCharacterId,recipientTeamId,subjectKey,bodyKeys,readBy:direction==='outgoing'&&senderCharacterId?[senderCharacterId]:[]});
 }
}
export function unreadCompanyMail(c:Campaign){return c.company?.mail?.messages.filter(m=>m.direction==='incoming'&&!m.readBy.includes(c.activeCharacterId)).length??0;}
export function readCompanyMail(c:Campaign,id:string,create:(id:string,name:string,avatar:string,profession:string)=>Character){
 const mail=c.company?.mail?.messages.find(m=>m.id===id);if(!mail)return false;
 if(!mail.readBy.includes(c.activeCharacterId))mail.readBy.push(c.activeCharacterId);
 if(mail.senderTeamId&&!mail.senderCharacterId){const contact=encounterTeam(c,mail.senderTeamId,create);if(contact)mail.senderCharacterId=contact.id;}
 return true;
}
export function markCompanyMailUnread(c:Campaign,id:string){const mail=c.company?.mail?.messages.find(m=>m.id===id);if(!mail||mail.direction!=='incoming')return false;mail.readBy=mail.readBy.filter(id=>id!==c.activeCharacterId);return true;}
