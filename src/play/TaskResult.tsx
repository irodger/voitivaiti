import { CheckCheck,Clock3,Coffee,Flag } from 'lucide-react';
import '../content/corrections';
import '../content/premiumStages';
import '../content/resultReceipt';
import '../content/workClock';
import { ActionDock } from './ActionDock';
import { decisionFeedback } from './decisionFeedback';
import { PerspectivePanel } from './PerspectivePanel';
import { ResultMaterials } from './ResultMaterials';
import './resultReceipt.css';
import { Button } from './shared';
import './stageJourney.css';
import { TermText } from './TermText';
import { useTaskResult } from './useTaskResult';

export function TaskResult({onClose,closeLabel='result.close'}:{onClose:()=>void;closeLabel?:string}){
const model=useTaskResult();if(!model)return null;const {w,task,t,template,choiceStep,choice,evidence,resultKind,ResultIcon,completed,delta}=model;

 if(w.perspective)return <section className="task-result"><small>{t('mastery.episodeTitle')}</small><h2>{t(template.titleKey)}</h2><PerspectivePanel/></section>;
 return <section className="task-result">
  <header className="premium-result-hero result-receipt-hero" data-result={resultKind}><ResultIcon size={34}/><div><small><CheckCheck size={14}/>{t('premiumStage.delivered')}</small><h2>{t(template.titleKey)}</h2><p>{t(task.outcome?.kind==='temporary'?'premiumStage.temporary':task.outcome?.systemChanged===true?'premiumStage.system':'premiumStage.evidence')}</p></div></header>
  {task.outcome?<div className="result-outcome"><h3>{t('result.approach')}</h3><p><TermText>{t(task.outcome.summaryKey)}</TermText></p></div>:choice&&choiceStep?<div className="result-outcome"><h3>{t('result.approach')}</h3><p>{t(choice.labelKey)}</p><p>{choice.responseKey==='decision.committed'?decisionFeedback(choiceStep,task.progress[choiceStep.id],t):t(choice.responseKey)}</p></div>:<p>{t('result.finished')}</p>}
  {evidence&&<div className="result-outcome"><h3>{t('result.scope')}</h3><p>{decisionFeedback(evidence,task.progress[evidence.id],t)}</p></div>}
  <div className="result-receipt-stats"><div><Flag size={18}/><small>{t('ui.estimate')}</small><b>{t('ui.min',{value:template.estimate})}</b></div><div><Clock3 size={18}/><small>{t('workClock.spent')}</small><b>{t('ui.min',{value:task.taskElapsedMinutes})}</b></div><div><CheckCheck size={18}/><small>{t('receipt.steps')}</small><b>{completed} / {template.steps.length}</b></div></div>
  <p>{t(delta>0?'result.over':delta<0?'result.under':'result.onTime',{minutes:Math.abs(delta)})}</p>
  <ResultMaterials task={task} steps={template.steps}/>
  <p className="result-office-note"><Coffee size={16}/>{t('receipt.joke.'+resultKind)}</p>
  <PerspectivePanel/>
  <ActionDock><Button onClick={()=>{if(w.perspective)w.dispatch({type:'perspective-action',id:'close'});onClose();}}>{t(closeLabel)}</Button></ActionDock>
 </section>;
}
