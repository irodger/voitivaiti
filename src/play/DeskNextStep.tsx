import './deskNextStep.css';
import '../content/progressionUx';
import {activeCharacter} from '../world/simulation';
import {deskAvailability} from '../world/deskAvailability';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {Button} from './shared';
import {PerformancePanel} from './PerformancePanel';
export function DeskNextStep({onOffice}:{onOffice?:()=>void}){
 const w=useWorld(),{t}=useI18n(),state=deskAvailability(w),ch=activeCharacter(w);const canEnd=w.phase==='office'&&(ch.firstDay&&!ch.firstDay.onboardingCompleted?!w.schedule.some(e=>e.status==='pending'):!state.pending.some(e=>e.type==='sync'));
 return <div className="desk-next-step">
 {state.reason==='review'?<PerformancePanel/>:state.reason==='empty'?<><h3>{t('flow.empty')}</h3><p>{t('flow.emptyBody')}</p>{state.locked>0&&<p>{t('flow.locked',{count:state.locked})}</p>}</>:state.reason==='offDuty'?<p>{t('flow.offDuty')}</p>:null}
 {state.pending[0]&&onOffice&&<><p>{t('flow.pending',{event:t(state.pending[0].key)})}</p><Button secondary onClick={onOffice}>{t('flow.office')}</Button></>}
 {canEnd&&<Button secondary onClick={()=>{w.dispatch({type:'end-day'});onOffice?.();}}>{t('flow.finish')}</Button>}
 </div>;
}
