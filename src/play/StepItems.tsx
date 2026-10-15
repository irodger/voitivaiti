import {Check,ArrowRight,GripVertical} from 'lucide-react';
import {isOrderedPlan,planOrder} from '../world/planOrder';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import type {Step,StepProgress} from '../world/types';
import {ActionDock} from './ActionDock';
import {Button} from './shared';

type Props={step:Step;progress:StepProgress;disabled:boolean;consequential:boolean};
/** Checklist, ordered plan and resource allocation share the same item layout. */
export function StepItems({step,progress,disabled,consequential}:Props){
 const dispatch=useWorld(s=>s.dispatch),{t}=useI18n();
 const done=progress.status==='completed',ordered=isOrderedPlan(step),allocation=step.type==='resource-allocation';
 const displayOrder=ordered&&!done?planOrder(step,progress.draft):progress.draft;
 const items=ordered&&displayOrder.length
  ?[...displayOrder.map(id=>step.items!.find(item=>item.id===id)!),...step.items!.filter(item=>!displayOrder.includes(item.id))]
  :step.items;
 if(!items)return null;
 const graph=['dependency-map','architecture-diagram'].includes(step.type);
 const instruction=allocation?'ui.allocationHelp':ordered?'plan.reorderHelp':consequential?'fix.observations':'ui.selectHelp';
 return <>
  <p className="mechanic-instruction">{t(instruction,{budget:step.budget??0})}</p>
  <div className={`evidence-grid ${graph?'dependency-nodes':''} ${step.type==='visual-compare'?'visual-options':''}`}>
   {items.map(item=><div className={`evidence-row ${!ordered&&progress.draft.includes(item.id)?'selected':''}`} key={item.id}>
    {allocation?<>
     <label htmlFor={`allocation-${item.id}`}>{t(item.labelKey)}</label>
     <input id={`allocation-${item.id}`} type="number" min="0" max={step.budget}
      value={progress.allocation[item.id]??0} disabled={disabled}
      onChange={e=>dispatch({type:'allocate',id:item.id,value:Number(e.target.value)})}
      aria-label={t('ui.amount',{item:t(item.labelKey)})}/>
    </>:<button disabled={disabled} onClick={()=>dispatch({type:'draft',id:item.id})}
     aria-label={ordered&&!disabled?t('plan.moveFirst',{item:t(item.labelKey)}):undefined}
     aria-pressed={ordered?undefined:progress.draft.includes(item.id)}>
     {ordered?<span className="order-number">
      {displayOrder.includes(item.id)?displayOrder.indexOf(item.id)+1:<GripVertical size={16}/>}
     </span>:<span className="evidence-check">{progress.draft.includes(item.id)&&<Check size={15}/>}</span>}
     <span>{t(item.labelKey)}</span>{graph&&<ArrowRight size={18}/>}
    </button>}
   </div>)}
  </div>
  {allocation&&<p className="allocation-count">{t('ui.allocated',{used:Object.values(progress.allocation).reduce((a,b)=>a+b,0),budget:step.budget??0})}</p>}
  {!disabled&&<ActionDock><Button onClick={()=>dispatch({type:'submit'})}>{t(ordered?'plan.confirm':consequential?'fix.accept':'ui.submitPlan')}</Button></ActionDock>}
 </>;
}
