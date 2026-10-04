import {useWorld} from '../world/store';
import {activeTask} from '../world/simulation';
import {resolveTaskTemplate} from '../content/scenarios';
import {useI18n} from '../content/localization';
import {Button} from './shared';
import {TaskStartButton} from './TaskStartButton';
import {WorkQueue} from './WorkQueue';
import {RemainderQueue} from './RemainderQueue';
import {WaitingWork} from './WaitingWork';
import {WorkExpectations} from './WorkExpectations';

export function WorkDesk({onResume}:{onResume:()=>void}){
 const w=useWorld(),task=activeTask(w),{t}=useI18n();
 return <section className="work-desk"><h2>{t('desk.tasks')}</h2><p>{t('desk.intro')}</p>
 {task&&!task.rewarded?<article className="desk-current"><small>{t('workspace.currentStep')}</small><h3>{t(resolveTaskTemplate(task).titleKey)}</h3><Button onClick={onResume}>{t('desk.resume')}</Button></article>:<>{w.schedule.some(e=>e.type==='task'&&e.status==='pending')?<WorkQueue compact/>:w.life&&<RemainderQueue/>}<TaskStartButton/></>}
 <WaitingWork/><WorkExpectations/>
 </section>;
}
