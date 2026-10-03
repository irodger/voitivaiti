import '../content/conferences';
import '../content/personalFinance';
import {useI18n} from '../content/localization';
import type {Character} from '../world/types';
export function PersonalFinance({character,daily}:{character:Character;daily:number}){
 const {t,locale}=useI18n(),f=character.home?.finances;if(!f)return null;
 const money=(n:number)=>n.toLocaleString(locale);
 return <section className="home-pay-note personal-finance" aria-label={t('finance.title')}><b>{t('finance.title')}</b>
  <p>{t('finance.note',{daily:money(daily),day:f.nextBills})}</p>
  {f.owed>0&&<p>{t('finance.owed',{amount:money(f.owed)})}</p>}
  <ul>{f.records.slice(-5).reverse().map(r=><li key={r.id}><small>{t('finance.day',{day:r.day})}</small> · {t('finance.'+r.kind)} <strong>{r.amount>0?'+':''}{money(r.amount)} ₽</strong>{r.bill>0&&r.amount!==-r.bill&&<small> · {t('finance.bill',{amount:money(r.bill)})}</small>}</li>)}</ul>
 </section>;
}
