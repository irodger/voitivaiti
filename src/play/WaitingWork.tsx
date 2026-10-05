import '../content/waitingWork';
import './waitingWork.css';
import {Clock3,CheckCircle2} from 'lucide-react';
import {CharacterAvatar} from '../components/CharacterAvatar';
import {formatCalendarDate,formatTime} from '../utils/format';
import {waitingTask} from '../world/waitingTask';
import {useWorld} from '../world/store';
import {resolveTaskTemplate} from '../content/scenarios';
import {useI18n} from '../content/localization';
import {Button,characterName} from './shared';
export function WaitingWork(){
 const w=useWorld(),{t,locale}=useI18n();
 return <>{w.tasks.filter(task=>task.paused&&!task.rewarded&&task.characterId===w.activeCharacterId).map(task=>{
  const state=waitingTask(w,task),npc=w.characters.find(ch=>ch.id===state.dependency?.npcId),Icon=state.ready?CheckCircle2:Clock3;
  return <article className="waiting-work-card" data-ready={state.ready||undefined} key={task.id}>
   <header><Icon size={18}/><b>{t(state.ready?'waitingWork.ready':'waitingWork.pending')}</b><small>{t('waitingWork.saved')}</small></header>
   <h4>{t(resolveTaskTemplate(task).titleKey)}</h4>
   {state.dependency&&<div className="waiting-work-person">{npc&&<CharacterAvatar id={npc.avatarId} size={36}/>}<div>{npc&&<b>{characterName(npc,t)}</b>}<small>{t('waitingWork.expected',{date:formatCalendarDate(state.dependency.dueDay,locale),time:formatTime(state.dependency.dueMinute)})}</small></div></div>}
   {!state.ready&&<><p className="waiting-work-count"><Clock3 size={14}/>{t(state.remaining>0?(state.today?'waitingWork.minutes':'waitingWork.future'):'waitingWork.waiting',{minutes:state.remaining})}</p><p>{t('waitingWork.tip')}</p></>}
   {!state.canResume&&<p>{t(w.phase==='office'?'waitingWork.busy':'waitingWork.offDuty')}</p>}
   <Button secondary disabled={!state.canResume} onClick={()=>w.dispatch({type:'resume-task',id:task.id})}>{t('story.resume')}</Button>
  </article>;
 })}</>;
}
