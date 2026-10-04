import {ActionPanel,ActionDock} from './ActionDock';
import {useEffect,useRef} from 'react';
import {ArrowLeft,Check,Package} from 'lucide-react';
import '../content/delivery';
import {useI18n} from '../content/localization';
import {activeCharacter} from '../world/simulation';
import {useWorld} from '../world/store';
import {currentDelivery} from '../world/delivery';
import {TechArt} from './TechArt';
import {Button} from './shared';
import './marketplace.css';

export function Delivery({onBack}:{onBack:(view:'market'|'evening')=>void}){
 const w=useWorld(),ch=activeCharacter(w),{t,locale}=useI18n(),delivery=currentDelivery(ch,w.life!.calendarDay)!;
 const {item,order}=delivery,opened=order.received,heading=useRef<HTMLHeadingElement>(null);
 const close=(view:'market'|'evening')=>{w.dispatch({type:'close-delivery'});onBack(view);};
 useEffect(()=>{heading.current?.focus();},[]);
 useEffect(()=>{const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!document.querySelector('[role="dialog"]'))close('evening');};addEventListener('keydown',onKey);return()=>removeEventListener('keydown',onKey);},[w.dispatch,onBack]);
 return <div className="world-work delivery-world">
  <section className={`delivery-stage ${opened?'is-open':''}`} aria-label={t(opened?'delivery.opened':'delivery.title')}>
   <div className="delivery-stage-label"><Package size={16}/>{t('market.title')}<span>{t(opened?'delivery.placed':'market.ready')}</span></div>
   <div className="delivery-objects" aria-hidden="true">
    <span className="parcel-art" style={{backgroundImage:`url(${import.meta.env.BASE_URL}art/parcel-premium.webp)`}}/>
    {opened&&<div className="delivery-reveal"><TechArt id={item.id}/></div>}
   </div>
   <div className="delivery-stage-name">{t(item.titleKey)}</div>
  </section>
  <ActionPanel desktopOnly className="world-task-panel delivery-panel">
   <div className="delivery-panel-top"><button onClick={()=>close('market')}><ArrowLeft size={15}/>{t('delivery.back')}</button></div>
   <div className="office-content">
    <h1 tabIndex={-1} ref={heading}>{t(opened?'delivery.opened':'delivery.title')}</h1>
    <h2>{t(item.titleKey)}</h2>
    <p className="delivery-story" role={opened?'status':undefined}>{t(opened?'delivery.'+item.id+'.result':'delivery.sealed')}</p>
    {opened?<p className="delivery-benefit"><Check size={17}/>{t(item.descriptionKey)}</p>:<p className="delivery-paid">{t('delivery.paid',{price:item.price.toLocaleString(locale)})}</p>}
    <ActionDock><Button onClick={()=>opened?close('evening'):w.dispatch({type:'unpack',itemId:item.id})}>{t(opened?'delivery.home':'delivery.open')}</Button></ActionDock>
   </div>
  </ActionPanel>
 </div>;
}
