import { beforeEach, expect, it } from 'vitest';
import { initialAppUI, useAppUI } from './uiStore';
beforeEach(() => useAppUI.setState(initialAppUI));
it('shares navigation with stable commands and opens the work laptop atomically', () => {
  const actions = useAppUI.getState().actions;
  actions.openTeam();
  expect(useAppUI.getState().tab).toBe('team');
  const observations: { tab: string; laptop: boolean }[] = [];
  const unsubscribe = useAppUI.subscribe((s) =>
    observations.push({ tab: s.tab, laptop: s.laptop }),
  );
  actions.openTeamWork();
  unsubscribe();
  expect(observations).toEqual([{ tab: 'work', laptop: true }]);
  actions.setToast('message');
  expect(useAppUI.getState().actions).toBe(actions);
});
it('closing settings clears confirmation without closing a laptop underneath', () => {
  const actions = useAppUI.getState().actions;
  actions.openLaptop();
  actions.openSettings();
  actions.setConfirm(true);
  actions.closeSettings();
  expect(useAppUI.getState()).toMatchObject({ settings: false, confirm: false, laptop: true });
  actions.openSettings();
  expect(useAppUI.getState().confirm).toBe(false);
});
it('resets navigation while retaining an active mode notification as before', () => {
  const actions = useAppUI.getState().actions;
  actions.openCompany();
  actions.openSettings();
  actions.setConfirm(true);
  actions.openLaptop();
  actions.setToast('ui.adultOn');
  actions.resetNavigation();
  expect(useAppUI.getState()).toMatchObject({ ...initialAppUI, toast: 'ui.adultOn' });
});
