import {Search,MessagesSquare,FileCode2,ArrowRight,Clock3,CheckCircle2} from 'lucide-react';
import './taskScenes.css';
import {ActionDock} from './ActionDock';
import '../content/workspaceUx';
import {WorkArtifact} from './WorkArtifact';
import {useI18n} from '../content/localization';
import {useWorld} from '../world/store';
import {availableTechnicalActions} from '../world/technicalActions';
import type {Step,StepProgress} from '../world/types';
import {Button,Code} from './shared';
import {TermText} from './TermText';

export function TechnicalScene({step,progress,readOnly}:{step:Step;progress:StepProgress;readOnly:boolean}){
 const {t}=useI18n(),dispatch=useWorld(s=>s.dispatch),history=(progress.actionHistory??[]).map(id=>step.actionFlow!.actions.find(a=>a.id===id)).filter(a=>!!a);
 const available=availableTechnicalActions(step,progress);
 return <div className="technical-scene">{step.code&&<Code text={step.code}/>}{progress.dependency&&!progress.dependency.ready&&!readOnly&&<><p>{t('story.waiting')}</p><ActionDock><Button secondary onClick={()=>dispatch({type:'pause-task'})}>{t('story.pause')}</Button></ActionDock></>}
  {history.length>0&&<div className="technical-observations" aria-label={t('action.observed')}><small>{t('action.observed')}</small>{history.length>1&&<details className="observation-history"><summary>{t('workspace.history',{count:history.length-1})}</summary>{history.slice(0,-1).map(action=><article key={action.id}><b><TermText>{t(action.labelKey)}</TermText></b><p><TermText>{t(progress.observations?.[action.id]??action.observationKey)}</TermText></p>{action.artifact&&<details><summary>{t(action.artifact.titleKey)}</summary><WorkArtifact action={action} progress={progress} readOnly/></details>}</article>)}</details>}{history.slice(-1).map(action=><article key={action.id} className="latest-observation" aria-live="polite"><b><TermText>{t(action.labelKey)}</TermText></b><p><TermText>{t(progress.observations?.[action.id]??action.observationKey)}</TermText></p>{action.artifact&&<details><summary>{t(action.artifact.titleKey)}</summary><WorkArtifact action={action} progress={progress} readOnly/></details>}{action.code&&<Code text={action.code}/>}</article>)}</div>}
  {!readOnly&&progress.status!=='completed'&&<ActionDock active={available.length>0&&available.length<=2&&available.every(action=>!action.artifact)}><div className="technical-actions"><small>{t('action.next')}</small>{available.map(action=>action.artifact?(available.length===1?<WorkArtifact key={action.id} action={action} progress={progress}/>:<details key={action.id} className="artifact-action-option"><summary><span>{t(action.labelKey)}</span><small>{t('action.minutes',{minutes:action.minutes})}</small></summary><WorkArtifact action={action} progress={progress}/></details>):<button key={action.id} className="scene-action" data-action-kind={action.dependency?"dependency":action.code?"code":action.completes?"result":"explore"} onClick={()=>dispatch({type:'technical-action',id:action.id})}><span className="scene-action-icon" aria-hidden="true">{action.dependency?<MessagesSquare size={22}/>:action.code?<FileCode2 size={22}/>:action.completes?<CheckCircle2 size={22}/>:<Search size={22}/>}</span><span className="scene-action-label">{t(action.labelKey)}<small><Clock3 size={12}/>{t('action.minutes',{minutes:action.minutes})}</small></span><ArrowRight size={17} aria-hidden="true"/></button>)}</div></ActionDock>}
 </div>;
}
