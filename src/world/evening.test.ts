import {it,expect} from 'vitest';
import {transition} from './engine';
import {emptyCampaign,activeCharacter} from './simulation';
import {migrateLegacy} from './store';
import {eveningDone} from './evening';
const home=()=>{const c=transition(emptyCampaign(),{type:'new',name:'Test',avatarId:'1',professionId:'designer',seed:1427}).campaign;delete activeCharacter(c).firstDay;c.phase='home';c.time=1080;return c;};
it('allows dinner then a walk, charges durations and prevents repeat rewards after reload',()=>{
 let c=home();c=transition(c,{type:'evening',id:'cook'}).campaign;expect(c.time).toBe(1120);
 c=transition(c,{type:'evening',id:'walk'}).campaign;expect(c.time).toBe(1165);
 c=migrateLegacy(JSON.parse(JSON.stringify(c)));
 expect(eveningDone(activeCharacter(c),c.company!.currentDay)).toEqual(['cook','walk']);
 const before=JSON.stringify(c);c=transition(c,{type:'evening',id:'walk'}).campaign;expect(JSON.stringify(c)).toBe(before);
 c.company!.currentDay++;expect(eveningDone(activeCharacter(c),c.company!.currentDay)).toEqual([]);
});
it('stops activities crossing midnight and always allows sleep',()=>{
 let c=home();c.time=1420;const before=JSON.stringify(c);
 c=transition(c,{type:'evening',id:'games'}).campaign;expect(JSON.stringify(c)).toBe(before);
 c=transition(c,{type:'sleep'}).campaign;expect(c.phase).toBe('office');
});
it('accepts a legacy home save without a per-activity list',()=>{
 const c=home();activeCharacter(c).home={owned:[],eveningDay:c.company!.currentDay,paidDay:0,lastPay:0};c.time=1260;
 const next=transition(c,{type:'evening',id:'walk'}).campaign;expect(next.time).toBe(1305);
});
