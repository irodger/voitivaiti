import { useInlineTerm } from './useInlineTerm';
import { useTermText } from './useTermText';

export function TermText({children}:{children:string}){
 const {segments}=useTermText(children);
return <>{segments.map(({id,label},i)=>id?<InlineTerm key={i} id={id} label={label} context={children}/>:label)}</>
}

function InlineTerm({id,label,context}:{id:string;label:string;context:string}){
 const {toggle,close,t,open,anchor,popup,tooltipId,term,known}=useInlineTerm(id,context);

 return <span className="inline-term"><button ref={anchor} type="button" className={known?'known':''} aria-expanded={open} aria-describedby={open?tooltipId:undefined} onClick={toggle}>{label}</button>{open&&<span ref={popup} id={tooltipId} popover="manual" className="inline-definition term-overlay" role="tooltip"><strong>{t(term.titleKey)}</strong><span>{t(term.explanationKey)}</span><button aria-label={t('ui.close')} onClick={close}>×</button></span>}</span>}
