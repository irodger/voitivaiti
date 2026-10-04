import {FileCode2,FolderOpen,Terminal,Globe,MessageSquare,Search,ArrowUpRight} from 'lucide-react';
import {useI18n} from '../content/localization';
import {TermText} from './TermText';
import {Button,Code} from './shared';
import {ArtifactData} from './ArtifactData';
import {resolveTaskTemplate} from '../content/scenarios';
import type {AppId,Task} from '../world/types';
import '../content/workArtifacts';
import '../content/workspaceUx';
import './workArtifact.css';
import './appContext.css';
const kinds:Record<AppId,string[]>={ide:['code','component'],browser:['network','design','environment'],console:['metrics','logs'],chat:['task']};
export function AppContext({app,task,onContinue}:{app:AppId;task:Task;onContinue:()=>void}){
 const {t}=useI18n(),template=resolveTaskTemplate(task),step=template.steps.find(s=>s.id===task.currentStepId)!;
 const relevant=template.steps.filter(s=>s.app===app);
 const notes=relevant.flatMap(s=>[...Object.values(task.progress[s.id]?.observations??{}),...(s.items??[]).filter(item=>task.progress[s.id]?.draft?.includes(item.id)).map(item=>item.detailKey??item.labelKey)]);
 const sources=relevant.filter(s=>task.progress[s.id]?.status==='completed'&&!!s.code).map(s=>s.code!).concat(relevant.flatMap(s=>(task.progress[s.id]?.actionHistory??[]).map(id=>s.actionFlow?.actions.find(a=>a.id===id)?.code).filter((code):code is string=>!!code)));
 const records=template.steps.flatMap(s=>(s.actionFlow?.actions??[]).flatMap(a=>a.artifact&&kinds[app].includes(a.artifact.kind)?a.artifact.rows.filter(r=>task.progress[s.id]?.artifactReadings?.[a.id]?.includes(r.id)).map(row=>({row,kind:a.artifact!.kind,title:a.artifact!.titleKey})):[]));
 const completed=relevant.filter(s=>task.progress[s.id]?.status==='completed');
 const empty=notes.length===0&&records.length===0&&sources.length===0;
 const recordList=<div className="context-records">{records.map(({row,kind,title},i)=><article key={i}><small>{t(title)}</small><h3>{t(row.labelKey)}</h3><ArtifactData row={row} kind={kind}/></article>)}</div>;
 const observationList=<div className="context-notes">{notes.map((key,i)=><article key={i}><span className="context-index">{String(i+1).padStart(2,'0')}</span><p><TermText>{t(key)}</TermText></p></article>)}</div>;
 return <section className={'app-context context-'+app}>
 {app==='ide'?<div className="context-editor"><aside><h3><FolderOpen size={16}/>{t('appContext.structure')}</h3>{relevant.map(s=><div key={s.id} className={s.id===step.id?'selected':''}><FileCode2 size={15}/><span>{t(s.titleKey)}</span></div>)}</aside><div className="context-editor-pane"><div className="context-toolbar"><FileCode2 size={16}/>{t('appContext.source')}</div>{sources.length?<Code text={sources.at(-1)!}/>:<div className="context-empty"><FileCode2 size={32}/><h3>{t('appContext.noSource')}</h3><p>{t('appContext.noSourceHint')}</p></div>}{recordList}{observationList}</div></div>
 :app==='console'?<div className="context-terminal"><div className="context-toolbar"><Terminal size={17}/>{t('appContext.journal')}<span>{notes.length+records.length}</span></div><div className="context-terminal-title">{t(template.titleKey)}</div>{empty?<div className="context-empty"><Terminal size={32}/><h3>{t('appContext.noLogs')}</h3><p>{t('appContext.noLogsHint')}</p></div>:<>{sources.map((code,i)=><Code key={i} text={code}/>)}{observationList}{recordList}</>}</div>
 :app==='browser'?<div className="context-browser"><div className="context-toolbar"><Globe size={17}/><span>{t('appContext.preview')}</span></div><div className="context-address"><Search size={15}/>{t(template.titleKey)}</div><div className="context-browser-canvas">{empty?<div className="context-empty"><Globe size={32}/><h3>{t('appContext.noPreview')}</h3><p>{t('appContext.noPreviewHint')}</p></div>:<>{recordList}{observationList}</>}</div></div>
 :<div className="context-chat"><header><MessageSquare size={22}/><div><h3>{t('appContext.thread')}</h3><p>{t(template.titleKey)}</p></div></header>{completed.map(s=><article className="context-message" key={s.id}><small>{t(s.titleKey)}</small><p><TermText>{t(s.bodyKey)}</TermText></p></article>)}{observationList}{recordList}{empty&&completed.length===0&&<div className="context-empty"><MessageSquare size={32}/><h3>{t('appContext.noMessages')}</h3><p>{t('appContext.noMessagesHint')}</p></div>}</div>}
 <div className="context-next"><ArrowUpRight size={20}/><p>{t(task.rewarded?'ui.readOnly':'artifact.contextHint',{app:t('ui.'+step.app)})}</p><Button onClick={onContinue}>{t(task.rewarded?'desk.back':'ui.goApp',{app:t('ui.'+step.app)})}</Button></div>
 </section>;
}
