import { findActiveCharacter } from './selectors';
import type {Campaign} from './types';
export type MoneyArrival={amount:number;net:number;balance:number;salary:boolean};
/** A receipt describes a committed transition; opening it never applies money effects. */
export function moneyArrival(before:Campaign,after:Campaign):MoneyArrival|null{
 if(before.activeCharacterId!==after.activeCharacterId)return null;
 const old=findActiveCharacter(before),ch=findActiveCharacter(after);
 if(!old||!ch)return null;
 const net=ch.stats.money-old.stats.money;
 const salary=ch.home?.paidDay!==old.home?.paidDay&&(ch.home?.lastPay??0)>0;
 const amount=salary?ch.home!.lastPay:net;
 return amount>0?{amount,net,balance:ch.stats.money,salary}:null;
}
