import '../content/corrections';
import '../content/mastery';
import '../content/recovery';
import { autonomy } from '../world/workLoop';
import { MetaMap } from './MetaMap';
import { Button,Modal } from './shared';
import { useCareerPacing } from './useCareerPacing';

export function CareerPacing(){
 const {endCareer,w,ch,l,t,map,setMap,ending,setEnding}=useCareerPacing();
return <><div className="career-pacing"><p>{t('loop.autonomy'+autonomy(ch))}</p><p>{t('mastery.context',{days:l.calendarDay-l.roleStartedDay})}</p>{l.reviewStage>0&&<p>{t('life.stage'+Math.min(3,l.reviewStage))} · {t('life.reviewRecovery')}</p>}<div className="life-actions"><Button secondary onClick={()=>setMap(true)}>{t('life.map')}</Button><Button secondary onClick={()=>setEnding(true)}>{t('life.end')}</Button></div></div>{map&&<Modal title={t('life.map')} onClose={()=>setMap(false)}><MetaMap/></Modal>}{ending&&<Modal title={t('life.end')} onClose={()=>setEnding(false)}><p>{t(w.life!.ended==='burnout'?'recovery.burnout':'life.confirmEnd')}</p><Button onClick={endCareer}>{t('life.end')}</Button></Modal>}</>}
