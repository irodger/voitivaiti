import {Bug,CreditCard,Gauge,ShieldCheck,PackageCheck,Clock3,History} from 'lucide-react';
import {resolveTaskTemplate} from '../content/scenarios';
import {useI18n} from '../content/localization';
import {useWorld} from '../world/store';
import {characterName} from './shared';
import {TermText} from './TermText';
import type {Task} from '../world/types';
import '../content/taskScenes';
import './taskScenes.css';

const icons={interface:Bug,payment:CreditCard,performance:Gauge,access:ShieldCheck,delivery:PackageCheck};
export function TaskBrief({task}:{task:Task}){
 const {t}=useI18n(),characters=useWorld(s=>s.characters),template=resolveTaskTemplate(task),Icon=icons[template.category],author=characters.find(ch=>ch.id===(task.legacyActorId??template.author));
 return <header className="task-scene-brief" data-category={template.category}>
  <span className="task-scene-emblem" aria-hidden="true"><Icon size={29}/></span>
  <div><small>{t('taskScene.situation')}</small><h3>{t(template.titleKey)}</h3><p>{author?characterName(author,t):t('ui.team')}<span>·</span><Clock3 size={12}/>{t('ui.min',{value:template.estimate})}</p></div>
  {task.encounter?.previousTaskId&&<span className="task-scene-return"><History size={14}/>{t('taskScene.return')}</span>}
  <details><summary>{t('taskScene.brief')}</summary><p><TermText>{t(template.descriptionKey)}</TermText></p></details>
 </header>;
}
