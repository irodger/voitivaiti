import {Trophy} from 'lucide-react';
import '../content/premiumStages';
import './stageJourney.css';
import {ActionDock} from './ActionDock';
import {resolveTaskTemplate} from '../content/scenarios';
import {PerspectivePanel} from './PerspectivePanel';
import '../content/corrections';
import {useWorld} from '../world/store';
import {activeTask} from '../world/simulation';
import {useI18n} from '../content/localization';
import {decisionFeedback} from './decisionFeedback';
import {TermText} from './TermText';
import {Button} from './shared';

export function TaskResult({onClose,closeLabel='result.close'}:{onClose:()=>void;closeLabel?:string}){
 const w=useWorld(),task=activeTask(w),{t}=useI18n();
 if(!task)return null;
 const template=resolveTaskTemplate(task);
 const choiceStep=template.steps.find(step=>step.type!=='review'&&step.options?.some(option=>option.id===task.progress[step.id]?.choiceId));
 const choice=choiceStep?.options?.find(option=>option.id===task.progress[choiceStep.id].choiceId);
 const evidence=template.steps.find(step=>step.items&&step.resolution==='consequential');
 const delta=task.taskElapsedMinutes-template.estimate;
 if(w.perspective)return <section className="task-result"><small>{t('mastery.episodeTitle')}</small><h2>{t(template.titleKey)}</h2><PerspectivePanel/></section>;
 return <section className="task-result">
  <header className="premium-result-hero"><Trophy size={34}/><div><small>{t('premiumStage.delivered')}</small><h2>{t(template.titleKey)}</h2><p>{t(task.outcome?.kind==='temporary'?'premiumStage.temporary':task.outcome?.systemChanged===true?'premiumStage.system':'premiumStage.evidence')}</p></div></header>
  {task.outcome?<div className="result-outcome"><h3>{t('result.approach')}</h3><p><TermText>{t(task.outcome.summaryKey)}</TermText></p></div>:choice&&choiceStep?<div className="result-outcome"><h3>{t('result.approach')}</h3><p>{t(choice.labelKey)}</p><p>{choice.responseKey==='decision.committed'?decisionFeedback(choiceStep,task.progress[choiceStep.id],t):t(choice.responseKey)}</p></div>:<p>{t('result.finished')}</p>}
  {evidence&&<div className="result-outcome"><h3>{t('result.scope')}</h3><p>{decisionFeedback(evidence,task.progress[evidence.id],t)}</p></div>}
  <div className="time-comparison"><div><small>{t('ui.estimate')}</small><b>{t('ui.min',{value:template.estimate})}</b></div><div><small>{t('ui.timeActual')}</small><b>{t('ui.min',{value:task.taskElapsedMinutes})}</b></div></div>
  <p>{t(delta>0?'result.over':delta<0?'result.under':'result.onTime',{minutes:Math.abs(delta)})}</p>
  <PerspectivePanel/>
  <ActionDock><Button onClick={()=>{if(w.perspective)w.dispatch({type:'perspective-action',id:'close'});onClose();}}>{t(closeLabel)}</Button></ActionDock>
 </section>;
}
