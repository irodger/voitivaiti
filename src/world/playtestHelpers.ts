import {resolveTaskTemplate} from '../content/scenarios';
import {transition,type Action} from './engine';
import {activeCharacter,activeTask,emptyCampaign} from './simulation';
import {availableTechnicalActions} from './technicalActions';
import type {Campaign} from './types';

export const perform=(c:Campaign,a:Action)=>transition(c,a).campaign;
export function beginPlaytest(role:string){
 let c=perform(emptyCampaign(),{type:'new',name:'Playtest',avatarId:'1',professionId:role,seed:1427});
 for(let i=0;i<15&&activeCharacter(c).firstDay!.currentOnboardingStep!=='work';i++){
  const step=activeCharacter(c).firstDay!.currentOnboardingStep;
  c=perform(c,{type:'onboarding',name:'Playtest',choice:step==='order'?'project':step==='meeting'?'quiet':undefined});
 }
 return c;
}
export function finishPlaytestTask(c:Campaign,style='shared'){
 for(let guard=0;guard<30;guard++){
  const task=activeTask(c);if(!task)throw Error('No task assigned');if(task.rewarded)return c;
  const step=resolveTaskTemplate(task).steps.find(s=>s.id===task.currentStepId)!;
  if(step.actionFlow){
   for(let n=0;n<20&&activeTask(c)!.progress[step.id].status!=='completed';n++){
    const actions=availableTechnicalActions(step,activeTask(c)!.progress[step.id]);
    const action=actions.find(a=>a.id===style)??actions.find(a=>a.id===(style==='limited'?'apply-limited':'apply-shared'))??actions.find(a=>a.id===(style==='limited'?'bounded-result':'verified-result'))??actions[0];if(!action)throw Error('No action at '+step.id);
    c=perform(c,{type:'technical-action',id:action.id});
   }
  }else{
   if(['terminal','review','console'].includes(step.type)){c=perform(c,{type:'run'});c=perform(c,{type:'finish-run',taskId:task.id,stepId:step.id});}
   if(step.solution){
    if(Array.isArray(step.solution))for(const id of step.solution)c=perform(c,{type:'draft',id});
    else for(const [id,value] of Object.entries(step.solution))c=perform(c,{type:'allocate',id,value});
    c=perform(c,{type:'submit'});
   }
   if(step.options)c=perform(c,{type:'choose',id:step.options.find(o=>o.correct!==false)!.id});
   if(step.type==='bug-reproduction'){c=perform(c,{type:'click'});c=perform(c,{type:'click'});}
  }
  if(activeTask(c)!.progress[step.id].status!=='completed')throw Error('Incomplete step '+step.id);
  c=perform(c,{type:'advance'});
 }
 throw Error('Task did not finish');
}
