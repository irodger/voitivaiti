import {gameConfig} from '../config/game';
import type {Character} from './types';
export const eveningActivities=gameConfig.evening;
export type EveningActivity=keyof typeof eveningActivities;
export const eveningEndsAt=gameConfig.clock.eveningEnd;
export function eveningDone(ch:Character,day:number):EveningActivity[]{
 if(ch.home?.eveningDay!==day)return [];
 // Older saves recorded only that an activity happened, not which one.
 return ch.home.eveningActions??[];
}
export function canSpendEvening(ch:Character,day:number,time:number,id:EveningActivity){
 return !eveningDone(ch,day).includes(id)&&time+eveningActivities[id]<=eveningEndsAt;
}
