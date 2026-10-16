import { useConversation } from './useConversation';

import '../content/teamChat';
import '../content/workMemory';
import './conversation.css';
import { ConversationSidebar } from './ConversationSidebar';
import { ConversationSpecialStage } from './ConversationSpecialStage';
import { ConversationTopicStage } from './ConversationTopicStage';
import { Modal } from './shared';
export function Conversation({
  npcId,
  onClose,
  initialTopicId,
  onWork,
}: {
  npcId: string;
  onClose: () => void;
  initialTopicId?: string;
  onWork?: () => void;
}) {
  const session = useConversation(npcId, initialTopicId, !!onWork),
    { t, dialogue } = session;
  return (
    <Modal title={t('teamChat.title')} onClose={onClose} className="team-conversation">
      <div className="conversation-layout">
        <ConversationSidebar session={session} />
        <main className="conversation-stage">
          {dialogue ? (
            <ConversationTopicStage session={session} />
          ) : (
            <ConversationSpecialStage session={session} onClose={onClose} onWork={onWork} />
          )}
        </main>
      </div>
    </Modal>
  );
}
