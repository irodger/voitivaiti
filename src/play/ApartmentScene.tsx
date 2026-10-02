import {TechArt} from './TechArt';
import './marketplace.css';
import {canBeginWalk} from '../world/walk';
import {BookOpen, Check, CookingPot, DoorOpen, Gamepad2, Moon, Package, ShoppingBag, Sun} from 'lucide-react';
import {homeUpgrades} from '../content/home';
import {marketItems} from '../content/marketplace';
import {useI18n} from '../content/localization';
import {homeState} from '../world/economy';
import {canSpendEvening, eveningActivities, eveningDone, type EveningActivity} from '../world/evening';
import {activeCharacter} from '../world/simulation';
import {useWorld} from '../world/store';
import {dayPhase} from '../world/workLoop';
import './apartment.css';

const activities = [
  {id:'walk', icon:DoorOpen}, {id:'cook', icon:CookingPot},
  {id:'read', icon:BookOpen}, {id:'games', icon:Gamepad2},
] as const;

export function ApartmentScene({onShop,onMarket}:{onShop:()=>void;onMarket:()=>void}) {
  const w=useWorld(), ch=activeCharacter(w), {t}=useI18n(), owned=homeState(ch).owned;
  const phase=dayPhase(w.time), atHome=w.phase==='home', day=w.company!.currentDay;
  const done=eveningDone(ch,day);
  const available=(id:EveningActivity)=>id==='walk'?canBeginWalk(ch,day,w.time):canSpendEvening(ch,day,w.time,id);
  const hasActivity=activities.some(({id})=>available(id));
  const parcels=(ch.orders??[]).filter(o=>!o.received && o.deliveryDay<=w.life!.calendarDay);
  const act=(id:EveningActivity)=>w.dispatch(id==='walk'?{type:'start-walk'}:{type:'evening',id});
  return <div className={`home-room apartment-scene phase-${phase}`}>
    <div className="apartment-frame">
      <img className="apartment-art" src={`${import.meta.env.BASE_URL}art/apartment-premium.webp`} alt={t('home.roomAlt')}/>
      <div className="apartment-light" aria-hidden="true"/>
      {homeUpgrades.filter(u=>owned.includes(u.id)).map(u=><div key={u.id} className={`apartment-furniture furniture-${u.id}`} role="img" aria-label={t(u.titleKey)}>
        <img src={`${import.meta.env.BASE_URL}art/apartment-furnished.webp`} alt=""/>
      </div>)}
      {marketItems.filter(i=>owned.includes(i.id)).map(i=><div key={i.id} className={`apartment-tech tech-${i.id}`} role="img" aria-label={t(i.titleKey)}><TechArt id={i.id}/></div>)}
      {atHome && <>
        {activities.map(({id,icon:Icon})=>done.includes(id)?
          <span key={id} className={`apartment-action spot-${id} finished`} title={t('evening.done.'+id)}><Check size={13}/><span>{t('apartment.'+id)}</span></span>:
          available(id) && <button key={id} className={`apartment-action spot-${id}`} onClick={()=>act(id)} aria-label={t('apartment.'+id)} title={id==='walk'?t('walk.range'):`${t('apartment.'+id)} · ${t('ui.min',{value:eveningActivities[id]})}`}><Icon size={14}/><span>{t('apartment.'+id)}</span>{id!=='walk'&&<small>{eveningActivities[id]}′</small>}</button>)}
        <button className="apartment-action spot-sleep" onClick={()=>w.dispatch({type:'sleep'})}><Moon size={14}/>{t('ui.sleep')}</button>
      </>}
      {parcels.length>0 && <button className="apartment-parcel" onClick={onMarket} aria-label={t('apartment.parcels',{count:parcels.length})} title={t('apartment.parcels',{count:parcels.length})}><Package size={24}/><span>{parcels.length}</span></button>}
    </div>
    <div className="home-room-label">{phase==='night'?<Moon size={14}/>:<Sun size={14}/>} {t('home.subtitle')}<span>{t('home.count',{count:owned.filter(id=>homeUpgrades.some(u=>u.id===id)).length})}</span></div>
    <div className="apartment-footer"><span>{t(atHome?(hasActivity?'apartment.hint':'apartment.sleepHint'):'ui.homeLocked')}</span><button onClick={onShop}><ShoppingBag size={14}/>{t('home.shop')}</button></div>
  </div>;
}
