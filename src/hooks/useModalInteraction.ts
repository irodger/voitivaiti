import {useEffect,type RefObject} from 'react';
/** Keyboard containment, Escape, scroll lock and focus restoration. */
export function useModalInteraction(ref:RefObject<HTMLElement|null>,onClose:()=>void){
 useEffect(()=>{
  const origin=document.activeElement instanceof HTMLElement?document.activeElement:null,overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';ref.current?.focus();
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();onClose();}
   if(event.key!=='Tab')return;
   const all=Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),summary,[tabindex="0"]')??[]).filter(el=>el.getClientRects().length>0);
   if(!all.length)return;
   const first=all[0],last=all[all.length-1],outside=!all.includes(document.activeElement as HTMLElement);
   if(event.shiftKey&&(document.activeElement===first||outside)){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&(document.activeElement===last||outside)){event.preventDefault();first.focus();}
  };
  document.addEventListener('keydown',key);
  return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=overflow;if(origin?.isConnected)origin.focus({preventScroll:true});};
 },[ref,onClose]);
}
