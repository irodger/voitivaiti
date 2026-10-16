import {
  BriefcaseBusiness,
  Building2,
  ChartNoAxesColumnIncreasing,
  Flag,
  House,
  UsersRound,
} from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n, usePreferences } from '../content/localization';
import { useRunTiming } from '../hooks/useRunTiming';
import { useViewEntrance } from '../hooks/useViewEntrance';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import { useAmbientAudio } from './useAmbientAudio';
export type Tab = 'work' | 'team' | 'skills' | 'home' | 'career' | 'company';
const tabs = [
  { id: 'work', Icon: BriefcaseBusiness },
  { id: 'team', Icon: UsersRound },
  { id: 'skills', Icon: ChartNoAxesColumnIncreasing },
  { id: 'home', Icon: House },
  { id: 'career', Icon: Flag },
  { id: 'company', Icon: Building2 },
] as const;
export function useApp() {
  useRunTiming();
  useAmbientAudio();
  const w = useWorld();
  const { t, locale, contentMode } = useI18n();
  const prefs = usePreferences();
  const ch = w.company ? activeCharacter(w) : undefined;
  const [tab, setTab] = useState<Tab>('work');
  const [settings, setSettings] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [laptop, setLaptop] = useState(false);
  const [toast, setToast] = useState('');
  const firstDay = !!ch?.firstDay && !ch.firstDay.onboardingCompleted;
  const firstScene = firstDay && ch!.firstDay!.currentOnboardingStep !== 'work';
  const onboarding = w.phase === 'start' || w.phase === 'create';
  const pageRef = useRef<HTMLDivElement>(null);
  const previousPage = useRef(tab);
  useLayoutEffect(() => {
    if (previousPage.current === tab) return;
    previousPage.current = tab;
    const page = pageRef.current;
    if (!page) return;
    page.scrollTop = 0;
    page.querySelectorAll<HTMLElement>('.world-collection,.office-content').forEach((element) => {
      element.scrollTop = 0;
    });
    if (typeof window.matchMedia === 'function' && window.matchMedia('(max-width:1023px)').matches)
      window.scrollTo({ top: 0, behavior: 'instant' });
  }, [tab]);
  useViewEntrance(pageRef, onboarding ? 'onboarding' : tab);
  const closeLaptop = useCallback(() => {
    if (useWorld.getState().phase === 'reward')
      useWorld.getState().dispatch({ type: 'reward-close' });
    setLaptop(false);
  }, []);
  useEffect(() => {
    if (w.phase === 'home') {
      setTab('home');
      setLaptop(false);
    } else if (w.phase === 'office') setTab('work');
    else if (w.phase === 'reward') setLaptop(true);
  }, [w.phase, w.activeCharacterId]);
  useEffect(() => {
    if (!w.feedback.length) return;
    const timer = setTimeout(w.clearFeedback, 4500);
    return () => clearTimeout(timer);
  }, [w.feedback]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t('ui.brand');
  }, [locale]);
  const toggleMode = () => {
    prefs.toggleMode();
    setToast(contentMode === 'clean' ? 'ui.adultOn' : 'ui.adultOff');
  };
  const openSettings = () => setSettings(true);
  const closeSettings = () => {
    setSettings(false);
    setConfirm(false);
  };
  const resetGame = () => {
    w.reset();
    setConfirm(false);
    setSettings(false);
    setLaptop(false);
    setTab('work');
  };
  const openLaptop = () => setLaptop(true);
  const openTeam = () => setTab('team');
  const openCompany = () => setTab('company');
  const openWork = () => setTab('work');
  const openCareerWork = () => setTab(w.phase === 'home' ? 'home' : 'work');
  const openTeamWork = () => {
    setTab('work');
    setLaptop(true);
  };
  const openFocus = (target: import('../play/currentFocus').FocusTarget) => {
    setTab(target === 'home' ? 'home' : 'work');
    if (target === 'task') setLaptop(true);
    else
      requestAnimationFrame(() =>
        document
          .querySelector('.world-task-panel,.first-day,.home-view')
          ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }),
      );
  };
  const visibleTabs = tabs.filter(
    ({ id }) =>
      !firstDay ||
      id === 'work' ||
      (id === 'team' && !!ch?.firstDay?.introducedNpcIds.length) ||
      (id === 'skills' && !!ch?.discoveredTerms.length),
  );
  const feedback = w.feedback.filter(
    (f) => !f.key.startsWith('term.') && !['ui.xp', 'ui.energy', 'ui.reputation'].includes(f.key),
  );
  const installEligible =
    w.phase === 'home' &&
    !!w.life?.lastPaidCalendarDay &&
    !settings &&
    !laptop &&
    !w.moneyArrival &&
    !w.tasks.some((task) => task.id === w.activeTaskId && !task.rewarded) &&
    !ch?.home?.walk &&
    !ch?.home?.deliveryItemId &&
    !w.life?.montage &&
    !w.schedule.some(
      (event) =>
        event.status === 'pending' && (event.type === 'incident' || event.type === 'dialogue'),
    );
  return {
    openSettings,
    closeSettings,
    resetGame,
    openLaptop,
    openTeam,
    openCompany,
    openWork,
    openCareerWork,
    openTeamWork,
    openFocus,
    visibleTabs,
    feedback,
    installEligible,
    tabs,
    w,
    t,
    prefs,
    ch,
    tab,
    setTab,
    settings,
    setSettings,
    confirm,
    setConfirm,
    laptop,
    setLaptop,
    toast,
    firstDay,
    firstScene,
    onboarding,
    pageRef,
    closeLaptop,
    toggleMode,
  };
}
