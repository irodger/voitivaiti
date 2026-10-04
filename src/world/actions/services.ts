import {applyEffects} from '../effects';
import {activeTask} from '../simulation';
import {trackGameEvent} from '../analytics';
import type {Campaign,Effect,Feedback,Step,Task} from '../types';
import type {Action} from './types';
/** One transition owns feedback and charging; domains share these services. */
export function createActionServices(c:Campaign,source:Campaign,action:Action,feedback:Feedback[]){
 const emit=trackGameEvent;
 const effects=(list:Effect[])=>applyEffects(c,list,feedback,action.type,activeTask(source)?.rewarded);
 // Opening an inline explanation, rather than completing a step, teaches terms.
 const discover=(_ids:string[])=>{};
 const tick=(minutes:number,task?:Task)=>{
  c.time+=minutes;
  if(task)task.taskElapsedMinutes+=minutes;
  if(minutes)feedback.push({id:Date.now()+feedback.length,key:'ui.min',value:minutes,good:true});
 };
 const completeStep=(task:Task,step:Step,extra:Effect[]=[],minutes=0)=>{
  const p=task.progress[step.id];
  if(p.status==='completed')return;
  if(!p.charged){effects(step.effects);tick(step.minutes,task);p.charged=true;}
  effects(extra);tick(minutes,task);p.status='completed';
  if(!task.completedStepIds.includes(step.id))task.completedStepIds.push(step.id);
  p.responseKey??='ui.success';
 };
 return {emit,effects,discover,tick,completeStep};
}
