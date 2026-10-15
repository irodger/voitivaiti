import {useEffect,useRef,useState} from 'react';
import {useWorld} from '../world/store';
import {conversationModel,initialConversationTopic} from '../play/conversationModel';
export function useConversation(npcId:string,initialTopicId?:string,workAvailable=false){
 const w=useWorld();
 const [topicId,setTopic]=useState<string|null>(()=>initialTopicId??initialConversationTopic(w,npcId));
 const [before,setBefore]=useState<{topicId:string;trust:number;skill:number}|null>(null);
 const data=conversationModel(w,npcId,topicId),threadRef=useRef<HTMLDivElement>(null);
 const changed=before?.topicId===topicId&&!!data.choice;
 useEffect(()=>{if(data.choice&&threadRef.current)threadRef.current.scrollTop=threadRef.current.scrollHeight;},[topicId,data.choice?.id]);
 const reply=(choiceId:string)=>{
  if(!data.topic)return;
  setBefore({topicId:data.topic.id,trust:data.trust,skill:data.ch.skills.communication});
  w.dispatch({type:'conversation',npcId,topicId:data.topic.id,choiceId});
 };
 return {...data,w,npcId,topicId,setTopic,threadRef,reply,changed,
  trustDelta:changed&&before?data.trust-before.trust:0,
  skillDelta:changed&&before?data.ch.skills.communication-before.skill:0,
  canOpenWork:workAvailable&&w.phase==='office'&&(!data.ch.firstDay||data.ch.firstDay.onboardingCompleted)};
}
export type ConversationSession=ReturnType<typeof useConversation>;
