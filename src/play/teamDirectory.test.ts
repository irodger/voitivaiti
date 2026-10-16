import { it, expect, vi } from 'vitest';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
import { transition } from '../world/engine';
import { emptyCampaign, activeCharacter } from '../world/simulation';
import { availableTopics } from '../content/contextDialogue';
import { teamDirectory } from './teamDirectory';
const start = () =>
  transition(emptyCampaign(), {
    type: 'new',
    name: 'Hero',
    avatarId: '1',
    professionId: 'frontend',
    seed: 1427,
  }).campaign;
const all = { query: '', profession: 'all', onlyNew: false };
it('limits onboarding people and filters by normalized display name without consuming topics', () => {
  const c = start(),
    hero = activeCharacter(c),
    known = c.characters.find((person) => person.id === 'anya')!;
  known.name = 'Unique Teammate';
  hero.firstDay!.introducedNpcIds = [known.id];
  const before = JSON.stringify(c),
    directory = teamDirectory(c, { ...all, query: '  UNIQUE TEAMMATE  ' }, (key) => key);
  expect(directory.people.map((person) => person.id)).toEqual([known.id]);
  expect(directory.visible.map((member) => member.person.id)).toEqual([known.id]);
  expect(JSON.stringify(c)).toBe(before);
});
it('keeps answered people out of the fresh filter and deduplicates suggested topics and people', () => {
  const c = start(),
    hero = activeCharacter(c);
  delete hero.firstDay;
  const npc = c.characters.find((person) => person.id === 'anya')!;
  hero.conversations = Object.fromEntries(
    availableTopics(c, npc).map((topic) => [npc.id + ':' + topic.id, topic.choices[0].id]),
  );
  const directory = teamDirectory(c, { ...all, onlyNew: true }, (key) => key);
  expect(directory.visible.some((member) => member.person.id === npc.id)).toBe(false);
  expect(directory.suggestions.length).toBeLessThanOrEqual(3);
  expect(new Set(directory.suggestions.map((item) => item.c.id)).size).toBe(
    directory.suggestions.length,
  );
  expect(new Set(directory.suggestions.map((item) => item.topic.id)).size).toBe(
    directory.suggestions.length,
  );
});
