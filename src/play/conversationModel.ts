import type {Campaign} from '../world/types';
import {activeCharacter} from '../world/simulation';
import {availableTopics} from '../content/contextDialogue';
import {colleagueWorkMemory} from '../world/colleagueWorkMemory';
import {availableWork,workOwner} from '../world/workLoop';
import {professionById} from '../content/professions';
export function conversationCommitments(world:Campaign,npcId:string){
 const hero=activeCharacter(world),allowed=availableWork(hero);
 return world.life?.queue.filter(item=>item.expectation&&item.status!=='done'&&!item.delegatedTo&&workOwner[item.id]===npcId&&allowed.includes(item.id))??[];
}
export function initialConversationTopic(world:Campaign,npcId:string){
 return conversationCommitments(world,npcId).length?'__commitments':colleagueWorkMemory(world,npcId).length?'__workMemory':null;
}
/** Current topics override archived copies; archived answers remain available after context changes. */
export function conversationModel(w:Campaign,npcId:string,topicId:string|null){
 const ch=activeCharacter(w),npc=w.characters.find(person=>person.id===npcId)!;
 const current=availableTopics(w,npc);
 const archived=Object.entries(ch.dialogueHistory??{}).filter(([key])=>key.startsWith(npcId+':')).map(([,entry])=>entry.topic);
 const topics=[...current,...archived.filter(topic=>!current.some(live=>live.id===topic.id))];
 const topic=topics.find(item=>item.id===topicId);
 const choice=topic?.choices.find(item=>item.id===ch.conversations?.[npcId+':'+topic.id]);
 const fresh=topics.filter(item=>!ch.conversations?.[npcId+':'+item.id]);
 const groups=[
  {id:'work' as const,items:fresh.filter(item=>current.find(live=>live.id===item.id)?.kind==='contextual')},
  {id:'personal' as const,items:fresh.filter(item=>current.find(live=>live.id===item.id)?.kind==='personal')},
  {id:'small' as const,items:fresh.filter(item=>current.find(live=>live.id===item.id)?.kind==='small')},
  {id:'history' as const,items:topics.filter(item=>ch.conversations?.[npcId+':'+item.id])}
 ];
 return {ch,npc,current,topics,topic,choice,fresh,groups,next:fresh.find(item=>item.id!==topicId),
  trust:ch.relationships.find(relation=>relation.characterId===npcId)?.trust??20,
  role:professionById[npc.profession],commitments:conversationCommitments(w,npcId),memories:colleagueWorkMemory(w,npcId),
  showMemory:topicId==='__workMemory',showCommitments:topicId==='__commitments',
  due:topic?.id==='context-review'?w.life?.queue.find(item=>item.id==='review')?.promisedDay:undefined};
}
