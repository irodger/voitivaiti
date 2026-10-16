import { beforeEach, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { initialAppUI, useAppUI } from '../app/uiStore';
const state = vi.hoisted(() => ({
  world: { phase: 'office', dispatch: vi.fn(), reset: vi.fn() },
  preferences: { contentMode: 'clean', toggleMode: vi.fn() },
}));
vi.mock('../world/store', () => ({ useWorld: { getState: () => state.world } }));
vi.mock('../content/localization', () => ({
  usePreferences: { getState: () => state.preferences },
}));
import { useAppActions } from './useAppActions';
let actions: ReturnType<typeof useAppActions>;
function Probe() {
  actions = useAppActions();
  return null;
}
beforeEach(() => {
  useAppUI.setState(initialAppUI);
  vi.clearAllMocks();
  state.world.phase = 'office';
  state.preferences.contentMode = 'clean';
  renderToStaticMarkup(createElement(Probe));
});
it('closes a reward before hiding the laptop, using current world state at click time', () => {
  actions.openLaptop();
  state.world.phase = 'reward';
  state.world.dispatch.mockImplementationOnce(() => expect(useAppUI.getState().laptop).toBe(true));
  actions.closeLaptop();
  expect(state.world.dispatch).toHaveBeenCalledWith({ type: 'reward-close' });
  expect(useAppUI.getState().laptop).toBe(false);
  state.world.phase = 'office';
  actions.closeLaptop();
  expect(state.world.dispatch).toHaveBeenCalledTimes(1);
});
it('career links use the latest phase instead of a captured phase', () => {
  state.world.phase = 'home';
  actions.openCareerWork();
  expect(useAppUI.getState().tab).toBe('home');
  state.world.phase = 'office';
  actions.openCareerWork();
  expect(useAppUI.getState().tab).toBe('work');
});
it('preserves the mode notification and resets both world and navigation', () => {
  actions.toggleMode();
  expect(state.preferences.toggleMode).toHaveBeenCalledOnce();
  expect(useAppUI.getState().toast).toBe('ui.adultOn');
  state.preferences.contentMode = 'adult';
  actions.toggleMode();
  expect(useAppUI.getState().toast).toBe('ui.adultOff');
  actions.openTeamWork();
  actions.openSettings();
  actions.setConfirm(true);
  actions.resetGame();
  expect(state.world.reset).toHaveBeenCalledOnce();
  expect(useAppUI.getState()).toMatchObject({
    tab: 'work',
    laptop: false,
    settings: false,
    confirm: false,
  });
});
it('task focus opens the work laptop without requesting a page scroll', () => {
  actions.openCompany();
  actions.openFocus('task');
  expect(useAppUI.getState()).toMatchObject({ tab: 'work', laptop: true });
});
