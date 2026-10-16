import { textSearch } from '../utils/textSearch';
import { characterName } from '../utils/characterName';
import { unreadCompanyMail } from '../world/companyMail';
import type { CompanyMailMessage } from '../world/companyMailTypes';
import type { Campaign } from '../world/types';
import { mailThreads } from './mailThreads';
export type MailFilter = 'all' | 'unread' | 'sent';
/** Pure mailbox projection; selecting/marking letters read remains in the controller. */
export function mailInboxModel(
  w: Campaign,
  selected: string | null,
  filter: MailFilter,
  query: string,
  t: (key: string) => string,
) {
  const messages = [...(w.company?.mail?.messages ?? [])].reverse();
  const mail = messages.find((m) => m.id === selected);
  const unread = unreadCompanyMail(w);
  const team = (id?: string) => {
    const team = w.company?.structure?.teams.find((team) => team.id === id);
    return team ? t(team.nameKey) : '';
  };
  const sender = (m: CompanyMailMessage) => {
    const person = w.characters.find((c) => c.id === m.senderCharacterId);
    return m.direction === 'outgoing' && m.senderCharacterId === w.activeCharacterId
      ? t('mail.you')
      : person
        ? characterName(person, t)
        : team(m.senderTeamId) || t('mail.sent');
  };
  const threads = mailThreads(w.company?.mail?.messages ?? [], w.activeCharacterId);
  const thread = threads.find((th) => th.id === mail?.threadId);
  const position = thread?.letters.findIndex((m) => m.id === mail?.id) ?? -1;
  const search = textSearch(query);
  const visible = (m: CompanyMailMessage) =>
    (filter === 'all' ||
      (filter === 'sent' && m.direction === 'outgoing') ||
      (filter === 'unread' &&
        m.direction === 'incoming' &&
        !m.readBy.includes(w.activeCharacterId))) &&
    search.matches([sender(m), team(m.senderTeamId), t(m.subjectKey)]);
  const visibleThreads = threads
    .map((th) => ({ ...th, visibleLetters: th.letters.filter(visible) }))
    .filter((th) => th.visibleLetters.length);

  return { messages, mail, unread, team, sender, thread, position, visibleThreads };
}
