import '../content/corrections';
import '../content/mastery';
import '../content/recovery';
import '../content/responsibility';
import { DelegationResults } from './DelegationResults';
import { Button,characterName,Modal } from './shared';
import { useMontagePlayback } from './useMontagePlayback';
import { useRoutinePanel } from './useRoutinePanel';

export function RoutinePanel(){
 const {prepareLeave,setArrangement,obligations,startVacation,w,t,l,ch,leave,setLeave,ready}=useRoutinePanel();
return <div className="routine-panel"><h3>{t('life.montage')}</h3><p>{t('life.montageHint')}</p><Button secondary disabled={w.phase!=='home'||w.tasks.some(t=>t.id===w.activeTaskId&&!t.rewarded)||l.reviewDue||!ready||!!l.montage} onClick={()=>w.dispatch({type:'montage'})}>{t('life.montage')}</Button>{!ready&&<small>{t('life.montageLocked')}</small>}<p>{t('recovery.vacationHint')}</p>{ch.stats.stress>=65&&<p>{t('recovery.home')}</p>}{([3,7,14] as const).map(days=><Button key={days} secondary disabled={w.phase!=='home'||!!l.montage} onClick={()=>prepareLeave(days)}>{t('recovery.vacation',{days})}</Button>)}<DelegationResults/>{leave&&<Modal title={t('absence.title')} onClose={()=>setLeave(null)}><p>{t('absence.hint')}</p>{obligations.map(({q,npc,value,canPostpone})=>{return <div className="world-card" key={q.id}><label>{t('life.work.'+q.id)}<select aria-label={t('life.work.'+q.id)} value={value} onChange={e=>setArrangement(q.id,e.target.value)}><option value="ignore">{t('absence.ignore')}</option>{npc&&<option value={"handoff:"+npc.id}>{t('absence.handoff',{name:characterName(npc,t)})}</option>}{canPostpone&&<option value="postpone">{t('absence.postpone')}</option>}</select></label>{!canPostpone&&<small>{t('absence.limits')}</small>}</div>;})}<Button onClick={startVacation}>{t('absence.start',{days:leave})}</Button></Modal>}{l.montage&&<MontagePlayback/>}</div>}

function MontagePlayback(){
 const {w,t,result,frame,setFrame}=useMontagePlayback();
return <Modal title={t('life.montage')} onClose={()=>w.dispatch({type:'montage-close'})}><div className="montage-result" role="status">{frame<result.days?<><p className="routine-animation">{t('life.routine')}</p><h3>{t('ui.day',{day:w.life!.calendarDay-result.days+frame})}</h3><progress max={result.days} value={frame}/><Button secondary onClick={()=>setFrame(result.days)}>{t('ui.skip')}</Button></>:<><h3>{t(result.stop)}</h3><p>{t('life.montageResult',{days:result.days,income:result.income,expenses:result.expenses})}</p>{result.summary?.filter(k=>k!==result.stop).map(k=><p key={k}>{t(k)}</p>)}<Button onClick={()=>w.dispatch({type:'montage-close'})}>{t('life.continue')}</Button></>}</div></Modal>}
