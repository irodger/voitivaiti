import {useConversation} from '../hooks/useConversation';
import {useI18n} from '../content/localization';
import {Modal} from './shared';
import {ConversationSidebar} from './ConversationSidebar';
import {ConversationSpecialStage} from './ConversationSpecialStage';
import {ConversationTopicStage} from './ConversationTopicStage';
import '../content/workMemory';
import '../content/teamChat';
import './conversation.css';
export function Conversation({npcId,onClose,initialTopicId,onWork}:{npcId:string;onClose:()=>void;initialTopicId?:string;onWork?:()=>void}){
 const {t}=useI18n(),session=useConversation(npcId,initialTopicId,!!onWork);
 const dialogue=!session.showMemory&&!session.showCommitments&&!!session.topic;
 return <Modal title={t('teamChat.title')} onClose={onClose} className="team-conversation">
  <div className="conversation-layout"><ConversationSidebar session={session}/>
   <main className="conversation-stage">{dialogue?<ConversationTopicStage session={session}/>:<ConversationSpecialStage session={session} onClose={onClose} onWork={onWork}/>}</main>
  </div>
 </Modal>;
}
