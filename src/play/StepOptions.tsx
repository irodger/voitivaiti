import {Check,ArrowRight,FileCode} from 'lucide-react';
import type {Step,StepProgress} from '../world/types';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {ActionDock} from './ActionDock';

type Props={step:Step;progress:StepProgress;disabled:boolean;consequential:boolean};
export function StepOptions({step,progress,disabled,consequential}:Props){
 const dispatch=useWorld(s=>s.dispatch),{t}=useI18n(),done=progress.status==='completed';
 if(!step.options||(step.type==='review'&&progress.run!=='done'))return null;
 return <ActionDock active={!disabled&&step.options.length<=2}>
  <div className={`choices ${step.type==='file-browser'?'file-choices':''}`}>
   {step.options.map((option,index)=><button key={option.id} disabled={disabled}
    className={`choice ${progress.choiceId===option.id?(consequential?'decision-selected':done?'chosen':'incorrect'):''}`}
    onClick={()=>dispatch({type:'choose',id:option.id})}>
    {step.type==='file-browser'?<FileCode size={17}/>:<span className="choice-index">
     {!consequential&&done&&progress.choiceId===option.id?<Check size={14}/>:index+1}
    </span>}
    <span><b>{t(option.labelKey)}</b>{option.detailKey&&<small>{t(option.detailKey)}</small>}</span>
    <ArrowRight className="choice-arrow" size={15}/>
   </button>)}
  </div>
 </ActionDock>;
}
