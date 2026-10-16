import { useDecisionHelp } from './useDecisionHelp';
export function DecisionHelp(){
 const {toggle,t,open,id,trigger,popup}=useDecisionHelp();

 return <><button className="decision-help" ref={trigger} aria-expanded={open} aria-controls={id} onClick={toggle}>{t('decision.help')}</button>{open&&<div className="decision-help-popover" ref={popup} id={id} popover="manual" role="note">{t('decision.hint')}</div>}</>;
}
