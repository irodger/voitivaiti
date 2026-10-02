import {marketItems} from '../content/marketplace';
import type {Character} from './types';

export function deliveryFor(ch:Character,itemId:string,day:number){
 const item=marketItems.find(i=>i.id===itemId),order=ch.orders?.find(o=>o.itemId===itemId);
 return item&&order&&order.deliveryDay<=day?{item,order}:undefined;
}
export function currentDelivery(ch:Character,day:number){
 return ch.home?.deliveryItemId?deliveryFor(ch,ch.home.deliveryItemId,day):undefined;
}
