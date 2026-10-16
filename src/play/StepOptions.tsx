import { ArrowRight,Check,FileCode } from 'lucide-react';
import { ActionDock } from './ActionDock';
import { useStepOptions,type Props } from './useStepOptions';


export function StepOptions({step,progress,disabled,consequential}:Props){
const model=useStepOptions({step,progress});if(!model)return null;const {options,dispatch,t,done}=model;

 return <ActionDock active={!disabled&&options.length<=2}>
  <div className={`choices ${step.type==='file-browser'?'file-choices':''}`}>
   {options.map((option,index)=><button key={option.id} disabled={disabled}
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
