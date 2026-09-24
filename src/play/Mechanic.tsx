import {decisionFeedback} from './decisionFeedback';
import {TechnicalScene} from './TechnicalScene';
import '../content/corrections';
import {DecisionHelp} from './DecisionHelp';
import { TermText } from './TermText';
import { isConsequential } from '../world/decisions';
import { useEffect } from 'react';
import { Check,ArrowRight,GripVertical,FileCode,Search,Terminal } from 'lucide-react';
import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import { activeTask } from '../world/simulation';
import { templateById } from '../content/scenarios';
import { Button,Code,Speech } from './shared';
import type { Step,StepProgress } from '../world/types';
import { VisualPreview,MetricChart,DependencyGraph } from './VisualMechanics';
export function StepRenderer({step,readOnly=false,viewProgress}:{step:Step;readOnly?:boolean;viewProgress?:StepProgress}){const world=useWorld(),{t}=useI18n(),task=activeTask(world)!,p=viewProgress??task.progress[step.id],done=p.status==='completed',disabled=readOnly||done;
 useEffect(()=>{if(readOnly||p.run!=='running')return;const timer=setTimeout(()=>useWorld.getState().dispatch({type:'finish-run',taskId:task.id,stepId:step.id}),step.type==='terminal'?1700:1200);return()=>clearTimeout(timer);},[p.run,readOnly,task.id,step.id,step.type]);
 const consequential=isConsequential(step);
 const response=p.responseKey==='decision.committed'?decisionFeedback(step,p,t):t(p.responseKey??'ui.success');
 const ordered=['planning','incident-response'].includes(step.type),allocation=step.type==='resource-allocation';
 const items=ordered&&p.draft.length?[...p.draft.map(id=>step.items!.find(i=>i.id===id)!),...step.items!.filter(i=>!p.draft.includes(i.id))]:step.items;
 return <section className={`mechanic mechanic-${step.type}`}><div className="step-label">{t('ui.step',{step:templateById[task.templateId].steps.indexOf(step)+1,total:templateById[task.templateId].steps.length})}<span>{t('ui.min',{value:task.taskElapsedMinutes})}</span></div><h2>{t(step.titleKey)}</h2>{step.type==='search'?<div className="search-input"><Search size={18}/>{t(step.bodyKey)}</div>:<p className="mechanic-brief"><TermText>{t(step.type==='review'?'fix.ready':step.bodyKey)}</TermText></p>}
 {consequential&&<DecisionHelp/>}
 {step.type==='file-browser'&&<div className="file-path">src / pages / Home</div>}
 {step.preview&&<VisualPreview kind={step.preview} done={done}/>}
 {step.items?.some(i=>i.before!==undefined)&&<MetricChart items={step.items}/>}
 {step.items&&['dependency-map','architecture-diagram'].includes(step.type)&&<DependencyGraph items={step.items} selected={p.draft} disabled={disabled} toggle={id=>world.dispatch({type:'draft',id})}/>}
 {!step.actionFlow&&(step.code||done&&step.resultCode)&&!['terminal','console'].includes(step.type)&&<Code text={done&&step.resultCode?step.resultCode:step.code!}/>}
 {step.type==='visual-compare'&&!step.items&&<div className="world-compare"><div><small>{t('ui.desktopPreview')}</small><div className="compare-site"><div>almost.ready</div><h3>{t('ui.previewHeading')}</h3><i/><i/></div></div><div><small>{t('ui.mobilePreview')}</small><div className={`compare-site phone ${done?'fixed':''}`}><div>almost.ready</div><h3>{t('ui.previewHeading')}</h3><i/><small>{t(done?'ui.previewGood':'ui.previewBad')}</small></div></div></div>}
 {step.type==='bug-reproduction'&&<div className="reproduce-mock"><div className="mock-app-bar"><span>● ● ●</span> almost.ready</div><span className="mock-spark">✦</span><p className={`hint ${p.clicks?'removed':''}`}>{p.clicks?'—':t('ui.hint')}</p><button className="mock-button" disabled={disabled} onClick={()=>world.dispatch({type:'click'})}>{t('ui.hintButton')}</button><div className={`click-status ${p.clicks===2&&!step.fixed?'bad':''}`} aria-live="polite">{t(p.clicks===0?'ui.twoClicks':p.clicks===1?'ui.firstClick':step.fixed?'ui.verified':'ui.reproduced')}</div><div className="click-dots"><i className={p.clicks>0?'lit':''}/><i className={p.clicks>1?'lit':''}/></div></div>}
 {['terminal','console','review'].includes(step.type)&&<>{p.run==='idle'?<Button disabled={readOnly} onClick={()=>world.dispatch({type:'run'})}>{t(step.type==='review'?'ui.sendReview':step.type==='console'?'ui.inspect':'ui.run')}</Button>:p.run==='running'?<div className="review-wait"><span className="spinner"/>{t(step.type==='review'?'ui.reviewWaiting':'ui.running')}</div>:step.type==='review'?<Speech speaker={step.speaker??task.legacyActorId??templateById[task.templateId].author}>{t(step.bodyKey)}</Speech>:<Code text={step.code??'✓ Checks passed'} error={step.type==='console'}/>}</>}
 {items&&<><p className="mechanic-instruction">{t(allocation?'ui.allocationHelp':ordered?'ui.planHelp':consequential?'fix.observations':'ui.selectHelp',{budget:step.budget??0})}</p><div className={`evidence-grid ${['dependency-map','architecture-diagram'].includes(step.type)?'dependency-nodes':''} ${step.type==='visual-compare'?'visual-options':''}`}>{items.map(item=><div className={`evidence-row ${p.draft.includes(item.id)?'selected':''}`} key={item.id}>{allocation?<><label htmlFor={`allocation-${item.id}`}>{t(item.labelKey)}</label><input id={`allocation-${item.id}`} type="number" min="0" max={step.budget} value={p.allocation[item.id]??0} disabled={disabled} onChange={e=>world.dispatch({type:'allocate',id:item.id,value:Number(e.target.value)})} aria-label={t('ui.amount',{item:t(item.labelKey)})}/></>:<button disabled={disabled} onClick={()=>world.dispatch({type:'draft',id:item.id})} aria-pressed={p.draft.includes(item.id)}>{ordered?<span className="order-number">{p.draft.includes(item.id)?p.draft.indexOf(item.id)+1:<GripVertical size={16}/>}</span>:<span className="evidence-check">{p.draft.includes(item.id)&&<Check size={15}/>}</span>}<span>{t(item.labelKey)}</span>{['dependency-map','architecture-diagram'].includes(step.type)&&<ArrowRight size={18}/>}</button>}</div>)}</div>{allocation&&<p className="allocation-count">{t('ui.allocated',{used:Object.values(p.allocation).reduce((a,b)=>a+b,0),budget:step.budget??0})}</p>}{!disabled&&<Button onClick={()=>world.dispatch({type:'submit'})}>{t(consequential?'fix.accept':'ui.submitPlan')}</Button>}</>}
 {step.actionFlow&&<TechnicalScene step={step} progress={p} readOnly={readOnly}/> }
 {step.options&&(step.type!=='review'||p.run==='done')&&<div className={`choices ${step.type==='file-browser'?'file-choices':''}`}>{step.options.map((o,i)=><button key={o.id} disabled={disabled} className={`choice ${p.choiceId===o.id?(consequential?'decision-selected':done?'chosen':'incorrect'):''}`} onClick={()=>world.dispatch({type:'choose',id:o.id})}>{step.type==='file-browser'?<FileCode size={17}/>:<span className="choice-index">{!consequential&&done&&p.choiceId===o.id?<Check size={14}/>:i+1}</span>}<span><b>{t(o.labelKey)}</b>{o.detailKey&&<small>{t(o.detailKey)}</small>}</span><ArrowRight className="choice-arrow" size={15}/></button>)}</div>}
 {!step.actionFlow&&p.responseKey&&<div className={`response ${consequential?'decision-response':done?'success':'retry'}`} role="status">{!consequential&&<Check size={17}/>}<div>{consequential&&!done?t('decision.pending'):response}{!done&&!consequential&&<small>{t('ui.retry',{minutes:step.wrongMinutes})}</small>}</div></div>}
 {!step.actionFlow&&done&&step.type==='visual-compare'&&step.resultCode&&<Code text={step.resultCode}/>}
 {done&&!readOnly&&<Button onClick={()=>world.dispatch({type:'advance'})}>{t(templateById[task.templateId].steps.at(-1)?.id===step.id?'ui.closeTask':'ui.continue')}</Button>}
 {step.type==='terminal'&&p.run==='done'&&<p className="auto-next"><Terminal size={14}/>{t('ui.testsPassed')}</p>}
 </section>;
}

