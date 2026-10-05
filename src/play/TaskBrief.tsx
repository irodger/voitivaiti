import {Bug,CreditCard,Gauge,ShieldCheck,PackageCheck,Clock3,History,Target,Activity,CheckCircle2} from 'lucide-react';
import {resolveTaskTemplate} from '../content/scenarios';
import {useI18n} from '../content/localization';
import {activeCharacter} from '../world/simulation';
import {useWorld} from '../world/store';
import {characterName} from './shared';
import {TermText} from './TermText';
import type {Task} from '../world/types';
import '../content/taskScenes';
import './taskScenes.css';

const icons={interface:Bug,payment:CreditCard,performance:Gauge,access:ShieldCheck,delivery:PackageCheck};
export function TaskBrief({task}:{task:Task}){
 const {t}=useI18n(),world=useWorld(),characters=world.characters,first=activeCharacter(world).firstDay,template=resolveTaskTemplate(task),Icon=icons[template.category],author=characters.find(ch=>ch.id===(task.legacyActorId??template.author));
 const guided=!!first&&!first.onboardingCompleted,current=task.progress[task.currentStepId],done=template.steps.filter(step=>task.progress[step.id]?.status==='completed').length;
 return <header className="task-scene-brief" data-category={template.category}>
  <span className="task-scene-emblem" aria-hidden="true"><Icon size={29}/></span>
  <div><small>{t('taskScene.situation')}</small><h3>{t(template.titleKey)}</h3><p>{author?characterName(author,t):t('ui.team')}<span>·</span><Clock3 size={12}/>{t('ui.min',{value:template.estimate})}</p></div>
  {task.encounter?.previousTaskId&&<span className="task-scene-return"><History size={14}/>{t('taskScene.return')}</span>}
  <details open={guided&&template.steps[0].id===task.currentStepId||undefined}><summary>{guided&&<Target size={14} aria-hidden="true"/>}{guided?t('taskScene.firstGoal'):t('taskScene.brief')}</summary><p><TermText>{t(template.descriptionKey)}</TermText></p></details>
  {guided&&<div className="first-task-status"><div><span className="first-task-status-icon">{current?.status==='completed'?<CheckCircle2 size={18}/>:<Activity size={18}/>}</span><span><small>{t('taskScene.stageStatus')}</small><b>{t(current?.status==='completed'?'taskScene.checked':current?.run==='running'?'taskScene.running':'taskScene.act')}</b></span></div><div><Clock3 size={17}/><span><small>{t('taskScene.spent')}</small><b>{t('ui.min',{value:task.taskElapsedMinutes})}</b></span></div><div className="first-task-meter"><small>{t('taskScene.completed',{done,total:template.steps.length})}</small><progress value={done} max={template.steps.length} aria-label={t('taskScene.stageStatus')}/></div></div>}
 </header>;
}
