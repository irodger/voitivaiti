import type {Character} from './types';
export const eveningActivities={walk:45,cook:40,read:60,games:60} as const;
export type EveningActivity=keyof typeof eveningActivities;
export const eveningEndsAt=24*60;
export function eveningDone(ch:Character,day:number):EveningActivity[]{
 if(ch.home?.eveningDay!==day)return [];
 // Older saves recorded only that an activity happened, not which one.
 return ch.home.eveningActions??[];
}
export function canSpendEvening(ch:Character,day:number,time:number,id:EveningActivity){
 return !eveningDone(ch,day).includes(id)&&time+eveningActivities[id]<=eveningEndsAt;
}
