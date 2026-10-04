import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {eveningActivities,eveningDone,canSpendEvening,type EveningActivity} from '../world/evening';
import {canBeginWalk} from '../world/walk';
/** Scene hotspots and the text panel share availability and the same dispatch path. */
export function useEveningActivities(){
 const w=useWorld(),ch=activeCharacter(w),day=w.company!.currentDay;
 const done=eveningDone(ch,day),ids=Object.keys(eveningActivities) as EveningActivity[];
 const available=(id:EveningActivity)=>id==='walk'?canBeginWalk(ch,day,w.time):canSpendEvening(ch,day,w.time,id);
 const act=(id:EveningActivity)=>w.dispatch(id==='walk'?{type:'start-walk'}:{type:'evening',id});
 return {done,ids,available,act,hasActivity:ids.some(available),minutes:eveningActivities};
}
