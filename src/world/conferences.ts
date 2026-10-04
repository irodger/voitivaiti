import {gameConfig} from '../config/game';
import type {Campaign} from './types';
import {activeCharacter} from './simulation';
import {professionById} from '../content/professions';
import {financeState,applyPersonalEvent} from './personalFinance';
export type ConferenceVisit={id:string;day:number;profession:string;mode:'online'|'visit'|'skip';topic:'evidence'|'handoff'};
export function conferenceOffer(c:Campaign){
 const ch=activeCharacter(c),rank=professionById[ch.profession].careers.findIndex(n=>n.id===ch.careerNodeId);
 if(rank<2||!c.life)return null;
 const last=ch.conferences?.at(-1),day=c.life.calendarDay;
 if(last&&day<last.day+45)return null;
 return {id:ch.id+':conference:'+String(ch.conferences?.length??0),day};
}
export function conferenceBlock(c:Campaign,mode:'online'|'visit'){
 if(c.phase!=='office')return 'office';
 if(c.schedule.some(e=>e.type==='sync'&&e.status==='pending'))return 'sync';
 if(c.schedule.some(e=>e.type==='incident'&&e.status==='pending'))return 'incident';
 if(c.time+(mode==='visit'?180:90)>gameConfig.clock.workdayEnd)return 'time';
 if(mode==='visit'&&activeCharacter(c).stats.money<4000)return 'money';
 return null;
}
export function attendConference(c:Campaign,mode:'online'|'visit'|'skip',topic:'evidence'|'handoff'){
 const offer=conferenceOffer(c);if(!offer||mode!=='skip'&&conferenceBlock(c,mode))return false;
 const ch=activeCharacter(c);
 (ch.conferences??=[]).push({...offer,profession:ch.profession,mode,topic});
 if(mode!=='skip'){
  c.time+=mode==='visit'?180:90;
  if(mode==='visit')applyPersonalEvent(ch,financeState(ch,offer.day),offer.day,'conference',-4000);
 }
 return true;
}
