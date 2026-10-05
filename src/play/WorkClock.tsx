import '../content/workClock';
import {Clock3,Moon,TriangleAlert} from 'lucide-react';
import {useI18n} from '../content/localization';
import {useWorld} from '../world/store';
import {workClock} from '../world/workClock';
import './workClock.css';
export function WorkClock({onFinish}:{onFinish:()=>void}){
 const w=useWorld(),{t}=useI18n();if(w.phase!=='office')return null;
 const clock=workClock(w);
 return <section className="work-clock" data-late={clock.nearEnd||undefined} aria-label={t('workClock.title')}><div><Clock3 size={18}/><b>{t(clock.remaining>0?'workClock.left':'workClock.over',{minutes:clock.remaining>0?clock.remaining:clock.overtime})}</b><meter min={0} max={clock.duration} value={clock.spent} aria-label={t('workClock.title')}/></div>{clock.nearEnd&&<><p><TriangleAlert size={16}/>{t(clock.canFinish?'workClock.note':'workClock.first')}</p>{clock.canFinish&&<button className="world-secondary" onClick={()=>{w.dispatch({type:'end-day'});if(useWorld.getState().phase==='home')onFinish();}}><Moon size={16}/>{t('workClock.finish')}</button>}</>}</section>;
}
