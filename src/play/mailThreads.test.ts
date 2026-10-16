import { it, expect } from 'vitest';
import { mailThreads } from './mailThreads';
import type { CompanyMailMessage } from '../world/companyMailTypes';
const letter = (
  id: string,
  threadId: string,
  direction: 'incoming' | 'outgoing' = 'incoming',
): CompanyMailMessage => ({
  id,
  threadId,
  direction,
  eventId: id,
  projectId: 'project',
  problemId: threadId,
  day: 5,
  subjectKey: id,
  bodyKeys: [id],
  readBy: [],
});
it('keeps each causal conversation ordered and unread per hero without marking other letters read', () => {
  const messages = [
    letter('request', 'campaign'),
    letter('other', 'other'),
    letter('clarification', 'campaign', 'outgoing'),
    letter('result', 'campaign'),
  ];
  messages[0].readBy = ['hero'];
  const before = JSON.stringify(messages);
  const threads = mailThreads(messages, 'hero');
  expect(threads.map((t) => t.id)).toEqual(['campaign', 'other']);
  expect(threads[0].letters.map((m) => m.id)).toEqual(['request', 'clarification', 'result']);
  expect(threads[0].latest.id).toBe('result');
  expect(threads[0].unread).toBe(1);
  expect(mailThreads(messages, 'nextHero')[0].unread).toBe(2);
  expect(JSON.stringify(messages)).toBe(before);
  expect(mailThreads(JSON.parse(before), 'hero')).toEqual(threads);
  expect(mailThreads([], 'hero')).toEqual([]);
});
