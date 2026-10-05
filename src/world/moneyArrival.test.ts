import {it,expect} from 'vitest';
import {moneyArrival} from './moneyArrival';
import {emptyCampaign,activeCharacter} from './simulation';
import {transition} from './engine';
import {snapshot} from './store';
const start=()=>transition(emptyCampaign(),{type:'new',name:'Money',avatarId:'1',professionId:'frontend',seed:1427}).campaign;
it('reports gross salary separately from net balance and never reapplies it',()=>{
 const before=start();activeCharacter(before).firstDay=undefined;before.schedule.forEach(e=>e.status='completed');
 const after=transition(before,{type:'end-day'}).campaign,receipt=moneyArrival(before,after)!;
 expect(receipt.salary).toBe(true);expect(receipt.amount).toBe(activeCharacter(after).home!.lastPay);expect(receipt.net).toBe(activeCharacter(after).stats.money-activeCharacter(before).stats.money);
 const repeated=transition(after,{type:'end-day'}).campaign;expect(moneyArrival(after,repeated)).toBeNull();expect(moneyArrival(after,JSON.parse(JSON.stringify(after)))).toBeNull();expect(snapshot({...after,moneyArrival:receipt} as typeof after)).not.toHaveProperty('moneyArrival');
});
it('reports other net gains but ignores spending and switching heroes',()=>{
 const before=start(),after=structuredClone(before);activeCharacter(after).stats.money+=800;expect(moneyArrival(before,after)).toMatchObject({amount:800,net:800,salary:false});
 activeCharacter(after).stats.money-=1800;expect(moneyArrival(before,after)).toBeNull();after.activeCharacterId=after.characters.find(ch=>ch.id!==before.activeCharacterId)!.id;expect(moneyArrival(before,after)).toBeNull();
});
