import {FileCode2,FolderOpen,Terminal,Globe,MessageSquare,Search,ArrowUpRight} from 'lucide-react';
import {useI18n} from '../content/localization';
import {TermText} from './TermText';
import {Button,Code} from './shared';
import {ArtifactData} from './ArtifactData';
import {useState,useEffect} from 'react';
import {collectAppEvidence} from './appEvidence';
import {AppIllustration} from './AppIllustration';
import '../content/evidenceShelf';
import './evidenceShelf.css';
import type {AppId,Task} from '../world/types';
import '../content/workArtifacts';
import '../content/workspaceUx';
import './workArtifact.css';
import './appContext.css';
export function AppContext({app,task,onContinue}:{app:AppId;task:Task;onContinue:()=>void}){
 const {t}=useI18n(),{template,step,relevant,notes,sources,records,completed}=collectAppEvidence(task,app);
 const [sourceIndex,setSourceIndex]=useState<number|null>(null),[query,setQuery]=useState('');
 useEffect(()=>{setSourceIndex(null);setQuery('');},[app,task.id]);
 const selected=sourceIndex===null?sources.length-1:Math.min(sourceIndex,sources.length-1);
 const normalized=query.trim().toLocaleLowerCase();
 const matches=(keys:string[])=>!normalized||keys.map(key=>t(key)).join(' ').toLocaleLowerCase().includes(normalized);
 const visibleNotes=notes.filter(key=>matches([key])),visibleRecords=records.filter(({row,title})=>matches([title,row.labelKey,row.detailKey??'']));
 const empty=notes.length===0&&records.length===0&&sources.length===0;
 const visibleMessages=app==='chat'?completed.filter(s=>matches([s.titleKey,s.bodyKey])):[];
 const visibleSources=sources.map((code,index)=>({code,index})).filter(x=>!normalized||x.code.toLocaleLowerCase().includes(normalized));
 const displayedSource=visibleSources.find(x=>x.index===selected)??visibleSources[0];
 const noMatches=!!normalized&&!visibleNotes.length&&!visibleRecords.length&&!visibleMessages.length&&(!(app==='ide'||app==='console')||!visibleSources.length);
 const recordList=<div className="context-records">{visibleRecords.map(({row,kind,title},i)=><article key={i}><small>{t(title)}</small><h3>{t(row.labelKey)}</h3><ArtifactData row={row} kind={kind}/></article>)}</div>;
 const observationList=<div className="context-notes">{visibleNotes.map((key,i)=><article key={i}><span className="context-index">{String(i+1).padStart(2,'0')}</span><p><TermText>{t(key)}</TermText></p></article>)}</div>;
 const hasEvidence=!empty||app==='chat'&&completed.length>0;
 if(!hasEvidence){const labels={ide:['noSource','noSourceHint'],console:['noLogs','noLogsHint'],browser:['noPreview','noPreviewHint'],chat:['noMessages','noMessagesHint']}[app];return <section className={'app-context context-'+app+' context-empty-reference'}><div className="context-empty"><AppIllustration app={app}/><h3>{t('appContext.'+labels[0])}</h3><p>{t('appContext.'+labels[1])}</p><Button onClick={onContinue}>{t(task.rewarded?'desk.back':'ui.goApp',{app:t('ui.'+step.app)})}</Button></div></section>;}
 return <section className={'app-context context-'+app}>
 <header className="evidence-shelf"><div><small>{t('shelf.saved')}</small><h3>{t('shelf.'+app)}</h3></div><div className="evidence-counts"><span>{t('shelf.notes',{count:notes.length})}</span><span>{t('shelf.records',{count:records.length})}</span>{app==='ide'&&<span>{t('shelf.fragments',{count:sources.length})}</span>}</div>{(notes.length>0||records.length>0||sources.length>0||app==='chat'&&completed.length>0)&&<label><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('shelf.search')} aria-label={t('shelf.search')}/>{query&&<button onClick={()=>setQuery('')} aria-label={t('shelf.clear')}>×</button>}</label>}</header>
 {noMatches&&<p className="evidence-no-match">{t('shelf.noMatch')}</p>}

 {app==='ide'?<div className="context-editor"><aside><h3><FolderOpen size={16}/>{t('appContext.structure')}</h3>{relevant.map(s=><div key={s.id} className={s.id===step.id?'selected':''}><FileCode2 size={15}/><span>{t(s.titleKey)}</span></div>)}</aside><div className="context-editor-pane"><div className="context-toolbar"><FileCode2 size={16}/>{t('appContext.source')}</div>{sources.length?<><div className="evidence-source-tabs" role="group" aria-label={t('shelf.fragmentsTitle')}>{visibleSources.map(({index:i})=><button key={i} aria-pressed={displayedSource?.index===i} onClick={()=>setSourceIndex(i)}><FileCode2 size={14}/>{t('shelf.fragment',{number:i+1})}</button>)}</div>{displayedSource&&<Code text={displayedSource.code}/>}</>:<div className="context-empty"><AppIllustration app="ide"/><h3>{t('appContext.noSource')}</h3><p>{t('appContext.noSourceHint')}</p></div>}{recordList}{observationList}</div></div>
 :app==='console'?<div className="context-terminal"><div className="context-toolbar"><Terminal size={17}/>{t('appContext.journal')}<span>{notes.length+records.length}</span></div><div className="context-terminal-title">{t(template.titleKey)}</div>{empty?<div className="context-empty"><AppIllustration app="console"/><h3>{t('appContext.noLogs')}</h3><p>{t('appContext.noLogsHint')}</p></div>:<>{visibleSources.map(({code,index})=><Code key={index} text={code}/>)}{observationList}{recordList}</>}</div>
 :app==='browser'?<div className="context-browser"><div className="context-toolbar"><Globe size={17}/><span>{t('appContext.preview')}</span></div><div className="context-address"><Search size={15}/>{t(template.titleKey)}</div><div className="context-browser-canvas">{empty?<div className="context-empty"><AppIllustration app="browser"/><h3>{t('appContext.noPreview')}</h3><p>{t('appContext.noPreviewHint')}</p></div>:<>{recordList}{observationList}</>}</div></div>
 :<div className="context-chat"><header><MessageSquare size={22}/><div><h3>{t('appContext.thread')}</h3><p>{t(template.titleKey)}</p></div></header>{visibleMessages.map(s=><article className="context-message" key={s.id}><small>{t(s.titleKey)}</small><p><TermText>{t(s.bodyKey)}</TermText></p></article>)}{observationList}{recordList}{empty&&completed.length===0&&<div className="context-empty"><AppIllustration app="chat"/><h3>{t('appContext.noMessages')}</h3><p>{t('appContext.noMessagesHint')}</p></div>}</div>}
 <div className="context-next"><ArrowUpRight size={20}/><p>{t(task.rewarded?'ui.readOnly':'artifact.contextHint',{app:t('ui.'+step.app)})}</p><Button onClick={onContinue}>{t(task.rewarded?'desk.back':'ui.goApp',{app:t('ui.'+step.app)})}</Button></div>
 </section>;
}
