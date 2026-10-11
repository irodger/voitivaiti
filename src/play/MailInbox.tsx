import {useState} from 'react';
import {Mail,MailOpen,ArrowRight,ArrowLeft,Send} from 'lucide-react';
import '../content/companyMail';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {activeTask} from '../world/simulation';
import {characterName} from './shared';
import {TermText} from './TermText';
import {unreadCompanyMail} from '../world/companyMail';
import type {CompanyMailMessage} from '../world/companyMailTypes';
import './mailInbox.css';
export function MailInbox({onWork}:{onWork:(problemId:string)=>void}){
 const w=useWorld(),{t}=useI18n(),[selected,setSelected]=useState<string|null>(null),messages=[...(w.company?.mail?.messages??[])].reverse(),mail=messages.find(m=>m.id===selected),unread=unreadCompanyMail(w);
 const team=(id?:string)=>{const team=w.company?.structure?.teams.find(team=>team.id===id);return team?t(team.nameKey):'';};
 const sender=(m:CompanyMailMessage)=>{const person=w.characters.find(c=>c.id===m.senderCharacterId);return m.direction==='outgoing'&&m.senderCharacterId===w.activeCharacterId?t('mail.you'):person?characterName(person,t):team(m.senderTeamId)||t('mail.sent');};
 const current=activeTask(w),related=mail&&[...w.tasks].reverse().find(task=>task.problemId===mail.problemId&&!task.rewarded&&task.characterId===w.activeCharacterId),canResume=!!related&&(related.id===current?.id||related.paused&&(!current||current.rewarded)&&w.phase==='office');
 const problem=mail&&w.company?.projects.find(p=>p.id===mail.projectId)?.problems.find(p=>p.id===mail.problemId);
 return <section className="mail-inbox" data-selected={!!mail}><header><div><Mail size={25}/><div><h2>{t('mail.title')}</h2><p>{t('mail.hint')}</p></div></div><span className="mail-count">{t('mail.unread')}: {unread}</span></header>{messages.length===0?<div className="mail-empty"><MailOpen size={35}/><h3>{t('mail.empty')}</h3><p>{t('mail.emptyHint')}</p></div>:<div className="mail-columns"><nav className="mail-list" aria-label={t('mail.inbox')}>{messages.map(m=>{const unread=m.direction==='incoming'&&!m.readBy.includes(w.activeCharacterId);return <button key={m.id} data-mail-id={m.id} className={unread?'unread':''} aria-current={mail?.id===m.id?'true':undefined} onClick={()=>{setSelected(m.id);w.dispatch({type:'mail-read',id:m.id});}}><div>{m.direction==='outgoing'?<Send size={15}/>:unread?<Mail size={15}/>:<MailOpen size={15}/>}<b>{sender(m)}</b><small>{t('ui.day',{day:m.day})}</small></div><strong>{t(m.subjectKey)}</strong><small>{m.direction==='outgoing'?t('mail.sent'):unread?t('mail.unread'):t('mail.read')}</small></button>;})}</nav><article className="mail-reader">{mail?<><button className="mail-back" onClick={()=>setSelected(null)}><ArrowLeft size={16}/>{t('mail.inbox')}</button><div className="mail-reader-heading"><small>{team(mail.senderTeamId)}</small><h3>{t(mail.subjectKey)}</h3><p><b>{sender(mail)}</b> · {t('ui.day',{day:mail.day})}</p>{mail.recipientTeamId&&<p>{t('mail.to')}: {team(mail.recipientTeamId)}</p>}</div><div className="mail-body">{mail.bodyKeys.map((key,i)=><p key={i}><TermText>{t(key)}</TermText></p>)}</div>{problem&&<aside className="mail-related"><small>{t('mail.related')}</small><b>{t(problem.titleKey)}</b><button onClick={()=>onWork(problem.id)}>{t(canResume?'mail.resume':'mail.queue')}<ArrowRight size={16}/></button></aside>}<footer><span>{t('mail.thread')} · {messages.filter(m=>m.threadId===mail.threadId).length}</span>{mail.direction==='incoming'&&mail.readBy.includes(w.activeCharacterId)&&<button onClick={()=>w.dispatch({type:'mail-unread',id:mail.id})}>{t('mail.markUnread')}</button>}</footer></>:<div className="mail-empty"><MailOpen size={32}/><p>{t('mail.select')}</p></div>}</article></div>}</section>;
}
