import { useMemo } from 'react';
import { useAppUI } from '../app/uiStore';
import { usePreferences } from '../content/localization';
import { useWorld } from '../world/store';
import type { FocusTarget } from '../play/currentFocus';
/** Coordinates UI commands with current world/preferences; the UI store itself stays pure. */
export function useAppActions() {
  const actions = useAppUI((state) => state.actions);
  return useMemo(
    () => ({
      ...actions,
      closeLaptop: () => {
        const world = useWorld.getState();
        if (world.phase === 'reward') world.dispatch({ type: 'reward-close' });
        actions.setLaptop(false);
      },
      openCareerWork: () => actions.setTab(useWorld.getState().phase === 'home' ? 'home' : 'work'),
      toggleMode: () => {
        const preferences = usePreferences.getState();
        preferences.toggleMode();
        actions.setToast(preferences.contentMode === 'clean' ? 'ui.adultOn' : 'ui.adultOff');
      },
      resetGame: () => {
        useWorld.getState().reset();
        actions.resetNavigation();
      },
      openFocus: (target: FocusTarget) => {
        actions.setTab(target === 'home' ? 'home' : 'work');
        if (target === 'task') actions.openLaptop();
        else
          requestAnimationFrame(() =>
            document
              .querySelector('.world-task-panel,.first-day,.home-view')
              ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }),
          );
      },
    }),
    [actions],
  );
}
