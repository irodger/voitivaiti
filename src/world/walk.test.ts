import {it,expect} from 'vitest';
import {transition} from './engine';
import {emptyCampaign,activeCharacter} from './simulation';
import {migrateLegacy} from './store';
import {availableWalkRoutes,canBeginWalk,currentWalk,walkRoutes} from './walk';
import {eveningDone} from './evening';
import {currentFocus} from '../play/currentFocus';

function home(){const c=transition(emptyCampaign(),{type:'new',name:'Test',avatarId:'1',professionId:'designer',seed:1427}).campaign;delete activeCharacter(c).firstDay;c.phase='home';c.time=1110;activeCharacter(c).stats.stress=65;return c;}
for(const route of walkRoutes)it(`walks ${route.id}, preserves the result after reload and prevents duplicate rewards`,()=>{
 let c=home();c=transition(c,{type:'start-walk'}).campaign;
 expect(currentFocus(c).key).toBe('focus.walk');
 c=migrateLegacy(JSON.parse(JSON.stringify(c)));
 expect(currentWalk(activeCharacter(c),c.company!.currentDay)?.status).toBe('choosing');
 c=transition(c,{type:'walk-route',id:route.id}).campaign;
 expect(c.time).toBe(1110+route.minutes);expect(activeCharacter(c).stats.stress).toBe(65-route.stress);
 expect(currentFocus(c).key).toBe('focus.walkDone');
 c=migrateLegacy(JSON.parse(JSON.stringify(c)));
 expect(currentWalk(activeCharacter(c),c.company!.currentDay)).toMatchObject({routeId:route.id,status:'finished',observationKey:'walk.'+route.id+'.tired',stressBefore:65,stressAfter:65-route.stress});
 const before=JSON.stringify(c);expect(JSON.stringify(transition(c,{type:'walk-route',id:route.id}).campaign)).toBe(before);
 c=transition(c,{type:'end-walk'}).campaign;
 expect(currentFocus(c).key).toBe('focus.home');expect(eveningDone(activeCharacter(c),c.company!.currentDay)).toContain('walk');
 expect(canBeginWalk(activeCharacter(c),c.company!.currentDay,c.time)).toBe(false);
});
it('offers only routes that fit and rejects a forged route that crosses midnight',()=>{
 let c=home();c.time=1420;
 expect(availableWalkRoutes(activeCharacter(c),c.company!.currentDay,c.time).map(r=>r.id)).toEqual(['courtyard']);
 c=transition(c,{type:'start-walk'}).campaign;const before=JSON.stringify(c);
 expect(JSON.stringify(transition(c,{type:'walk-route',id:'river'}).campaign)).toBe(before);
 c=transition(c,{type:'walk-route',id:'courtyard'}).campaign;expect(c.time).toBe(1440);
 c=transition(c,{type:'end-walk'}).campaign;c=transition(c,{type:'sleep'}).campaign;expect(c.phase).toBe('office');
});
it('cancels route selection without charging time or an evening activity',()=>{
 let c=home();c=transition(c,{type:'start-walk'}).campaign;c=transition(c,{type:'end-walk'}).campaign;
 expect(c.time).toBe(1110);expect(activeCharacter(c).stats.stress).toBe(65);expect(eveningDone(activeCharacter(c),c.company!.currentDay)).toEqual([]);
 expect(canBeginWalk(activeCharacter(c),c.company!.currentDay,c.time)).toBe(true);
});
it('keeps other evening actions available after returning and allows another walk next day',()=>{
 let c=home();c=transition(c,{type:'start-walk'}).campaign;
 expect(transition(c,{type:'sleep'}).campaign.phase).toBe('home');expect(transition(c,{type:'evening',id:'cook'}).campaign.time).toBe(1110);
 c=transition(c,{type:'walk-route',id:'courtyard'}).campaign;c=transition(c,{type:'end-walk'}).campaign;c=transition(c,{type:'evening',id:'cook'}).campaign;
 expect(c.time).toBe(1170);expect(eveningDone(activeCharacter(c),c.company!.currentDay)).toEqual(['walk','cook']);
 c=transition(c,{type:'sleep'}).campaign;c.phase='home';c.time=1110;expect(canBeginWalk(activeCharacter(c),c.company!.currentDay,c.time)).toBe(true);
});
it('blocks starting from work, after a legacy walk, or without time for the shortest route',()=>{
 let c=home();c.phase='office';expect(transition(c,{type:'start-walk'}).campaign.phase).toBe('office');expect(activeCharacter(transition(c,{type:'start-walk'}).campaign).home?.walk).toBeUndefined();
 c=home();c=transition(c,{type:'evening',id:'walk'}).campaign;expect(canBeginWalk(activeCharacter(c),c.company!.currentDay,c.time)).toBe(false);
 c=home();c.time=1421;expect(canBeginWalk(activeCharacter(c),c.company!.currentDay,c.time)).toBe(false);
});
it('reports actual stress reduction when stress reaches zero',()=>{
 let c=home();activeCharacter(c).stats.stress=2;c=transition(c,{type:'start-walk'}).campaign;c=transition(c,{type:'walk-route',id:'river'}).campaign;
 expect(currentWalk(activeCharacter(c),c.company!.currentDay)).toMatchObject({stressBefore:2,stressAfter:0,observationKey:'walk.river.result'});
});
