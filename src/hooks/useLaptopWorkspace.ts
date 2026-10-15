import {useEffect,useRef,useState} from 'react';
import {useWorld} from '../world/store';
import {activeTask} from '../world/simulation';
import {resolveTaskTemplate} from '../content/scenarios';
import type {Step} from '../world/types';
import type {CompanyMailMessage} from '../world/companyMailTypes';
import type {LaptopAppId} from '../play/laptopAppIds';
import {mailWorkTarget} from '../play/mailWorkTarget';
import {laptopContentKind} from '../play/laptopContentKind';
import {useWorkspaceScroll} from './useWorkspaceScroll';

/** Local laptop navigation only. World changes stay in existing dispatched actions. */
export function useLaptopWorkspace(){
 const world=useWorld(),task=activeTask(world);
 const template=task?resolveTaskTemplate(task):undefined;
 const step=template?.steps.find(s=>s.id===task?.currentStepId);
 const [app,setApp]=useState<LaptopAppId>(step?.app??'ide');
 const [view,setView]=useState<Step|null>(null);
 const [board,setBoard]=useState(!task||task.rewarded&&world.phase!=='reward');
 const contentRef=useRef<HTMLDivElement>(null);
 const openDesk=()=>{setBoard(true);setView(null);};
 const openApp=(id:LaptopAppId)=>{setBoard(false);setApp(id);setView(null);};
 const returnCurrent=()=>{setView(null);if(step)setApp(step.app);};
 const resume=()=>{setBoard(false);returnCurrent();};
 const selectStep=(selected:Step)=>{if(selected.id===step?.id){setView(null);setApp(selected.app);}else setView(selected);};
 const closeReward=()=>{world.dispatch({type:'reward-close'});openDesk();};
 const openMailWork=(mail:CompanyMailMessage)=>{
  const route=mailWorkTarget(world,mail),target=route.related;
  if(!target||!route.canOpen){openDesk();return;}
  if(target.paused)world.dispatch({type:'resume-task',id:target.id});
  const current=resolveTaskTemplate(target).steps.find(s=>s.id===target.currentStepId);
  setBoard(false);setView(null);if(current)setApp(current.app);
 };
 useEffect(()=>{
  if(step&&!task?.rewarded){setView(null);setBoard(false);setApp(step.app);}
  else if(task?.rewarded){setView(null);setBoard(true);}
 },[step?.id,task?.id,task?.rewarded]);
 useWorkspaceScroll(contentRef,[step?.id,task?.id,app,view?.id,board].join(':'),
  !board&&!view&&!task?.rewarded&&world.phase!=='reward'&&app===step?.app?step?.id:undefined);
 return {world,task,template,step,app,view,board,contentRef,openDesk,openApp,returnCurrent,resume,selectStep,closeReward,openMailWork,
  selectedApp:view?.app??app,contentKind:laptopContentKind({board,app,view},world.phase,task,step),
  animationKey:board?'desk':view?.id??`${task?.currentStepId}-${app}`};
}
export type LaptopWorkspace=ReturnType<typeof useLaptopWorkspace>;
