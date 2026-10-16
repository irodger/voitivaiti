import { expect, it, vi } from 'vitest';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
import { transition } from '../world/engine';
import { emptyCampaign } from '../world/simulation';
import type { CompanyMailMessage } from '../world/companyMailTypes';
import { mailInboxModel } from './mailInboxModel';
const start = () =>
  transition(emptyCampaign(), {
    type: 'new',
    name: 'Hero',
    avatarId: '1',
    professionId: 'frontend',
    seed: 1427,
  }).campaign;
it('combines unread/sent and translated search without marking messages read or changing order', () => {
  const w = start();
  const letter = (
    id: string,
    direction: CompanyMailMessage['direction'],
    readBy: string[],
  ): CompanyMailMessage => ({
    id,
    threadId: 'thread',
    eventId: 'event',
    projectId: 'project',
    problemId: 'problem',
    day: 1,
    direction,
    senderCharacterId: direction === 'outgoing' ? w.activeCharacterId : 'missing',
    subjectKey: 'subject',
    bodyKeys: [],
    readBy,
  });
  const messages = [
    letter('unread', 'incoming', []),
    letter('read', 'incoming', [w.activeCharacterId]),
    letter('sent', 'outgoing', []),
  ];
  w.company!.mail = { version: 1, messages };
  const before = JSON.stringify(w);
  const t = (key: string) => (key === 'subject' ? 'Проверка оплаты' : key);
  const unread = mailInboxModel(w, 'read', 'unread', '  ОПЛАТЫ ', t);
  expect(unread.visibleThreads.flatMap((th) => th.visibleLetters.map((m) => m.id))).toEqual([
    'unread',
  ]);
  expect(unread.mail).toBe(messages[1]);
  expect(unread.thread?.letters[unread.position]).toBe(messages[1]);
  const sent = mailInboxModel(w, null, 'sent', 'mail.you', t);
  expect(sent.visibleThreads.flatMap((th) => th.visibleLetters.map((m) => m.id))).toEqual(['sent']);
  expect(sent.messages.map((m) => m.id)).toEqual(['sent', 'read', 'unread']);
  expect(mailInboxModel(w, null, 'all', 'no-match', t).visibleThreads).toEqual([]);
  expect(JSON.stringify(w)).toBe(before);
});
it('supports an empty startup mailbox and stale selection', () => {
  const model = mailInboxModel(emptyCampaign(), 'stale', 'all', '', (key) => key);
  expect(model.messages).toEqual([]);
  expect(model.mail).toBeUndefined();
  expect(model.position).toBe(-1);
});
