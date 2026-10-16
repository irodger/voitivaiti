import { it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
vi.mock('../world/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../world/store')>();
  return {
    ...actual,
    useWorld: Object.assign(
      (selector?: (s: ReturnType<typeof actual.useWorld.getState>) => unknown) =>
        selector ? selector(actual.useWorld.getState()) : actual.useWorld.getState(),
      actual.useWorld,
    ),
  };
});
import { useWorld } from '../world/store';
import { beginPlaytest } from '../world/playtestHelpers';
import { activeCharacter } from '../world/simulation';
import { OfficeContacts } from './OfficeContacts';
it('highlights only live commitments, excluding resolved and delegated work', () => {
  const c = beginPlaytest('frontend');
  delete activeCharacter(c).firstDay;
  activeCharacter(c).completedWork = ['one', 'two', 'three'];
  c.life!.queue.forEach((q) => {
    q.expectation = undefined;
    q.status = 'waiting';
  });
  c.life!.queue.find((q) => q.id === 'bug')!.expectation = { state: 'waiting', dueDay: 2 };
  c.life!.queue.find((q) => q.id === 'feature')!.expectation = { state: 'resolved', dueDay: 2 };
  const debt = c.life!.queue.find((q) => q.id === 'debt')!;
  debt.expectation = { state: 'waiting', dueDay: 2 };
  debt.delegatedTo = 'someone';
  useWorld.setState(c);
  const before = JSON.stringify(c),
    html = renderToStaticMarkup(<OfficeContacts onTalk={() => {}} />);
  expect(html.match(/data-expectation="true"/g)).toHaveLength(1);
  expect(html).toContain('data-contact-id="max"');
  expect(JSON.stringify(c)).toBe(before);
});
it('keeps colleagues not yet introduced out of the onboarding contact panel', () => {
  const c = beginPlaytest('frontend'),
    hero = activeCharacter(c),
    known = c.characters.find((ch) => ch.employed && ch.id !== hero.id)!;
  hero.firstDay!.onboardingCompleted = false;
  hero.firstDay!.introducedNpcIds = [known.id];
  useWorld.setState(c);
  const html = renderToStaticMarkup(<OfficeContacts onTalk={() => {}} />);
  expect(html.match(/data-contact-id=/g)).toHaveLength(1);
  expect(html).toContain('data-contact-id="' + known.id + '"');
});
