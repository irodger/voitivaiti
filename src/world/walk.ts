import type {Character} from './types';
import {eveningDone,eveningEndsAt} from './evening';

export const walkRoutes=[
 {id:'courtyard',minutes:20,stress:3,x:27,y:65},
 {id:'park',minutes:45,stress:7,x:66,y:62},
 {id:'river',minutes:70,stress:10,x:83,y:36},
] as const;
export type WalkRouteId=typeof walkRoutes[number]['id'];
export type WalkState={day:number;status:'choosing'|'finished';routeId?:WalkRouteId;observationKey?:string;minutes?:number;stressBefore?:number;stressAfter?:number};
export function currentWalk(ch:Character,day:number){return ch.home?.walk?.day===day?ch.home.walk:undefined;}
export function availableWalkRoutes(ch:Character,day:number,time:number){
 if(eveningDone(ch,day).includes('walk'))return [];
 return walkRoutes.filter(route=>time+route.minutes<=eveningEndsAt);
}
export function canBeginWalk(ch:Character,day:number,time:number){return !currentWalk(ch,day)&&availableWalkRoutes(ch,day,time).length>0;}
