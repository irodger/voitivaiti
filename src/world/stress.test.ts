import {afterEach,describe,it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {gameConfig} from '../config/game';
import {stressGain,stressAfter,stressAfterRecovery} from './stress';
import {applyEffects} from './effects';
import {transition} from './engine';
import {activeCharacter,emptyCampaign} from './simulation';
import {advanceCalendar,reviewResponse} from './life';
import {expectationPressure} from './expectations';
import {resolveDecisions} from './decisions';
import type {Feedback} from './types';
const original=gameConfig.stress.gainMultiplier;
afterEach(()=>{gameConfig.stress.gainMultiplier=original;});
function start(){return transition(emptyCampaign(),{type:'new',name:'Config',avatarId:'1',professionId:'frontend',seed:1427}).campaign;}
describe('configurable stress gains',()=>{
 it('scales gains without weakening recovery, including fractional and invalid tuning',()=>{
  expect(stressAfter(20,4,0)).toBe(20);expect(stressAfter(20,4,2)).toBe(28);
  expect(stressAfter(20,3,.5)).toBe(21.5);expect(stressAfter(20,-6,0)).toBe(14);
  expect(stressAfter(99,4,2)).toBe(100);expect(stressAfter(3,-6,2)).toBe(0);
  expect(stressGain(4,NaN)).toBe(4);expect(stressGain(4,-2)).toBe(0);
 });
 it('effect feedback reflects the actual scaled and clamped delta only once',()=>{
  const c=start(),ch=activeCharacter(c),feedback:Feedback[]=[];ch.stats.stress=98;gameConfig.stress.gainMultiplier=2;
  applyEffects(c,[{target:'stress',value:4},{target:'stress',value:-6}],feedback,'evening',false);
  expect(ch.stats.stress).toBe(94);expect(feedback.map(f=>f.value)).toEqual([2,-6]);expect(feedback.map(f=>f.good)).toEqual([false,true]);
 });
 it('daily events and performance review respect the same gain multiplier',()=>{
  const c=start(),ch=activeCharacter(c);ch.stats.stress=20;gameConfig.stress.gainMultiplier=2;
  c.life!.worldEvents=[{id:'heat',day:1,until:10}];advanceCalendar(c);expect(ch.stats.stress).toBe(28);
  c.life!.reviewDue=true;reviewResponse(c,true);expect(ch.stats.stress).toBe(34);
 });
 it('overdue expectations and delayed consequences cannot bypass the coefficient',()=>{
  const c=start(),ch=activeCharacter(c);ch.stats.stress=20;gameConfig.stress.gainMultiplier=0;
  c.life!.calendarDay=4;c.life!.queue[0].expectation={state:'waiting',dueDay:1};expectationPressure(c);expect(ch.stats.stress).toBe(20);
  const project=c.company!.projects[0];c.life!.professionalDecisions=[{decisionId:'test',choiceId:'bounded',choiceLabelKey:'test',profession:ch.profession,characterId:ch.id,companyId:c.company!.id,projectId:project.id,day:1,minute:540,npcId:'max',tags:[],immediateEffects:[],delayedEffects:[{target:'stress',value:5}],dueDay:4,resolved:false,context:{stability:80,techDebt:20,culture:'calm'}}];
  resolveDecisions(c);expect(ch.stats.stress).toBe(20);expect(c.life!.professionalDecisions[0].resolved).toBe(true);
 });
 it('a stored stress value is not rescaled on reload or initialization',()=>{
  const c=start();activeCharacter(c).stats.stress=73;gameConfig.stress.gainMultiplier=2;
  expect(activeCharacter(transition(c,{type:'rename',name:'Same hero'}).campaign).stats.stress).toBe(73);
 });
 it('mixed routine load and rest scale only the load once, with one final clamp',()=>{
  gameConfig.stress.gainMultiplier=2;
  expect(stressAfterRecovery(20,7,6)).toBe(28);
  expect(stressAfterRecovery(98,7,12)).toBe(100);
  gameConfig.stress.gainMultiplier=0;
  expect(stressAfterRecovery(20,7,6)).toBe(14);
 });
 it('the real end-day transition scales overtime while sleep recovery stays unchanged',()=>{
  for(const factor of [0,.5,2]){
   const c=start();c.schedule=[];c.time=gameConfig.clock.workdayEnd+30;activeCharacter(c).firstDay!.onboardingCompleted=true;activeCharacter(c).firstDay!.currentOnboardingStep='done';activeCharacter(c).stats.stress=20;
   gameConfig.stress.gainMultiplier=factor;
   const ended=transition(c,{type:'end-day'}).campaign;
   expect(activeCharacter(ended).stats.stress).toBe(20+4*factor);
   const slept=transition(ended,{type:'sleep'}).campaign;
   expect(activeCharacter(slept).stats.stress).toBe(14+4*factor);
  }
 });
});
