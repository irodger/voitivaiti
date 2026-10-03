import type {Campaign,Character} from './types';
export type FinanceRecord={id:string;day:number;kind:string;amount:number;bill:number};
export type PersonalFinance={started:number;settled:number;nextEvent:number;nextBills:number;owed:number;inheritance:boolean;records:FinanceRecord[]};
const hash=(s:string)=>{let n=2166136261;for(const c of s)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
export function financeState(ch:Character,day:number):PersonalFinance{
 const home=ch.home??(ch.home={owned:[],eveningDay:0,paidDay:0,lastPay:0});
 return home.finances??(home.finances={started:day,settled:0,nextEvent:day+10+hash(ch.id)%8,nextBills:day+29,owed:0,inheritance:false,records:[]});
}
export function applyPersonalEvent(ch:Character,f:PersonalFinance,day:number,kind:string,amount:number){
 const id=`${ch.id}:${day}:${kind}`;if(f.records.some(r=>r.id===id))return 0;
 const actual=amount>=0?amount:-Math.min(ch.stats.money,-amount);
 ch.stats.money+=actual;if(amount<0)f.owed+=-amount+actual;
 f.records.push({id,day,kind,amount:actual,bill:amount<0?-amount:0});f.records=f.records.slice(-40);
 return actual;
}
/** Called once per settled calendar day, including vacation/montage days. */
export function settlePersonalFinance(c:Campaign){
 const ch=c.characters.find(p=>p.id===c.activeCharacterId)!,day=c.life!.calendarDay,f=financeState(ch,day);
 if(f.settled>=day)return {income:0,expenses:0};f.settled=day;
 let income=0,expenses=0;
 const apply=(kind:string,amount:number)=>{const actual=applyPersonalEvent(ch,f,day,kind,amount);if(actual>0)income+=actual;else expenses-=actual;};
 if(f.owed>0&&ch.stats.money>0){const paid=Math.min(f.owed,ch.stats.money);f.owed-=paid;apply('repayment',-paid);}
 if(day>=f.nextBills){apply('rent',-15000);apply('transit',-3000);f.nextBills=day+30;}
 if(day>=f.nextEvent){
  const roll=hash(`${c.company!.seed}:${ch.id}:${day}`),pick=roll%60;
  if(pick===0&&!f.inheritance){f.inheritance=true;apply('inheritance',20000);}
  else if(pick<15)apply('lottery',500+(roll%2)*500);
  else if(pick<24)apply('refund',800);
  else if(pick<34)apply('flood',-5000);
  else if(pick<43)apply(ch.home?.owned.includes('monitor')?'monitor':'phone',-2500);
  else if(pick<51)apply('bed',-1800);
  else apply('injury',-3500);
  // Repair charges restore the item: an owned upgrade is not silently removed.
  f.nextEvent=day+14+hash(`${roll}:next`)%15;
 }
 return {income,expenses};
}
