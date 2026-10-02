import {MetaMap} from './MetaMap';
import '../content/mastery';
import '../content/recovery';
import '../content/corrections';
import {autonomy} from '../world/workLoop';
import {useState} from 'react';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {useI18n} from '../content/localization';
import {Button,Modal} from './shared';

export function CareerPacing(){const w=useWorld(),ch=activeCharacter(w),l=w.life!,{t}=useI18n(),[map,setMap]=useState(false),[ending,setEnding]=useState(false);return <><div className="career-pacing"><p>{t('loop.autonomy'+autonomy(ch))}</p><p>{t('mastery.context',{days:l.calendarDay-l.roleStartedDay})}</p>{l.reviewStage>0&&<p>{t('life.stage'+Math.min(3,l.reviewStage))} · {t('life.reviewRecovery')}</p>}<div className="life-actions"><Button secondary onClick={()=>setMap(true)}>{t('life.map')}</Button><Button secondary onClick={()=>setEnding(true)}>{t('life.end')}</Button></div></div>{map&&<Modal title={t('life.map')} onClose={()=>setMap(false)}><MetaMap/></Modal>}{ending&&<Modal title={t('life.end')} onClose={()=>setEnding(false)}><p>{t(w.life!.ended==='burnout'?'recovery.burnout':'life.confirmEnd')}</p><Button onClick={()=>{w.dispatch({type:'quit'});setEnding(false);}}>{t('life.end')}</Button></Modal>}</>}
