import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
vi.mock('../world/store',async importOriginal=>{
 const actual=await importOriginal<typeof import('../world/store')>();
 return {...actual,useWorld:Object.assign((selector?: (s:ReturnType<typeof actual.useWorld.getState>)=>unknown)=>selector?selector(actual.useWorld.getState()):actual.useWorld.getState(),actual.useWorld)};
});
import {ApartmentScene} from './ApartmentScene';
import {useWorld,migrateLegacy} from '../world/store';
import {transition} from '../world/engine';
import {emptyCampaign,activeCharacter} from '../world/simulation';
function home(){const c=transition(emptyCampaign(),{type:'new',name:'Test',avatarId:'1',professionId:'designer',seed:1427}).campaign;c.phase='home';c.time=1110;delete activeCharacter(c).firstDay;activeCharacter(c).stats.money=100000;return c;}
const markup=()=>renderToStaticMarkup(<ApartmentScene onShop={()=>{}} onMarket={()=>{}}/>);

it('installs exactly the purchased furniture and restores it with the campaign',()=>{
 let c=home();useWorld.setState(c);expect(markup()).not.toContain('furniture-chair');
 c=transition(c,{type:'buy-home',id:'chair'}).campaign;
 c=migrateLegacy(JSON.parse(JSON.stringify(c)));useWorld.setState(c);
 expect(markup()).toContain('furniture-chair');expect(markup()).not.toContain('furniture-bed');
 const money=activeCharacter(c).stats.money;
 expect(activeCharacter(transition(c,{type:'buy-home',id:'chair'}).campaign).stats.money).toBe(money);
});
it('places only arrived parcels at the door and installs tech only after unpacking',()=>{
 let c=home();const ch=activeCharacter(c);
 ch.orders=[{itemId:'monitor',orderedDay:1,deliveryDay:c.life!.calendarDay,received:false},{itemId:'router',orderedDay:1,deliveryDay:c.life!.calendarDay+1,received:false}];
 useWorld.setState(c);expect(markup()).toContain('Посылки: 1');expect(markup()).not.toContain('tech-monitor');
 c=transition(c,{type:'unpack',itemId:'monitor'}).campaign;c=migrateLegacy(JSON.parse(JSON.stringify(c)));useWorld.setState(c);
 expect(markup()).toContain('tech-monitor');expect(markup()).not.toContain('apartment-parcel');expect(markup()).not.toContain('tech-router');
});
it('reflects completed activities and prevents exposing activities that cannot fit before midnight',()=>{
 let c=home();c=transition(c,{type:'evening',id:'cook'}).campaign;c=migrateLegacy(JSON.parse(JSON.stringify(c)));useWorld.setState(c);
 expect(markup()).toContain('spot-cook finished');expect(markup()).not.toContain('aria-label="Ужин"');
 c.time=1421;useWorld.setState(c);const html=markup();
 expect(html).not.toContain('spot-walk');expect(html).not.toContain('spot-read');expect(html).toContain('spot-sleep');
});
it('does not offer evening actions while the player is at work',()=>{
 const c=home();c.phase='office';useWorld.setState(c);const html=markup();
 expect(html).not.toContain('spot-sleep');expect(html).not.toContain('spot-cook');expect(html).toContain('Обустроить дом');
});
