import {useEffect} from 'react';
import type {Step,StepProgress} from '../world/types';
import {useWorld} from '../world/store';
/** Captured task/step ids keep a delayed run scoped to the scene that started it. */
export function useStepExecution(taskId:string|undefined,step:Step,run:StepProgress['run']|undefined,readOnly:boolean){
 useEffect(()=>{
  if(!taskId||readOnly||run!=='running')return;
  const timer=setTimeout(()=>useWorld.getState().dispatch({type:'finish-run',taskId,stepId:step.id}),step.type==='terminal'?1700:1200);
  return()=>clearTimeout(timer);
 },[run,readOnly,taskId,step.id,step.type]);
}
