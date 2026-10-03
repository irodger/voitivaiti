import {useI18n} from '../content/localization';
import {useWorld} from '../world/store';
import {TermText} from './TermText';
import type {StepProgress,TechnicalAction} from '../world/types';
import '../content/workArtifacts';
import './workArtifact.css';
export function WorkArtifact({action,progress,readOnly=false}:{action:TechnicalAction;progress:StepProgress;readOnly?:boolean}){
 const {t}=useI18n(),dispatch=useWorld(s=>s.dispatch),artifact=action.artifact!,seen=progress.artifactReadings?.[action.id]??[];
 const complete=artifact.rows.filter(row=>!row.optional).every(row=>seen.includes(row.id));
 return <section className={'work-artifact artifact-'+artifact.kind} aria-label={t(artifact.titleKey)}>
 <header><small>{t('artifact.open')}</small><h3>{t(artifact.titleKey)}</h3><p>{t(artifact.promptKey)}</p></header>
 <div className="artifact-records">{artifact.rows.map(row=><article key={row.id}>
 <button type="button" aria-expanded={seen.includes(row.id)} disabled={readOnly} onClick={()=>dispatch({type:'artifact-inspect',actionId:action.id,rowId:row.id})}><span>{t(row.labelKey)}</span><span>{seen.includes(row.id)?'\u2713':t('artifact.read')}</span></button>
 {seen.includes(row.id)&&<div className="artifact-data"><TermText>{t(row.detailKey)}</TermText></div>}
 </article>)}</div>
 {!readOnly&&complete&&<button className="artifact-compare" onClick={()=>dispatch({type:'artifact-compare',id:action.id})}>{t('artifact.continue')} · {t('action.minutes',{minutes:action.minutes})} &rarr;</button>}
 </section>;
}
