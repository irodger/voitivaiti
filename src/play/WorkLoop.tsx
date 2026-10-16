import { useI18n } from '../content/localization';
import '../content/workLoop';
import { ActionDock } from './ActionDock';
import { MorningBriefing } from './MorningBriefing';
import { RemainderQueue } from './RemainderQueue';
import { Button,Speech } from './shared';
import { useEndWorkButton } from './useEndWorkButton';
import { useMorningSync } from './useMorningSync';
export function MorningSync({eventId}:{eventId:string}){
const {w,t,level,current,template}=useMorningSync();
return <><MorningBriefing/><Speech>{t(current?'loop.current':level===0?'loop.assigned':level===4?'loop.lead':'loop.independent',{task:t(template.titleKey)})}</Speech><p>{t('loop.autonomy'+level)}</p>{level===0&&<p>{t(template.descriptionKey)}</p>}<ActionDock><div className="event-choices">{(['plan','clarify','help'] as const).map(id=><Button secondary={id!=='plan'} key={id} onClick={()=>w.dispatch({type:'event',id:eventId,choiceId:id})}>{t('loop.'+(id==='plan'?'accept':id))}</Button>)}</div></ActionDock></>}
export function EndWorkButton(){
const model=useEndWorkButton();if(!model)return null;const {w,t}=model;
return <ActionDock active={w.schedule.every(e=>e.status==='completed')}><Button secondary onClick={()=>w.dispatch({type:'end-day'})}>{t('loop.finish')}</Button></ActionDock>}
export function WorkRemainder(){const {t}=useI18n();return <div className="work-remainder"><small>{t('fix.closed')}</small><h1>{t('fix.next')}</h1><p>{t('fix.queue')}</p><RemainderQueue/></div>}
