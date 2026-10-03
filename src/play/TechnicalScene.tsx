import {useI18n} from '../content/localization';
import {useWorld} from '../world/store';
import {availableTechnicalActions} from '../world/technicalActions';
import type {Step,StepProgress} from '../world/types';
import {Button,Code} from './shared';
import {TermText} from './TermText';

export function TechnicalScene({step,progress,readOnly}:{step:Step;progress:StepProgress;readOnly:boolean}){
 const {t}=useI18n(),dispatch=useWorld(s=>s.dispatch),history=(progress.actionHistory??[]).map(id=>step.actionFlow!.actions.find(a=>a.id===id)).filter(a=>!!a);
 return <div className="technical-scene">{step.code&&<Code text={step.code}/>}{progress.dependency&&!progress.dependency.ready&&!readOnly&&<><p>{t('story.waiting')}</p><Button secondary onClick={()=>dispatch({type:'pause-task'})}>{t('story.pause')}</Button></>}
  {history.length>0&&<div className="technical-observations" aria-label={t('action.observed')}><small>{t('action.observed')}</small>{history.map((action,i)=><article key={action.id} className={i===history.length-1?'latest-observation':''} aria-live={i===history.length-1?'polite':undefined}><b><TermText>{t(action.labelKey)}</TermText></b><p><TermText>{t(progress.observations?.[action.id]??action.observationKey)}</TermText></p>{action.code&&i===history.length-1&&<Code text={action.code}/>}</article>)}</div>}
  {!readOnly&&progress.status!=='completed'&&<div className="technical-actions"><small>{t('action.next')}</small>{availableTechnicalActions(step,progress).map(action=><button key={action.id} onClick={()=>dispatch({type:'technical-action',id:action.id})}><span>{t(action.labelKey)}</span><small>{t('action.minutes',{minutes:action.minutes})}</small></button>)}</div>}
 </div>;
}
