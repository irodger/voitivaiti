import '../content/recovery';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {drinks,drinkRelief} from '../world/recovery';
import {useI18n} from '../content/localization';
import {Button} from './shared';
export function CoffeeBreak(){const w=useWorld(),{t}=useI18n(),ch=activeCharacter(w),l=w.life!;return <div className="coffee-break"><b>{t('recovery.'+drinks[l.drinkOfTheDay??0])}</b><Button secondary disabled={w.phase!=='office'||w.time>=1080||ch.stats.money<l.coffeePrice} onClick={()=>w.dispatch({type:'drink'})}>{t('recovery.drink',{price:l.coffeePrice,relief:drinkRelief(l.drinksToday??0)})}</Button>{l.coffeeScene&&<p role="status">{t(l.coffeeScene)}</p>}</div>}
