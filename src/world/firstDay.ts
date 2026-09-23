import type { Campaign,FirstDay } from './types';
export function startFirstDay(c:Campaign):FirstDay{const npcs=c.characters.filter(n=>n.id!==c.activeCharacterId&&n.employed);return {onboardingStarted:true,onboardingCompleted:false,currentOnboardingStep:'arrival',introducedNpcIds:[],visited:[],hostId:npcs.find(n=>n.profession==='designer')?.id??npcs[0].id,leadId:npcs.find(n=>n.careerNodeId==='level-3')?.id??npcs.find(n=>n.id==='sergey')?.id??npcs[0].id};}
export function advanceFirstDay(c:Campaign,a:{choice?:string;name?:string}){const ch=c.characters.find(n=>n.id===c.activeCharacterId)!,f=ch.firstDay;if(!f||f.onboardingCompleted||c.phase!=='office')return;
 const step=f.currentOnboardingStep;
 if(step==='arrival'){const name=a.name?.trim().slice(0,24);if(!name)return;ch.name=name;f.introducedNpcIds.push(f.hostId);f.currentOnboardingStep='order';}
 else if(step==='order'){if(a.choice!=='project'&&a.choice!=='team')return;f.currentOnboardingStep=a.choice;}
 else if(step==='project'||step==='team'){if(step==='team')f.introducedNpcIds=c.characters.filter(n=>n.employed&&n.id!==ch.id).map(n=>n.id);f.visited=[...new Set([...f.visited,step])];f.currentOnboardingStep=!f.visited.includes('project')?'project':!f.visited.includes('team')?'team':'meeting';}
 else if(step==='meeting'){if(!['curious','quiet','ready'].includes(a.choice??''))return;f.meetingChoice=a.choice;f.currentOnboardingStep='brief';const sync=c.schedule.find(e=>e.type==='sync');if(sync){sync.status='completed';sync.choiceId=a.choice;}c.time+=15;}
 else if(step==='brief'){f.currentOnboardingStep='work';c.schedule=c.schedule.filter(e=>e.type==='sync'||e.type==='task');c.time+=10;}
}
