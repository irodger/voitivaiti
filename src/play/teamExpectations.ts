import {workOwner,availableWork} from '../world/workLoop';
import type {Campaign} from '../world/types';
/** Only live queue expectations are actionable; old dialogue memories are not obligations. */
export function teamExpectations(world:Campaign){
 const ch=world.characters.find(ch=>ch.id===world.activeCharacterId);if(!ch)return [];
 return (world.life?.queue??[]).filter(item=>item.status!=='done'&&!item.delegatedTo&&availableWork(ch).includes(item.id)&&item.expectation&&item.expectation.state!=='resolved').map(item=>({item,npcId:workOwner[item.id],task:item.problemId?world.tasks.filter(task=>task.problemId===item.problemId&&task.projectId===item.projectId).at(-1):undefined,problem:world.company?.projects.find(p=>p.id===item.projectId)?.problems.find(p=>p.id===item.problemId)}));
}
