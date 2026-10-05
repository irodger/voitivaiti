import {gameConfig} from '../config/game';
import {changeStress,stressAfterRecovery} from './stress';
import {clamp as cap} from '../utils/numbers';
import {settlePersonalFinance} from './personalFinance';
import {buildCareerReport} from './careerReport';
import {refreshTaskReplies,restorePaymentChains} from './problemStories';
import {arrangeAbsence,type VacationArrangements} from './vacation';
import {ensureResponsibilities,resolveResponsibilities} from './responsibility';
import {attachCompanyRuntime} from './companyRuntime';
import {restoreExperience} from './mastery';
import {ensureWorkExpectations,expectationPressure} from './expectations';
import {resolveSceneConsequences} from './sceneConsequences';
import {loadStress} from './recovery';
import { availableWork,queuePressure } from './workLoop';
import { resolveDecisions } from './decisions';
import type { Campaign,Character } from './types';
import type { LifeState,MetaProgress,Outcome,WorkKind,DecisionStats } from './lifeTypes';
import { monthlySalary,dailySalary,recovery,homeState } from './economy';
import { workKinds,roleSides,worldEventIds } from '../content/life';
import { professionById } from '../content/professions';
const player=(c:Campaign)=>c.characters.find(x=>x.id===c.activeCharacterId)!;
export const emptyMeta=():MetaProgress=>({careers:[],roles:{},companies:[],terms:[],perspectives:{}});
export const emptyDecisions=():DecisionStats=>({technicalMistakes:0,ignoredQa:0,ignoredReview:0,communicationFailures:0,riskyDeploys:0,deadlineFailures:0,repeatedMistakes:0});
export function queueFor(c:Campaign){return workKinds.map((id,i)=>({id,urgency:1+((c.company!.seed+c.company!.currentDay*7+i*3)%5),minutes:[120,180,150,80,90][i],status:'waiting' as const}));}
export function initLife(c:Campaign):LifeState{const day=c.company?.currentDay??1;return {calendarDay:day,playedDay:day,daysAtCompany:day,roleStartedDay:day,characterStartedDay:day,characterPlayedDays:0,lastMontagePlayedDay:0,maxSalary:c.company?monthlySalary(player(c)):0,queue:c.company?queueFor(c):[],decisions:emptyDecisions(),decisionHistory:[],reviewStage:0,reviewDue:false,reviewedAt:0,goodDays:0,performanceMilestones:0,worldEvents:[],livingCost:1200,salaryHeld:0,montage:null,nextEventDay:day+14,officeEncounterDay:0,lastExpenseCalendarDay:0,lastPaidCalendarDay:0};}
export function ensureLife(c:Campaign){c.meta??=emptyMeta();if(c.company){c.life??=initLife(c);c.life.reportMaxStress=Math.max(c.life.reportMaxStress??0,player(c).stats.stress);attachCompanyRuntime(c);restorePaymentChains(c);restoreExperience(c);c.life.professionalDecisions??=[];c.schedule=c.schedule.filter(e=>e.key!=='ui.coffee');c.life.worldEvents=c.life.worldEvents.filter(e=>e.id!=='coffee');delete c.life.coffeePrice;delete c.life.coffeeScene;delete c.life.drinksToday;delete c.life.drinkDay;delete c.life.drinkOfTheDay;c.life.vacations??=[];const ch=c.characters.find(n=>n.id===c.activeCharacterId);if(ch&&!ch.firstDay)ch.firstDay={onboardingStarted:false,onboardingCompleted:true,currentOnboardingStep:'done',introducedNpcIds:c.characters.filter(n=>n.id!==ch.id).map(n=>n.id),visited:[],hostId:'',leadId:''};}ensureWorkExpectations(c);ensureResponsibilities(c);resolveResponsibilities(c);refreshTaskReplies(c);return c;}
export const careerRank=(ch:Character)=>Math.max(0,professionById[ch.profession].careers.findIndex(n=>n.id===ch.careerNodeId));
export const tenureRequired=(rank:number)=>[0,90,180,270,365,365][rank]??365;
export function updateMeta(c:Campaign){if(!c.company)return;ensureLife(c);const ch=player(c),m=c.meta!,l=c.life!;l.maxSalary=Math.max(l.maxSalary,monthlySalary(ch));ch.roleTenure=Math.max(0,l.calendarDay-l.roleStartedDay);ch.performanceMilestones=l.performanceMilestones;ch.reviewStage=l.reviewStage;const rank=careerRank(ch),old=m.roles[ch.profession];m.roles[ch.profession]={maxGrade:Math.max(old?.maxGrade??0,rank),tasks:Math.max(old?.tasks??0,ch.completedWork.length)};m.companies=[...new Set([...m.companies,c.company.archetype])];m.terms=[...new Set([...m.terms,...ch.discoveredTerms])];}
export function archiveCareer(c:Campaign,outcome:Outcome){ensureLife(c);updateMeta(c);const ch=player(c),l=c.life!;if(!c.meta!.careers.some(r=>r.characterId===ch.id))c.meta!.careers.push({runTiming:ch.runTiming?structuredClone(ch.runTiming):undefined,report:buildCareerReport(c,outcome),experience:structuredClone(ch.experience??[]),characterId:ch.id,name:ch.name,profession:ch.profession,maxGrade:ch.careerNodeId,careerStartedAt:l.characterStartedDay,careerEndedAt:l.calendarDay,calendarDays:l.calendarDay-l.characterStartedDay+1,playedDays:l.characterPlayedDays,companies:[c.company!.id],maxSalary:l.maxSalary,majorEvents:ch.careerHistory.map(e=>e.key).concat(c.company!.history.filter(e=>e.actorId===ch.id).slice(-12).map(e=>e.key)),outcome});}
export function endCareer(c:Campaign,outcome:Outcome){if(c.life?.ended)return;archiveCareer(c,outcome);c.life!.ended=outcome;c.phase='ended';player(c).playable=false;if(outcome==='fired'||outcome==='quit')player(c).employed=false;}
export function decision(c:Campaign,kind:keyof DecisionStats){const l=c.life!;l.decisions[kind]++;l.decisionHistory.push({day:l.calendarDay,kind});l.decisionHistory=l.decisionHistory.slice(-200);}
export function recentIssues(c:Campaign){const l=c.life!;return l.decisionHistory.filter(e=>l.calendarDay-e.day<=14).reduce((a,e)=>{a[e.kind]++;return a},emptyDecisions());}
export function changeTrust(c:Campaign,id:string,amount:number){const ch=player(c);let r=ch.relationships.find(x=>x.characterId===id);if(!r){r={characterId:id,trust:20};ch.relationships.push(r);}r.trust=cap(r.trust+amount);}
export function selectPriority(c:Campaign,id:WorkKind,explained:boolean){const l=c.life!;if(c.phase!=='office'||l.queue.some(q=>q.status==='selected'&&!q.delegatedTo)||c.tasks.some(t=>t.id===c.activeTaskId&&!t.rewarded))return false;const item=l.queue.find(q=>q.id===id&&q.status==='waiting');if(!item||!availableWork(player(c)).includes(id))return false;item.status='selected';item.explained=explained;c.time+=explained?15:2;if(!explained)decision(c,'communicationFailures');return true;}
export function closeWorkDay(c:Campaign){ensureLife(c);const l=c.life!,ch=player(c),selected=l.queue.find(q=>q.status==='selected'||q.status==='done');if(selected){const side=roleSides[ch.profession]??'development';c.meta!.perspectives[side]=[...new Set([...(c.meta!.perspectives[side]??[]),selected.id])];const impact=selected.explained?2:5;for(const q of l.queue){if(q===selected||q.status==='done'||q.delegatedTo||!availableWork(ch).includes(q.id))continue;if(q.urgency>=4){if(q.id==='bug'){decision(c,'ignoredQa');changeTrust(c,'max',-impact);if((c.company!.seed+l.calendarDay*13)%100<35)c.company!.stability=cap(c.company!.stability-5);}if(q.id==='review'){decision(c,'ignoredReview');changeTrust(c,'ilya',-impact);}if(q.id==='feature'){decision(c,'deadlineFailures');changeTrust(c,'oleg',-impact);}if(q.id==='debt')c.company!.techDebt=cap(c.company!.techDebt+4);if(q.id==='support'){ch.stats.reputation--;changeStress(ch,2);}}}const owner:Record<WorkKind,string>={bug:'max',feature:'oleg',debt:'sergey',review:'ilya',support:'anya'};if(selected.status==='done')changeTrust(c,owner[selected.id],5);if(selected.status==='done'&&selected.id==='debt')c.company!.techDebt=cap(c.company!.techDebt-8);if(selected.status==='done'&&(selected.id==='bug'||selected.id==='support'))c.company!.stability=cap(c.company!.stability+5);}
 queuePressure(c);const overtime=Math.max(0,Math.floor((c.time-gameConfig.clock.workdayEnd)/30));const comfort=(homeState(ch).owned.includes('chair')?2:0)+(homeState(ch).owned.includes('monitor')?2:0);changeStress(ch,Math.max(0,overtime*gameConfig.stress.overtimePerHalfHour-comfort)+loadStress(c));chargeLivingCosts(c);l.characterPlayedDays++;const today=l.decisionHistory.filter(e=>e.day===l.calendarDay);const responsible=!today.some(e=>['technicalMistakes','repeatedMistakes','riskyDeploys','communicationFailures'].includes(e.kind))&&(selected?.explained||today.length===0);if(responsible){l.goodDays++;if(l.goodDays>=3){l.reviewStage=Math.max(0,l.reviewStage-1);l.goodDays=0;changeTrust(c,'sergey',6);}}else l.goodDays=0;const issues=recentIssues(c);const serious=issues.ignoredQa+issues.ignoredReview+issues.riskyDeploys+issues.communicationFailures+issues.repeatedMistakes;if(serious>=4&&l.decisionHistory.some(e=>e.day>l.reviewedAt)&&l.calendarDay-l.reviewedAt>=5)l.reviewDue=true;
 updateMeta(c);}
export function reviewResponse(c:Campaign,accept:boolean){const l=c.life!,ch=player(c);if(!l.reviewDue)return;l.reviewDue=false;l.reviewedAt=l.calendarDay;l.reviewStage=Math.min(4,l.reviewStage+1);changeTrust(c,'sergey',accept?2:-8);changeStress(ch,accept?gameConfig.stress.performanceAccepted:gameConfig.stress.performanceRejected);if(!accept){decision(c,'communicationFailures');}c.company!.history.push({id:`review:${ch.id}:${l.calendarDay}:${l.reviewStage}`,day:l.calendarDay,kind:'performance-review',key:'life.stage'+Math.min(3,l.reviewStage),actorId:ch.id,values:{stage:l.reviewStage,accepted:accept?1:0}});if(l.reviewStage>=4)endCareer(c,'fired');updateMeta(c);}
export function applyWorldEvent(c:Campaign){const l=c.life!,ch=player(c),id=worldEventIds[(c.company!.seed+Math.floor(l.calendarDay/14))%worldEventIds.length];l.worldEvents.push({id,day:l.calendarDay,until:l.calendarDay+(id==='payroll'?3:id==='move'?2:5)});l.worldEvents=l.worldEvents.slice(-30);l.nextEventDay=l.calendarDay+14;if(id==='rent')l.livingCost+=100;if(id==='director')c.company!.processMaturity=cap(c.company!.processMaturity+8);if(id==='audit')c.company!.projects.forEach(p=>p.securityLevel=cap(p.securityLevel+6));if(id==='sick'&&careerRank(ch)>=2)ch.skills.leadership++;}
export const eventActive=(c:Campaign,id:string)=>c.life!.worldEvents.some(e=>e.id===id&&e.until>c.life!.calendarDay);
export const isWorkday=(day:number)=>{const weekday=new Date(Date.UTC(2026,0,day)).getUTCDay();return weekday!==0&&weekday!==6;};
export function chargeLivingCosts(c:Campaign){const l=c.life!,ch=player(c);if(l.lastExpenseCalendarDay===l.calendarDay)return 0;const cost=Math.min(ch.stats.money,Math.max(0,l.livingCost-600));ch.stats.money-=cost;l.lastExpenseCalendarDay=l.calendarDay;return cost;}
export function settleCalendarDay(c:Campaign,workedDay=false){const income=payWork(c,workedDay),expenses=chargeLivingCosts(c),personal=settlePersonalFinance(c);return {salary:income,income:income+personal.income,expenses:expenses+personal.expenses};}
export function payWork(c:Campaign,workedDay=false){const l=c.life!,ch=player(c);if(l.lastPaidCalendarDay===l.calendarDay)return 0;l.lastPaidCalendarDay=l.calendarDay;if(!workedDay&&!isWorkday(l.calendarDay))return 0;const pay=dailySalary(ch);if(eventActive(c,'payroll')){l.salaryHeld+=pay;return 0;}ch.stats.money+=pay;return pay;}
export function advanceCalendar(c:Campaign){ensureLife(c);const l=c.life!,ch=player(c);l.calendarDay++;l.daysAtCompany++;resolveResponsibilities(c);resolveDecisions(c);resolveSceneConsequences(c);if(isWorkday(l.calendarDay))expectationPressure(c);if(l.salaryHeld&&!eventActive(c,'payroll')){ch.stats.money+=l.salaryHeld;l.salaryHeld=0;}if(!l.montage&&eventActive(c,'heat'))changeStress(ch,gameConfig.stress.heatPerDay);if(eventActive(c,'audit')||eventActive(c,'move'))changeStress(ch,gameConfig.stress.disruptionPerDay);if(l.calendarDay>=l.nextEventDay)applyWorldEvent(c);updateMeta(c);}
/** Sleep/absence returns start a new unpaid workday, never an already settled day. */
export function advanceToNextWorkday(c:Campaign){
 c.time=gameConfig.clock.workdayStart;
 let days=0,income=0,expenses=0;
 advanceCalendar(c);
 while(!isWorkday(c.life!.calendarDay)){
  const settled=settleCalendarDay(c);income+=settled.income;expenses+=settled.expenses;days++;
  const ch=player(c);changeStress(ch,-gameConfig.stress.routineRestDay);ch.stats.energy=100;
  advanceCalendar(c);
 }
 c.life!.weekendSkip=days?{days,income,expenses}:undefined;
}
export function montage(c:Campaign,vacation=false){ensureLife(c);if(vacation)return takeVacation(c,7);const l=c.life!,ch=player(c);if(c.phase!=='home'||c.tasks.some(t=>t.id===c.activeTaskId&&!t.rewarded)||l.reviewDue||l.montage||(!vacation&&(l.characterPlayedDays-(l.lastMontagePlayedDay??0)<3))||(vacation&&ch.stats.money<5000))return false;let income=0,expenses=vacation?5000:0,days=0,stop='life.continue';if(vacation)ch.stats.money-=5000;for(let i=0;i<(vacation?7:20);i++){const eventDay=l.worldEvents.at(-1)?.day;advanceCalendar(c);days++;const settled=settleCalendarDay(c);income+=settled.income;expenses+=settled.expenses;if(l.queue.some(q=>q.expectation?.state==='escalated')){stop='expect.reaction.escalated';break;}if(l.worldEvents.at(-1)?.day!==eventDay){stop='life.event.'+l.worldEvents.at(-1)!.id;break;}if(!vacation&&isWorkday(l.calendarDay)){c.company!.techDebt=cap(c.company!.techDebt+(c.company!.culture==='fast'?2:1));c.company!.projects.forEach(p=>{p.techDebt=cap(p.techDebt+1);p.maturity=cap(p.maturity+.2);p.stability=cap(p.stability-(p.techDebt>70?1:0));});const rest=recovery(ch);ch.stats.energy=cap(ch.stats.energy-20+rest.energy);ch.stats.stress=stressAfterRecovery(ch.stats.stress,gameConfig.stress.routineWorkday,rest.stress);ch.skills.craft=Math.round((ch.skills.craft+.1)*10)/10;changeTrust(c,'ilya',1);}else {changeStress(ch,-(vacation?7:gameConfig.stress.routineRestDay));ch.stats.energy=100;}if(ch.stats.stress>=100){endCareer(c,'burnout');stop='life.burnout';break;}if(!vacation&&ch.stats.stress>=85){stop='life.warning85';break;}if(!vacation&&c.company!.techDebt>=85){c.company!.stability=cap(c.company!.stability-8);stop='life.officeIncident';break;}}
 if(!vacation)l.lastMontagePlayedDay=l.characterPlayedDays;l.montage={days,income,expenses,stop};updateMeta(c);return true;}
export function finishLife(c:Campaign){if(!c.company)return;ensureLife(c);c.life!.reportMaxStress=Math.max(c.life!.reportMaxStress??0,player(c).stats.stress);updateMeta(c);if(player(c).stats.stress>=100&&!c.life!.ended)endCareer(c,'burnout');}

export function takeVacation(c:Campaign,days:3|7|14=7,arrangements?:VacationArrangements){
 ensureLife(c);const l=c.life!,ch=player(c);if(c.phase!=='home'||l.montage||l.ended)return false;
 let returnDay=l.calendarDay,workdays=0;while(workdays<days){returnDay++;if(isWorkday(returnDay))workdays++;}
 const absence=arrangeAbsence(c,returnDay,arrangements),before=ch.stats.stress,summary=['recovery.return',...absence.summary];
 let income=0,expenses=0;const startDay=l.calendarDay;
 while(l.calendarDay<returnDay){
  // Recover before consequences: leave remains useful even near the stress limit.
  changeStress(ch,-gameConfig.stress.vacationRecoveryPerDay);advanceCalendar(c);
  const settled=settleCalendarDay(c);income+=settled.income;expenses+=settled.expenses;
  c.company!.projects.forEach(p=>{p.maturity=cap(p.maturity+0.5);});
  for(const q of l.queue)if(q.status!=='done')q.age=(q.age??0)+1;
 }
 if(c.company!.delegations?.some(d=>d.actorId===ch.id&&d.status==='returned'))summary.push('absence.results');
 if(absence.unagreed.length&&c.company!.history.filter(e=>e.kind==='absence-unagreed'&&e.actorId===ch.id).length>=2)l.reviewDue=true;
 summary.push('recovery.projectMoved');l.vacations??=[];l.vacations.push({day:l.calendarDay,days,before,after:ch.stats.stress,summary:[...new Set(summary)]});
 c.company!.currentDay+=days-1;l.montage={days:l.calendarDay-startDay,income,expenses,stop:'recovery.return',summary:[...new Set(summary)]};updateMeta(c);return true;
}
