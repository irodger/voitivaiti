import '../content/workArtifacts';
import '../content/workspaceUx';
import type { StepProgress,TechnicalAction } from '../world/types';
import { ActionDock } from './ActionDock';
import { ArtifactData } from './ArtifactData';
import { useWorkArtifact } from './useWorkArtifact';
import './workArtifact.css';
export function WorkArtifact({action,progress,readOnly=false}:{action:TechnicalAction;progress:StepProgress;readOnly?:boolean}){
const {t,dispatch,artifact,seen,ArtifactIcon,required,inspected,complete,conditions,current}=useWorkArtifact({action,progress});

 return <section className={'work-artifact artifact-'+artifact.kind} aria-label={t(artifact.titleKey)}>
 <header><span className="artifact-emblem" aria-hidden="true"><ArtifactIcon size={22}/></span><div><small>{t('artifact.open')}</small><h3>{t(artifact.titleKey)}</h3><p>{t(artifact.promptKey)}</p></div></header>
 {!readOnly&&<div className="artifact-progress" role="status"><progress value={inspected} max={Math.max(1,required.length)} aria-label={t('workspace.records',{done:inspected,total:required.length})}/><span>{t('workspace.records',{done:inspected,total:required.length})}</span></div>}
 {artifact.experiment&&!readOnly&&<div className="artifact-experiment">
 <div className="experiment-conditions" role="group" aria-label={t(artifact.titleKey)}>{conditions.map(row=><button key={row.id} aria-pressed={current.id===row.id} onClick={()=>dispatch({type:'artifact-condition',actionId:action.id,rowId:row.id})}>{t(row.labelKey)}{seen.includes(row.id)&&' ✓'}</button>)}</div>
 <button className="experiment-run" onClick={()=>dispatch({type:'artifact-inspect',actionId:action.id,rowId:current.id})}>{t('artifact.experiment.run')}</button>
 <div className="experiment-output" role="status">{seen.includes(current.id)?<ArtifactData row={current} kind={artifact.kind}/>:t('artifact.experiment.empty')}</div>
 </div>}
 {artifact.experiment&&conditions.some(row=>seen.includes(row.id)&&(readOnly||row.id!==current.id))&&<h4 className="experiment-results-label">{t('artifact.experiment.results')}</h4>}
 {readOnly?<div className="artifact-records artifact-archive">{artifact.rows.filter(row=>seen.includes(row.id)).map(row=><details key={row.id}><summary>{t(row.labelKey)}<span aria-hidden="true">✓</span></summary><div className="artifact-data"><ArtifactData row={row} kind={artifact.kind}/></div></details>)}</div>:<div className="artifact-records">{artifact.rows.filter(row=>!artifact.experiment||row.optional||(seen.includes(row.id)&&(readOnly||row.id!==current.id))).map(row=><article key={row.id}>
 {artifact.experiment&&!row.optional?<h4 className="experiment-record-title">{t(row.labelKey)}</h4>:
 <button type="button" aria-expanded={seen.includes(row.id)} disabled={readOnly} onClick={()=>dispatch({type:'artifact-inspect',actionId:action.id,rowId:row.id})}><span>{t(row.labelKey)}</span><span>{seen.includes(row.id)?'\u2713':t('artifact.read')}</span></button>
 }
 {seen.includes(row.id)&&<div className="artifact-data"><ArtifactData row={row} kind={artifact.kind}/></div>}
 </article>)}</div>}
 {!readOnly&&<ActionDock active={complete}><footer className="artifact-footer"><p>{t(complete?'workspace.ready':'workspace.remaining',{count:required.length-inspected})}</p><button className="artifact-compare" disabled={!complete} onClick={()=>dispatch({type:'artifact-compare',id:action.id})}>{t('artifact.continue')} · {t('action.minutes',{minutes:action.minutes})} &rarr;</button></footer></ActionDock>}
 </section>;
}
