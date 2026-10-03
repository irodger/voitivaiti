import type {Campaign,Character} from './types';
// Authored roster names carry identity; ambiguous names keep their existing appearance.
const female=new Set([0,2,4,6,8,10,12,14,16]);
const male=new Set([1,3,5,7,9,11,13,15,17]);
export function matchColleagueAppearance(ch:Character):Character{
 const index=ch.name.startsWith('roster.name.')?Number(ch.name.slice('roster.name.'.length)):null;
 const gender=index!==null?(female.has(index)?'female':male.has(index)?'male':null):ch.id.startsWith('candidate-')?(['Мира','Ника'].includes(ch.name)?'female':['Ян'].includes(ch.name)?'male':null):null;
 if(!gender)return ch;
 const avatar=Number(ch.avatarId)||0,base=avatar%6,isFemale=base===1||base===5;
 if((gender==='female')===isFemale)return ch;
 const replacement=gender==='female'?(base%2?5:1):(base===1?0:3);
 return {...ch,avatarId:String(Math.floor(avatar/6)*6+replacement)};
}
export function restoreColleagueAppearances(c:Campaign){c.characters=c.characters.map(matchColleagueAppearance);return c;}
