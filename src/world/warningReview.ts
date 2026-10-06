import type {Campaign} from './types';
/** Preserve what was discussed; a later reply is not retroactively a warning reason. */
export function warningReviewDetails(c:Campaign){
 const review=[...(c.company?.history??[])].reverse().find(e=>e.kind==='performance-review'&&e.actorId===c.activeCharacterId);
 if(!review||review.values?.issuesRecorded!==1)return null;
 const issues=Object.entries(review.values).filter(([key,value])=>key.startsWith('issue.')&&typeof value==='number'&&value>0).map(([key,value])=>({key:key.slice(6),count:Number(value)}));
 return {day:review.day,issues};
}
