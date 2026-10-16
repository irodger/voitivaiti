import { it, expect, vi } from 'vitest';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
import { transition } from '../world/engine';
import { emptyCampaign, activeCharacter } from '../world/simulation';
import { availableTopics } from '../content/contextDialogue';
import { conversationModel, initialConversationTopic } from './conversationModel';
const start = () =>
  transition(emptyCampaign(), {
    type: 'new',
    name: 'Hero',
    avatarId: '1',
    professionId: 'frontend',
    seed: 1427,
  }).campaign;
it('prefers own available work commitments and does not select another colleague’s obligations', () => {
  const c = start();
  c.life!.queue.forEach((q) => {
    q.expectation = undefined;
  });
  c.life!.queue.find((q) => q.id === 'bug')!.expectation = { state: 'waiting', dueDay: 3 };
  expect(initialConversationTopic(c, 'max')).toBe('__commitments');
  expect(initialConversationTopic(c, 'anya')).not.toBe('__commitments');
});
it('merges archived topics without losing saved answers or replacing current context', () => {
  const c = start(),
    hero = activeCharacter(c),
    npc = c.characters.find((person) => person.id === 'anya')!,
    live = availableTopics(c, npc)[0];
  const archived = {
    id: 'archived-only',
    titleKey: 'old-title',
    bodyKey: 'old-body',
    choices: [{ id: 'reply', labelKey: 'old-choice', responseKey: 'saved-response' }],
  };
  hero.dialogueHistory = {
    'anya:archived-only': { topic: archived, choiceId: 'reply', day: 1 },
    ['anya:' + live.id]: {
      topic: { ...live, bodyKey: 'stale-copy' },
      choiceId: live.choices[0].id,
      day: 1,
    },
    'max:other': { topic: { ...archived, id: 'other-person' }, choiceId: 'reply', day: 1 },
  };
  hero.conversations = { 'anya:archived-only': 'reply' };
  const before = JSON.stringify(c),
    model = conversationModel(c, 'anya', 'archived-only');
  expect(model.choice?.responseKey).toBe('saved-response');
  expect(model.fresh.some((topic) => topic.id === 'archived-only')).toBe(false);
  expect(model.topics.filter((topic) => topic.id === live.id)).toHaveLength(1);
  expect(model.topics.find((topic) => topic.id === live.id)?.bodyKey).toBe(live.bodyKey);
  expect(model.topics.some((topic) => topic.id === 'other-person')).toBe(false);
  expect(JSON.stringify(c)).toBe(before);
});
