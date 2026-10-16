import { ArrowRight, Briefcase, CalendarCheck, MessagesSquare } from 'lucide-react';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { useI18n } from '../content/localization';
import { characterName } from '../utils/characterName';
import { ColleagueWorkMemory } from './ColleagueWorkMemory';
import type { ConversationSession } from './useConversation';
import { WorkExpectations } from './WorkExpectations';

type Props = { session: ConversationSession; onClose: () => void; onWork?: () => void };
export function ConversationSpecialStage({ session, onClose, onWork }: Props) {
  const { t } = useI18n(),
    { showMemory, showCommitments, npc, npcId, setTopic, commitments, canOpenWork, w, fresh } =
      session;
  if (showMemory)
    return (
      <>
        <header className="conversation-topic-heading">
          <span>
            <Briefcase size={15} />
            {characterName(npc, t)}
          </span>
          <h3>{t('workMemory.title')}</h3>
        </header>
        <div className="conversation-thread conversation-work">
          <ColleagueWorkMemory npcId={npcId} />
        </div>
        <footer className="conversation-reply-dock">
          <button className="world-secondary" onClick={() => setTopic(null)}>
            {t('teamChat.back')}
          </button>
        </footer>
      </>
    );
  if (showCommitments)
    return (
      <>
        <header className="conversation-topic-heading">
          <span>
            <CalendarCheck size={15} />
            {characterName(npc, t)}
          </span>
          <h3>{t('teamChat.commitments')}</h3>
        </header>
        <div className="conversation-thread conversation-work">
          <p className="conversation-work-intro">{t('teamChat.commitmentsHint')}</p>
          {commitments.length ? (
            <WorkExpectations npcId={npcId} showCosts />
          ) : (
            <p>{t('teamChat.noCommitments')}</p>
          )}
        </div>
        <footer className="conversation-reply-dock">
          <p>{t(w.phase === 'office' ? 'teamChat.workHint' : 'teamChat.officeOnly')}</p>
          <div>
            {canOpenWork && (
              <button
                className="primary-button"
                onClick={() => {
                  onClose();
                  onWork?.();
                }}
              >
                {t('teamChat.openWork')}
                <ArrowRight size={18} />
              </button>
            )}
            <button className="world-secondary" onClick={() => setTopic(null)}>
              {t('teamChat.back')}
            </button>
          </div>
        </footer>
      </>
    );
  return (
    <div className="conversation-welcome">
      <div className="conversation-orbit" aria-hidden="true">
        <CharacterAvatar id={npc.avatarId} size={94} />
        <MessagesSquare size={30} />
      </div>
      <p className="eyebrow">{t('teamChat.intro')}</p>
      <h3>{t('teamChat.choose')}</h3>
      <p>{t('teamChat.hint')}</p>
      {fresh[0] && (
        <button className="primary-button" onClick={() => setTopic(fresh[0].id)}>
          {t(fresh[0].titleKey)}
          <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
}
