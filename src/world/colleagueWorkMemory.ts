import type {Campaign} from './types';
import {resolveTaskTemplate} from '../content/scenarios';

export function colleagueWorkMemory(c:Campaign,npcId:string){
 const result:{id:string;taskId:string;titleKey:string;kind:'result'|'reply';factKey:string;day?:number;temporary:boolean;evidenceOnly:boolean}[]=[];
 for(const task of c.tasks.filter(task=>task.characterId===c.activeCharacterId&&c.company?.projects.some(project=>project.id===task.projectId))){
  const scene=resolveTaskTemplate(task),owner=c.company?.structure?.teams.find(team=>team.id===task.encounter?.teamContext?.ownerTeamId);
  const shared=scene.author===npcId||owner?.contactId===npcId;
  if(task.rewarded&&task.outcome&&shared){
   const event=c.company?.history.find(event=>event.id===task.id+':outcome');
   result.push({id:task.id+':result',taskId:task.id,titleKey:scene.titleKey,kind:'result',factKey:task.outcome.summaryKey,day:event?.day,temporary:task.outcome.kind==='temporary',evidenceOnly:task.outcome.systemChanged===false});
  }
  for(const step of scene.steps){
   const p=task.progress[step.id];if(p?.dependency?.npcId!==npcId||!p.dependency.ready)continue;
   for(const id of p.actionHistory??[]){
    const action=step.actionFlow?.actions.find(action=>action.id===id);if(!action?.requiresReply)continue;
    const factKey=p.observations?.[id];if(!factKey)continue;
    const event=c.company?.history.find(event=>event.problemId===task.problemId&&event.actorId===npcId&&event.kind==='company-team-result'&&event.values?.sourceTaskId===task.id);
    result.push({id:task.id+':reply:'+id,taskId:task.id,titleKey:scene.titleKey,kind:'reply',factKey,day:event?.day,temporary:false,evidenceOnly:false});
   }
  }
 }
 return result.reverse().sort((a,b)=>(b.day??-1)-(a.day??-1)||Number(b.kind==='result')-Number(a.kind==='result'));
}
