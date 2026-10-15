import {StepIntroduction} from './StepIntroduction';
import {ActionDock} from './ActionDock';
import {resolveTaskTemplate} from '../content/scenarios';
import {decisionFeedback} from './decisionFeedback';
import {TechnicalScene} from './TechnicalScene';
import '../content/corrections';
import {DecisionHelp} from './DecisionHelp';
import { isConsequential } from '../world/decisions';
import {useStepExecution} from '../hooks/useStepExecution';
import {StepItems} from './StepItems';
import {StepOptions} from './StepOptions';
import { Check,Terminal } from 'lucide-react';
import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import { activeTask } from '../world/simulation';
import { Button,Code,Speech } from './shared';
import type { Step,StepProgress } from '../world/types';
import { VisualPreview,MetricChart,DependencyGraph } from './VisualMechanics';
export function StepRenderer({step,readOnly=false,viewProgress}:{step:Step;readOnly?:boolean;viewProgress?:StepProgress}){const world=useWorld(),{t}=useI18n(),task=activeTask(world)!,p=viewProgress??task?.progress[step.id],done=p?.status==='completed',disabled=readOnly||done;
 useStepExecution(task?.id,step,p?.run,readOnly);
 if(!task||!p)return null;
 const template=resolveTaskTemplate(task);
 const consequential=isConsequential(step);
 const response=p.responseKey==='decision.committed'?decisionFeedback(step,p,t):t(p.responseKey??'ui.success');

 return <section data-step-id={step.id} className={`mechanic mechanic-${step.type}`}><StepIntroduction task={task} step={step} template={template}/>
 {consequential&&!disabled&&p.run!=='running'&&step.type!=='review'&&((step.options?.length??0)>1||(step.items?.length??0)>1)&&<DecisionHelp/>}
 {step.type==='file-browser'&&<div className="file-path">src / pages / Home</div>}
 {step.preview&&<VisualPreview kind={step.preview} done={done}/>}
 {step.items?.some(i=>i.before!==undefined)&&<MetricChart items={step.items}/>}
 {step.items&&['dependency-map','architecture-diagram'].includes(step.type)&&<DependencyGraph items={step.items} selected={p.draft} disabled={disabled} toggle={id=>world.dispatch({type:'draft',id})}/>}
 {!step.actionFlow&&(step.code||done&&step.resultCode)&&!['terminal','console'].includes(step.type)&&<Code text={done&&step.resultCode?step.resultCode:step.code!}/>}
 {step.type==='visual-compare'&&!step.items&&<div className="world-compare"><div><small>{t('ui.desktopPreview')}</small><div className="compare-site"><div>almost.ready</div><h3>{t('ui.previewHeading')}</h3><i/><i/></div></div><div><small>{t('ui.mobilePreview')}</small><div className={`compare-site phone ${done?'fixed':''}`}><div>almost.ready</div><h3>{t('ui.previewHeading')}</h3><i/><small>{t(done?'ui.previewGood':'ui.previewBad')}</small></div></div></div>}
 {step.type==='bug-reproduction'&&<div className="reproduce-mock"><div className="mock-app-bar"><span>● ● ●</span> almost.ready</div><span className="mock-spark">✦</span><p className={`hint ${p.clicks?'removed':''}`}>{p.clicks?'—':t('ui.hint')}</p><button className="mock-button" disabled={disabled} onClick={()=>world.dispatch({type:'click'})}>{t('ui.hintButton')}</button><div className={`click-status ${p.clicks===2&&!step.fixed?'bad':''}`} aria-live="polite">{t(p.clicks===0?'ui.twoClicks':p.clicks===1?'ui.firstClick':step.fixed?'ui.verified':'ui.reproduced')}</div><div className="click-dots"><i className={p.clicks>0?'lit':''}/><i className={p.clicks>1?'lit':''}/></div></div>}
 {['terminal','console','review'].includes(step.type)&&<>{p.run==='idle'?<ActionDock active={!readOnly}><Button disabled={readOnly} onClick={()=>world.dispatch({type:'run'})}>{t(step.type==='review'?'ui.sendReview':step.type==='console'?'ui.inspect':'ui.run')}</Button></ActionDock>:p.run==='running'?<div className="review-wait"><span className="spinner"/>{t(step.type==='review'?'ui.reviewWaiting':'ui.running')}</div>:step.type==='review'?<Speech speaker={step.speaker??task.legacyActorId??template.author}>{t(step.bodyKey)}</Speech>:<Code text={step.code??'✓ Checks passed'} error={step.type==='console'}/>}</>}
 {step.items&&<StepItems step={step} progress={p} disabled={disabled} consequential={consequential}/>}
 {step.actionFlow&&<TechnicalScene step={step} progress={p} readOnly={readOnly}/> }
 {step.options&&<StepOptions step={step} progress={p} disabled={disabled} consequential={consequential}/>}
 {!step.actionFlow&&p.responseKey&&<div className={`response ${consequential?'decision-response':done?'success':'retry'}`} role="status">{!consequential&&<Check size={17}/>}<div>{consequential&&!done?t('decision.pending'):response}{!done&&!consequential&&<small>{t('ui.retry',{minutes:step.wrongMinutes})}</small>}</div></div>}
 {!step.actionFlow&&done&&step.type==='visual-compare'&&step.resultCode&&<Code text={step.resultCode}/>}
 {done&&!readOnly&&<ActionDock><Button onClick={()=>world.dispatch({type:'advance'})}>{t(template.steps.at(-1)?.id===step.id?'ui.closeTask':'ui.continue')}</Button></ActionDock>}
 {step.type==='terminal'&&p.run==='done'&&<p className="auto-next"><Terminal size={14}/>{t('ui.testsPassed')}</p>}
 </section>;
}

