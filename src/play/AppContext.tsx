import {Search,ArrowUpRight} from 'lucide-react';
import {useI18n} from '../content/localization';
import {useAppEvidence} from '../hooks/useAppEvidence';
import {useLaptopTools} from '../hooks/useLaptopTools';
import {Button} from './shared';
import {AppIllustration} from './AppIllustration';
import {EvidenceEditor,EvidenceConsole,EvidenceBrowser,EvidenceChat} from './AppEvidencePanels';
import type {AppId,Task} from '../world/types';
import '../content/evidenceShelf';
import '../content/workArtifacts';
import '../content/workspaceUx';
import './evidenceShelf.css';
import './workArtifact.css';
import './appContext.css';

const panels={ide:EvidenceEditor,console:EvidenceConsole,browser:EvidenceBrowser,chat:EvidenceChat};
const emptyLabels={ide:['noSource','noSourceHint'],console:['noLogs','noLogsHint'],browser:['noPreview','noPreviewHint'],chat:['noMessages','noMessagesHint']};
/** Shared evidence shell; each application owns its own presentation. */
export function AppContext({app,task,onContinue}:{app:AppId;task:Task;onContinue:()=>void}){
 const {t}=useI18n(),tools=useLaptopTools(),model=useAppEvidence(task,app,tools.editorKind),Panel=panels[app];
 const workApp=tools.name(model.step.app),materialEditor=app==='ide'&&tools.editorKind!=='code';
 const returnLabel=t(task.rewarded?'desk.back':'ui.goApp',{app:workApp});
 if(!model.hasEvidence){
  const material=tools.editorKind!=='code'&&(app==='ide'||app==='console');
  const [title,hint]=emptyLabels[app];
  return <section className={'app-context context-'+app+' context-empty-reference'}><div className="context-empty">
   <AppIllustration app={app} editorKind={tools.editorKind}/><h3>{t(material?'tool.empty':'appContext.'+title)}</h3><p>{t(material?'tool.emptyHint':'appContext.'+hint)}</p>
   <Button onClick={onContinue}>{returnLabel}</Button>
  </div></section>;
 }
 return <section className={'app-context context-'+app}>
  <header className="evidence-shelf"><div><small>{t('shelf.saved')}</small><h3>{materialEditor?tools.name(app):t('shelf.'+app)}</h3></div>
   <div className="evidence-counts"><span>{t('shelf.notes',{count:model.notes.length})}</span><span>{t('shelf.records',{count:model.records.length})}</span>{app==='ide'&&(tools.editorKind==='code'||model.sources.length>0)&&<span>{t('shelf.fragments',{count:model.sources.length})}</span>}</div>
   <label><Search size={15}/><input value={model.query} onChange={e=>model.setQuery(e.target.value)} placeholder={t('shelf.search')} aria-label={t('shelf.search')}/>{model.query&&<button onClick={()=>model.setQuery('')} aria-label={t('shelf.clear')}>×</button>}</label>
  </header>
  {model.noMatches&&<p className="evidence-no-match">{t('shelf.noMatch')}</p>}
  <Panel model={model}/>
  <div className="context-next"><ArrowUpRight size={20}/><p>{t(task.rewarded?'ui.readOnly':'artifact.contextHint',{app:workApp})}</p><Button onClick={onContinue}>{returnLabel}</Button></div>
 </section>;
}
