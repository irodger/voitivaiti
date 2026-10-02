import '../content/mastery';
import '../content/recovery';
import '../content/corrections';
import {useState,useEffect} from 'react';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {useI18n} from '../content/localization';
import {Button,Modal} from './shared';

export function RoutinePanel(){const w=useWorld(),{t}=useI18n(),l=w.life!,ch=activeCharacter(w),ready=l.characterPlayedDays-(l.lastMontagePlayedDay??0)>=3;return <div className="routine-panel"><h3>{t('life.montage')}</h3><p>{t('life.montageHint')}</p><Button secondary disabled={w.phase!=='home'||w.tasks.some(t=>t.id===w.activeTaskId&&!t.rewarded)||l.reviewDue||!ready||!!l.montage} onClick={()=>w.dispatch({type:'montage'})}>{t('life.montage')}</Button>{!ready&&<small>{t('life.montageLocked')}</small>}<p>{t('recovery.vacationHint')}</p>{ch.stats.stress>=65&&<p>{t('recovery.home')}</p>}{([3,7,14] as const).map(days=><Button key={days} secondary disabled={w.phase!=='home'||!!l.montage} onClick={()=>w.dispatch({type:'vacation',days})}>{t('recovery.vacation',{days})}</Button>)}{l.montage&&<MontagePlayback/>}</div>}

function MontagePlayback(){const w=useWorld(),{t}=useI18n(),result=w.life!.montage!,[frame,setFrame]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches?result.days:0);useEffect(()=>{if(frame>=result.days)return;const timer=setTimeout(()=>setFrame(n=>n+1),Math.max(90,650-frame*75));return()=>clearTimeout(timer)},[frame,result.days]);return <Modal title={t('life.montage')} onClose={()=>w.dispatch({type:'montage-close'})}><div className="montage-result" role="status">{frame<result.days?<><p className="routine-animation">{t('life.routine')}</p><h3>{t('ui.day',{day:w.life!.calendarDay-result.days+frame})}</h3><progress max={result.days} value={frame}/><Button secondary onClick={()=>setFrame(result.days)}>{t('ui.skip')}</Button></>:<><h3>{t(result.stop)}</h3><p>{t('life.montageResult',{days:result.days,income:result.income,expenses:result.expenses})}</p>{result.summary?.filter(k=>k!==result.stop).map(k=><p key={k}>{t(k)}</p>)}<Button onClick={()=>w.dispatch({type:'montage-close'})}>{t('life.continue')}</Button></>}</div></Modal>}
