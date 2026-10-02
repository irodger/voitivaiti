import {it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition} from './engine';
import {emptyCampaign,activeCharacter} from './simulation';
import {migrateLegacy} from './store';
import {currentDelivery} from './delivery';
import {currentFocus} from '../play/currentFocus';
import {recovery} from './economy';

function home(){const c=transition(emptyCampaign(),{type:'new',name:'Test',avatarId:'1',professionId:'designer',seed:1427}).campaign;delete activeCharacter(c).firstDay;c.phase='home';c.time=1110;activeCharacter(c).orders=[{itemId:'keyboard',orderedDay:0,deliveryDay:c.life!.calendarDay,received:false}];return c;}
it('restores a sealed parcel, then its unboxed result, without repeat effects or payment',()=>{
 let c=home(),before=activeCharacter(c).stats.money;
 c=transition(c,{type:'inspect-delivery',itemId:'keyboard'}).campaign;
 c=migrateLegacy(JSON.parse(JSON.stringify(c)));
 expect(currentDelivery(activeCharacter(c),c.life!.calendarDay)?.order.received).toBe(false);
 expect(currentFocus(c).key).toBe('delivery.focus.sealed');
 expect(transition(c,{type:'sleep'}).campaign).toEqual(c);
 expect(transition(c,{type:'start-walk'}).campaign).toEqual(c);
 expect(transition(c,{type:'evening',id:'cook'}).campaign).toEqual(c);
 c=transition(c,{type:'unpack',itemId:'keyboard'}).campaign;
 c=migrateLegacy(JSON.parse(JSON.stringify(c)));
 expect(currentDelivery(activeCharacter(c),c.life!.calendarDay)?.order.received).toBe(true);
 expect(currentFocus(c).key).toBe('delivery.focus.opened');
 expect(activeCharacter(c).home?.owned.filter(id=>id==='keyboard')).toHaveLength(1);
 expect(activeCharacter(c).stats.money).toBe(before);expect(c.time).toBe(1110);
 expect(recovery(activeCharacter(c)).stress).toBe(8);
 expect(transition(c,{type:'unpack',itemId:'keyboard'}).campaign).toEqual(c);
 c=transition(c,{type:'close-delivery'}).campaign;
 expect(currentDelivery(activeCharacter(c),c.life!.calendarDay)).toBeUndefined();
 expect(currentFocus(c).key).toBe('focus.home');
 expect(transition(c,{type:'evening',id:'cook'}).campaign.time).toBe(1150);
});
it('can leave a sealed parcel unopened and resume later',()=>{
 let c=home();c=transition(c,{type:'inspect-delivery',itemId:'keyboard'}).campaign;
 c=transition(c,{type:'close-delivery'}).campaign;
 expect(activeCharacter(c).orders?.[0].received).toBe(false);expect(c.time).toBe(1110);
 c=transition(c,{type:'inspect-delivery',itemId:'keyboard'}).campaign;
 expect(currentDelivery(activeCharacter(c),c.life!.calendarDay)).toBeDefined();
});
it('rejects unknown, early and outside-the-home parcel actions',()=>{
 let c=home();expect(transition(c,{type:'inspect-delivery',itemId:'invalid'}).campaign).toEqual(c);
 activeCharacter(c).orders![0].deliveryDay++;expect(transition(c,{type:'inspect-delivery',itemId:'keyboard'}).campaign).toEqual(c);
 c=home();c.phase='office';expect(transition(c,{type:'inspect-delivery',itemId:'keyboard'}).campaign).toEqual(c);
 c=home();c=transition(c,{type:'start-walk'}).campaign;
 expect(transition(c,{type:'inspect-delivery',itemId:'keyboard'}).campaign).toEqual(c);
 expect(transition(c,{type:'unpack',itemId:'keyboard'}).campaign).toEqual(c);
});
it('keeps sleep recovery bounded with all tech and upgrades, including old saves',()=>{
 const c=home(),ch=activeCharacter(c);
 ch.home={owned:['keyboard','headphones'],eveningDay:0,paidDay:0,lastPay:0};
 expect(recovery(ch).stress).toBe(9);
 ch.home.owned.push('bed','plants','lamp','kitchen','chair','library');expect(recovery(ch).stress).toBe(12);
 const restored=migrateLegacy(JSON.parse(JSON.stringify(c)));expect(currentDelivery(activeCharacter(restored),restored.life!.calendarDay)).toBeUndefined();
});
