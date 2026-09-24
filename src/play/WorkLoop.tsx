import '../content/workLoop';
import {useWorld} from '../world/store';
import {activeCharacter,activeTask,plannedTemplateId} from '../world/simulation';
import {autonomy} from '../world/workLoop';
import {templateById} from '../content/scenarios';
import {useI18n} from '../content/localization';
import {Button,Speech} from './shared';
import {RemainderQueue} from './RemainderQueue';
export function MorningSync({eventId}:{eventId:string}){const w=useWorld(),ch=activeCharacter(w),task=activeTask(w),{t}=useI18n(),level=autonomy(ch),current=task&&!task.rewarded,template=templateById[current?task.templateId:plannedTemplateId(w)];return <><Speech>{t(current?'loop.current':level===0?'loop.assigned':level===4?'loop.lead':'loop.independent',{task:t(template.titleKey)})}</Speech><p>{t('loop.autonomy'+level)}</p>{level===0&&<p>{t(template.descriptionKey)}</p>}{(['plan','clarify','help'] as const).map(id=><Button secondary={id!=='plan'} key={id} onClick={()=>w.dispatch({type:'event',id:eventId,choiceId:id})}>{t('loop.'+(id==='plan'?'accept':id))}</Button>)}</>}
export function EndWorkButton(){const w=useWorld(),ch=activeCharacter(w),{t}=useI18n();if(!ch.firstDay?.onboardingCompleted||w.phase!=='office'||w.schedule.some(e=>e.type==='sync'&&e.status==='pending'))return null;return <Button secondary onClick={()=>w.dispatch({type:'end-day'})}>{t('loop.finish')}</Button>}
export function WorkRemainder(){const {t}=useI18n();return <div className="work-remainder"><small>{t('fix.closed')}</small><h1>{t('fix.next')}</h1><p>{t('fix.queue')}</p><RemainderQueue/></div>}
