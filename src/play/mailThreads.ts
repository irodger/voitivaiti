import type { CompanyMailMessage } from '../world/companyMailTypes';

/** Saved delivery order breaks ties within a day; viewing never marks a thread read. */
export function mailThreads(messages: CompanyMailMessage[], readerId: string) {
  const groups = new Map<string, CompanyMailMessage[]>();
  for (const mail of messages) {
    const thread = groups.get(mail.threadId) ?? [];
    thread.push(mail);
    groups.set(mail.threadId, thread);
  }
  return [...groups]
    .map(([id, letters]) => ({
      id,
      letters,
      latest: letters[letters.length - 1],
      unread: letters.filter((m) => m.direction === 'incoming' && !m.readBy.includes(readerId))
        .length,
    }))
    .sort((a, b) => messages.indexOf(b.latest) - messages.indexOf(a.latest));
}
