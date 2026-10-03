import {useWorld} from '../world/store';
import {activeTask} from '../world/simulation';
import {resolveTaskTemplate} from '../content/scenarios';
import {useI18n} from '../content/localization';
import {Button} from './shared';
export function WaitingWork(){
 const w=useWorld(),{t}=useI18n(),current=activeTask(w);
 return <>{w.tasks.filter(task=>task.paused&&!task.rewarded&&task.characterId===w.activeCharacterId).map(task=><article className="remainder-card" key={task.id}><b>{t(resolveTaskTemplate(task).titleKey)}</b><p>{t(Object.values(task.progress).some(p=>p.dependency?.ready)?'story.ready':'story.waiting')}</p>{(!current||current.rewarded)&&<Button secondary onClick={()=>w.dispatch({type:'resume-task',id:task.id})}>{t('story.resume')}</Button>}</article>)}</>;
}
