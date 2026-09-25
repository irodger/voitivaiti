import '../content/corrections';
import {useWorld} from '../world/store';
import {activeTask} from '../world/simulation';
import {templateById} from '../content/scenarios';
import {useI18n} from '../content/localization';
import {decisionFeedback} from './decisionFeedback';
import {Button} from './shared';

export function TaskResult({onClose}:{onClose:()=>void}){
 const w=useWorld(),task=activeTask(w),{t}=useI18n();
 if(!task)return null;
 const template=templateById[task.templateId];
 const choiceStep=template.steps.find(step=>step.type!=='review'&&step.options?.some(option=>option.id===task.progress[step.id]?.choiceId));
 const choice=choiceStep?.options?.find(option=>option.id===task.progress[choiceStep.id].choiceId);
 const evidence=template.steps.find(step=>step.items&&step.resolution==='consequential');
 const delta=task.taskElapsedMinutes-template.estimate;
 return <section className="task-result">
  <small>{t('result.label')}</small><h2>{t(template.titleKey)}</h2>
  {choice&&choiceStep?<div className="result-outcome"><h3>{t('result.approach')}</h3><p>{t(choice.labelKey)}</p><p>{choice.responseKey==='decision.committed'?decisionFeedback(choiceStep,task.progress[choiceStep.id],t):t(choice.responseKey)}</p></div>:<p>{t('result.finished')}</p>}
  {evidence&&<div className="result-outcome"><h3>{t('result.scope')}</h3><p>{decisionFeedback(evidence,task.progress[evidence.id],t)}</p></div>}
  <div className="time-comparison"><div><small>{t('ui.estimate')}</small><b>{t('ui.min',{value:template.estimate})}</b></div><div><small>{t('ui.timeActual')}</small><b>{t('ui.min',{value:task.taskElapsedMinutes})}</b></div></div>
  <p>{t(delta>0?'result.over':delta<0?'result.under':'result.onTime',{minutes:Math.abs(delta)})}</p>
  <Button onClick={onClose}>{t('result.close')}</Button>
 </section>;
}
