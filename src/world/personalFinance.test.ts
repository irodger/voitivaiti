import {it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {emptyCampaign,activeCharacter} from './simulation';
import {transition} from './engine';
import {financeState,settlePersonalFinance,applyPersonalEvent} from './personalFinance';
import {settleCalendarDay} from './life';
import {migrateLegacy} from './store';
function campaign(){return transition(emptyCampaign(),{type:'new',name:'Life',avatarId:'1',professionId:'frontend',seed:1427}).campaign;}
it('monthly rent and transit charge once, separately from daily living costs',()=>{
 const c=campaign(),ch=activeCharacter(c),f=financeState(ch,1);f.nextEvent=100;c.life!.calendarDay=30;
 const before=ch.stats.money;const result=settlePersonalFinance(c);
 expect(result.expenses).toBe(18000);expect(ch.stats.money).toBe(before-18000);expect(f.nextBills).toBe(60);
 expect(settlePersonalFinance(c)).toEqual({income:0,expenses:0});expect(f.records.map(r=>r.kind)).toEqual(['rent','transit']);
});
it('a leak charges actual cash and preserves the unpaid bill for later income',()=>{
 const c=campaign(),ch=activeCharacter(c),f=financeState(ch,1);ch.stats.money=1000;
 expect(applyPersonalEvent(ch,f,1,'flood',-5000)).toBe(-1000);expect(f.owed).toBe(4000);expect(ch.stats.money).toBe(0);
 expect(applyPersonalEvent(ch,f,1,'flood',-5000)).toBe(0);
 ch.stats.money=6000;c.life!.calendarDay=2;settlePersonalFinance(c);expect(f.owed).toBe(0);expect(ch.stats.money).toBe(2000);
});
it('reload preserves the same random event and cannot reroll or pay it again',()=>{
 const c=campaign(),ch=activeCharacter(c),f=financeState(ch,1);c.life!.calendarDay=f.nextEvent;
 const copy=JSON.parse(JSON.stringify(c));expect(settlePersonalFinance(c)).toEqual(settlePersonalFinance(copy));
 expect(activeCharacter(copy).home!.finances).toEqual(f);
 const restored=migrateLegacy(JSON.parse(JSON.stringify(c))),before=activeCharacter(restored).stats.money;
 expect(settlePersonalFinance(restored)).toEqual({income:0,expenses:0});expect(activeCharacter(restored).stats.money).toBe(before);
});
it('events remain rare, inheritance is once per character, owned upgrades survive repair',()=>{
 const c=campaign(),ch=activeCharacter(c),f=financeState(ch,1);ch.stats.money=1e6;ch.home!.owned=['monitor','bed'];
 let inheritances=0,previous=0;
 for(let day=1;day<=1000;day++){
  c.life!.calendarDay=day;settlePersonalFinance(c);
  const events=f.records.filter(r=>r.day===day&&!['rent','transit','repayment'].includes(r.kind));
  if(events.length){if(previous)expect(day-previous).toBeGreaterThanOrEqual(14);previous=day;inheritances+=events.filter(r=>r.kind==='inheritance').length;}
 }
 expect(inheritances).toBeLessThanOrEqual(1);expect(ch.home!.owned).toEqual(['monitor','bed']);
});
it('salary reporting excludes windfalls while total income includes them',()=>{
 const c=campaign(),ch=activeCharacter(c);financeState(ch,1);
 // Search a deterministic event day with a positive result; no production random override.
 for(let seed=1;seed<100;seed++){
  c.company!.seed=seed;const probe=JSON.parse(JSON.stringify(c));activeCharacter(probe).home!.finances!.nextEvent=1;
  const result=settleCalendarDay(probe);
  if(result.income>result.salary){expect(result.income-result.salary).toBeGreaterThan(0);expect(activeCharacter(probe).home!.finances!.records.some(r=>r.amount>0)).toBe(true);return;}
 }
 throw new Error('No positive event found');
});
