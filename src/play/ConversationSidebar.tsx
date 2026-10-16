import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  Check,
  Heart,
  HeartHandshake,
  Sun,
} from 'lucide-react';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { useI18n } from '../content/localization';
import { characterName } from '../utils/characterName';
import type { ConversationSession } from './useConversation';
const groupIcons = { work: Briefcase, personal: Heart, small: Sun, history: Check };
export function ConversationSidebar({ session }: { session: ConversationSession }) {
  const { t } = useI18n(),
    {
      npc,
      role,
      trust,
      memories,
      commitments,
      topicId,
      ch,
      setTopic,
      showMemory,
      showCommitments,
      npcId,
    } = session;
  const groups = session.groups.map((group) => ({ ...group, Icon: groupIcons[group.id] }));
  return (
    <aside className="conversation-sidebar">
      <div className="conversation-profile">
        <CharacterAvatar id={npc.avatarId} size={76} />
        <h3>{characterName(npc, t)}</h3>
        <p>{t(role.careers.find((n) => n.id === npc.careerNodeId)?.titleKey ?? role.titleKey)}</p>
        <span>
          <HeartHandshake size={14} />
          {t('teamChat.trust')} <b>{trust}</b>
        </span>
      </div>
      <nav aria-label={t('chat.topics')} className="conversation-topics">
        {!!memories.length && (
          <section className="conversation-commitment-tab">
            <button aria-pressed={showMemory} onClick={() => setTopic('__workMemory')}>
              <Briefcase size={16} />
              <span>{t('workMemory.title')}</span>
              <b>{memories.length}</b>
            </button>
          </section>
        )}
        {!!commitments.length && (
          <section className="conversation-commitment-tab">
            <button aria-pressed={showCommitments} onClick={() => setTopic('__commitments')}>
              <CalendarCheck size={16} />
              <span>{t('teamChat.commitments')}</span>
              <b>{commitments.length}</b>
            </button>
          </section>
        )}
        {groups
          .filter((g) => g.items.length)
          .map(({ id, Icon, items }) => (
            <section key={id}>
              <h4>
                <Icon size={14} />
                {t('teamChat.' + id)}
                <span>{items.length}</span>
              </h4>
              {items.map((x) => (
                <button key={x.id} aria-pressed={topicId === x.id} onClick={() => setTopic(x.id)}>
                  <span>{t(x.titleKey)}</span>
                  {ch.conversations?.[npcId + ':' + x.id] ? (
                    <Check size={14} />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                </button>
              ))}
            </section>
          ))}
      </nav>
    </aside>
  );
}
