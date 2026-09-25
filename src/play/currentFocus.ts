import {activeCharacter,activeTask} from '../world/simulation';
import {templateById} from '../content/scenarios';
import type {Campaign} from '../world/types';
export type FocusTarget='task'|'work'|'home';
export function currentFocus(w:Campaign){
 const ch=activeCharacter(w),task=activeTask(w),step=task&&templateById[task.templateId]?.steps.find(s=>s.id===task.currentStepId);
 const result=(key:string,target?:FocusTarget)=>({key:'focus.'+key,target,taskId:task?.templateId,stepKey:step?.titleKey,count:w.life?.queue.filter(q=>q.status==='waiting').length??0});
 if(w.phase==='ended')return result('ended');
 if(w.phase==='home')return result('home','home');
 if(ch.firstDay&&!ch.firstDay.onboardingCompleted&&ch.firstDay.currentOnboardingStep!=='work')return result('onboarding','work');
 if(w.schedule.some(e=>e.type==='incident'&&e.status==='pending'))return result('incident'); // No guaranteed event target in the current panel.
 if(w.life?.reviewDue)return result('performance','work');
 if(w.phase==='reward')return result('complete','task');
 if(task&&!task.rewarded&&step){
  const progress=task.progress[step.id];
  if(task.status==='blocked')return result('blocked');
  if(step.type==='review'&&progress?.run==='done')return result('reply','task');
  if(step.type==='review'&&progress?.run==='running')return result('waiting','task');
  if(step.type==='review')return result('ready','task');
  return result('step','task');
 }
 if(w.schedule.some(e=>e.type==='sync'&&e.status==='pending'))return result('sync','work');
 if(w.schedule.some(e=>e.type==='task'&&e.status==='pending'))return result('available','work');
 if(w.schedule.some(e=>e.type==='task')&&w.schedule.filter(e=>e.type==='task').every(e=>e.status==='completed'))
  return result(w.life?.queue.some(q=>q.status==='waiting')?'queue':'clear','work');
 return result('ambient');
}
