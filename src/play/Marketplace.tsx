import {Check,Package,Truck} from 'lucide-react';
import { marketItems } from '../content/marketplace';
import { useWorld } from '../world/store';
import { activeCharacter } from '../world/simulation';
import { homeState } from '../world/economy';
import { useI18n } from '../content/localization';
import {TechArt} from './TechArt';
import './marketplace.css';

export function Marketplace(){
 const w=useWorld(),ch=activeCharacter(w),{t,locale}=useI18n(),orders=ch.orders??[],pending=orders.filter(o=>!o.received);
 const money=(n:number)=>n.toLocaleString(locale);
 return <div className="marketplace">
  <div className="market-brand"><Package size={28}/><div><h1>{t('market.title')}</h1><small>{t('market.tagline')}</small></div></div>
  <p className="market-delivery-note"><Truck size={17}/>{t('market.delivery')}</p>
  {pending.length>0&&<section className="market-shipping" aria-label={t('market.orders')}>
   <h2>{t('market.orders')}</h2>
   {pending.map(o=>{const item=marketItems.find(i=>i.id===o.itemId);if(!item)return null;const ready=o.deliveryDay<=w.life!.calendarDay;return <article key={o.itemId}>
    <TechArt id={item.id}/><div><h3>{t(item.titleKey)}</h3><ol className="shipping-track"><li className="reached"><Check size={10}/>{t('market.paid')}</li><li className="reached"><Truck size={10}/>{t('market.sent')}</li><li className={ready?'reached':''}><Package size={10}/>{t('market.atDoor')}</li></ol>
     {!ready&&<p>{t(o.deliveryDay-w.life!.calendarDay===1?'market.nextDay':'market.tomorrow',{days:Math.max(1,o.deliveryDay-w.life!.calendarDay)})}</p>}
     {ready&&(w.phase==='home'?<button className="market-receive" onClick={()=>w.dispatch({type:'inspect-delivery',itemId:item.id})}>{t('market.unpack')} ↗</button>:<p>{t('market.receiveHome')}</p>)}
    </div>
   </article>})}
  </section>}
  <div className="market-catalog">{marketItems.map(item=>{const owned=homeState(ch).owned.includes(item.id),ordered=orders.some(o=>o.itemId===item.id),short=ch.stats.money<item.price;return <article key={item.id} className={owned?'installed':''}>
   <div className="market-product-art"><TechArt id={item.id} label={t(item.titleKey)}/>{owned&&<span className="market-owned-badge"><Check size={12}/>{t('home.owned')}</span>}</div>
   <div className="market-product-copy"><h2>{t(item.titleKey)}</h2><p>{t(item.descriptionKey)}</p><div className="market-price"><b>{money(item.price)} ₽</b><small>{t('market.free')}</small></div>
    {owned?<p className="market-product-status"><Check size={14}/>{t('market.inRoom')}</p>:ordered?<p className="market-product-status"><Package size={14}/>{t('market.ordered')}</p>:short?<p className="market-short">{t('home.short',{price:money(item.price-ch.stats.money)})}</p>:<button className="market-buy" onClick={()=>w.dispatch({type:'order',itemId:item.id})}>{t('market.order',{price:money(item.price)})}<span aria-hidden="true">↗</span></button>}
   </div>
  </article>})}</div>
 </div>;
}
