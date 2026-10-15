import {Search} from 'lucide-react';
import type {Step,Task,TaskTemplate} from '../world/types';
import {useI18n} from '../content/localization';
import {useWorld} from '../world/store';
import {TaskBrief} from './TaskBrief';
import {ProblemHistory} from './ProblemHistory';
import {TermText} from './TermText';
import {uniqueStepContext} from './stepContext';
export function StepIntroduction({task,step,template}:{task:Task;step:Step;template:TaskTemplate}){
 const {t}=useI18n(),company=useWorld(s=>s.company),first=template.steps[0].id===step.id;
 const priorOutcome=task.templateId.startsWith('lens.')&&first?company?.projects.find(project=>project.id===task.projectId)?.problems.find(problem=>problem.id===task.problemId)?.latestOutcomeKey:undefined;
 const bodyKey=step.type==='review'?'fix.ready':step.bodyKey;
 return <>
  <TaskBrief task={task}/>
  <div className="step-label">{t('ui.step',{step:template.steps.indexOf(step)+1,total:template.steps.length})}<span>{t('ui.min',{value:task.taskElapsedMinutes})}</span></div>
  <h2>{t(step.titleKey)}</h2>
  {step.type==='search'?<div className="search-input"><Search size={18}/><TermText>{t(step.bodyKey)}</TermText></div>:<p className="mechanic-brief"><TermText>{t(bodyKey)}</TermText></p>}
  {task.encounter&&first&&uniqueStepContext(task.encounter.contextKeys,bodyKey,t).map(key=><p className="mechanic-brief" key={key}><TermText>{t(key)}</TermText></p>)}
  {!task.encounter&&priorOutcome&&<p className="mechanic-brief"><TermText>{t(priorOutcome)}</TermText></p>}
  {first&&<ProblemHistory task={task}/>}
 </>;
}
