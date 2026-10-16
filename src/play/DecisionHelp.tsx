import { usePopoverDismissal } from '../hooks/usePopoverDismissal';
import { popoverPosition } from '../utils/popoverPosition';
import {useId,useLayoutEffect,useRef,useState} from 'react';
import {useI18n} from '../content/localization';
export function DecisionHelp(){const {t}=useI18n(),[open,setOpen]=useState(false),id=useId(),trigger=useRef<HTMLButtonElement>(null),popup=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{if(!open)return;const node=popup.current!;node.showPopover();const r=trigger.current!.getBoundingClientRect(),height=node.offsetHeight;const position=popoverPosition(r,{width:node.offsetWidth,height},{width:innerWidth,height:innerHeight},12);node.style.left=position.left+'px';node.style.top=position.top+'px';return()=>{if(node.matches(':popover-open'))node.hidePopover();};},[open]);
 usePopoverDismissal({open,setOpen,anchor:trigger,popup,closeOnScroll:true,stopImmediateEscape:true});
 return <><button className="decision-help" ref={trigger} aria-expanded={open} aria-controls={id} onClick={()=>setOpen(v=>!v)}>{t('decision.help')}</button>{open&&<div className="decision-help-popover" ref={popup} id={id} popover="manual" role="note">{t('decision.hint')}</div>}</>;
}
