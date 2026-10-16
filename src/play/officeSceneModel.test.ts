import { expect, it, vi } from 'vitest';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
import { transition } from '../world/engine';
import { emptyCampaign, activeCharacter } from '../world/simulation';
import { officeSceneModel, officeViewport } from './officeSceneModel';
const start = () =>
  transition(emptyCampaign(), {
    type: 'new',
    name: 'Hero',
    avatarId: '1',
    professionId: 'frontend',
    seed: 1427,
  }).campaign;
it('preserves 4:3 crop/letterboxing for desktop and compact scenes', () => {
  expect(officeViewport({ width: 800, height: 300 }, false)).toEqual({ width: 800, height: 600 });
  expect(officeViewport({ width: 800, height: 300 }, true)).toEqual({ width: 400, height: 300 });
  expect(officeViewport({ width: 0, height: 0 }, true)).toEqual({ width: 0, height: 0 });
});
it('projects onboarding residents and callbacks without dispatching or changing the campaign', () => {
  const w = start(),
    onTalk = vi.fn(),
    before = JSON.stringify(w);
  const model = officeSceneModel(w, 3, (key) => key, onTalk);
  expect(model.dispute).toBe(false);
  expect(model.residents.length).toBeLessThanOrEqual(5);
  expect(
    model.residents.every((person) => person.id !== w.activeCharacterId && person.introducing),
  ).toBe(true);
  expect(model.playerProps.id).toBe(w.activeCharacterId);
  expect(model.playerProps.onTalk).toBe(onTalk);
  expect(onTalk).not.toHaveBeenCalled();
  expect(JSON.stringify(w)).toBe(before);
});
it('keeps incident priority over meetings and suppresses disputes during incidents', () => {
  const w = start();
  delete activeCharacter(w).firstDay;
  w.schedule = [{ id: 'incident', type: 'incident', status: 'pending' }] as typeof w.schedule;
  const model = officeSceneModel(
    w,
    3,
    (key) => key,
    () => {},
  );
  expect(model.status).toBe('officeIncident');
  expect(model.dispute).toBe(false);
});
