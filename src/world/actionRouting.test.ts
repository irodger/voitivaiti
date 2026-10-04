import {beforeEach,describe,expect,it,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {transition} from './engine';
import {activeCharacter,emptyCampaign} from './simulation';
import {setAnalyticsSink} from './analytics';
import {homeUpgrades} from '../content/home';
const events:string[]=[];
beforeEach(()=>{events.length=0;setAnalyticsSink(event=>events.push(event.name));});
function started(){return transition(emptyCampaign(),{type:'new',name:'Architecture',avatarId:'1',professionId:'frontend',seed:1427}).campaign;}
function ready(){const c=started(),ch=activeCharacter(c);ch.firstDay!.onboardingCompleted=true;ch.firstDay!.currentOnboardingStep='done';c.schedule=[];return c;}
describe('domain action routing contract',()=>{
 it('global onboarding guards run before domain handlers',()=>{
  const c=started(),before=structuredClone(c);c.phase='home';before.phase='home';events.length=0;
  const result=transition(c,{type:'buy-home',id:homeUpgrades[0].id});
  expect(result.campaign).toBe(c);expect(c).toEqual(before);expect(result.feedback).toEqual([]);expect(events).toEqual([]);
 });
 it('home actions apply effects and telemetry once without mutating the input',()=>{
  const c=ready();c.phase='home';const before=structuredClone(c),item=homeUpgrades[0];events.length=0;
  const result=transition(c,{type:'buy-home',id:item.id});
  expect(c).toEqual(before);expect(activeCharacter(result.campaign).stats.money).toBe(activeCharacter(c).stats.money-item.price);
  expect(result.feedback.filter(f=>f.key==='ui.money').map(f=>f.value)).toEqual([-item.price]);
  expect(events.filter(e=>e==='home_upgrade_purchased')).toHaveLength(1);
  const duplicate=transition(result.campaign,{type:'buy-home',id:item.id});
  expect(duplicate.campaign).toBe(result.campaign);expect(duplicate.feedback).toEqual([]);
 });
 it('day and queue handlers preserve the calendar and the next morning guard',()=>{
  const c=ready(),home=transition(c,{type:'end-day'}).campaign;
  expect(home.phase).toBe('home');const next=transition(home,{type:'sleep'}).campaign;
  expect(next.phase).toBe('office');expect(next.company!.currentDay).toBe(c.company!.currentDay+1);
  expect(next.schedule.some(e=>e.type==='sync'&&e.status==='pending')).toBe(true);
  const blocked=transition(next,{type:'take-task'});expect(blocked.campaign).toBe(next);expect(blocked.feedback).toEqual([]);
  expect(events.filter(e=>e==='day_completed')).toHaveLength(1);
 });
});
