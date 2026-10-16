import { create } from 'zustand';
export type Tab = 'work' | 'team' | 'skills' | 'home' | 'career' | 'company';
export const initialAppUI = {
  tab: 'work' as Tab,
  settings: false,
  confirm: false,
  laptop: false,
  toast: '',
};
type UIActions = {
  setTab: (tab: Tab) => void;
  setLaptop: (laptop: boolean) => void;
  setConfirm: (confirm: boolean) => void;
  setToast: (toast: string) => void;
  openSettings: () => void;
  closeSettings: () => void;
  openLaptop: () => void;
  openTeam: () => void;
  openCompany: () => void;
  openWork: () => void;
  openTeamWork: () => void;
  resetNavigation: () => void;
};
/** Transient application UI only: never persisted with the campaign or browser profile. */
export const useAppUI = create<typeof initialAppUI & { actions: UIActions }>()((set) => ({
  ...initialAppUI,
  actions: {
    setTab: (tab) => set({ tab }),
    setLaptop: (laptop) => set({ laptop }),
    setConfirm: (confirm) => set({ confirm }),
    setToast: (toast) => set({ toast }),
    openSettings: () => set({ settings: true }),
    closeSettings: () => set({ settings: false, confirm: false }),
    openLaptop: () => set({ laptop: true }),
    openTeam: () => set({ tab: 'team' }),
    openCompany: () => set({ tab: 'company' }),
    openWork: () => set({ tab: 'work' }),
    openTeamWork: () => set({ tab: 'work', laptop: true }),
    resetNavigation: () => set({ tab: 'work', settings: false, confirm: false, laptop: false }),
  },
}));
