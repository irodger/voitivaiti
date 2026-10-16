import { useShallow } from 'zustand/react/shallow';
import { useAppUI } from './uiStore';
import { useAppActions } from '../hooks/useAppActions';
import {
  BriefcaseBusiness,
  Building2,
  ChartNoAxesColumnIncreasing,
  Flag,
  House,
  UsersRound,
} from 'lucide-react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useI18n, usePreferences } from '../content/localization';
import { useRunTiming } from '../hooks/useRunTiming';
import { useViewEntrance } from '../hooks/useViewEntrance';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import { useAmbientAudio } from './useAmbientAudio';
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
  const { t, locale } = useI18n();
  const prefs = usePreferences();
  const ch = w.company ? activeCharacter(w) : undefined;
  const { tab, settings, laptop, toast } = useAppUI(
    useShallow((s) => ({ tab: s.tab, settings: s.settings, laptop: s.laptop, toast: s.toast })),
  );
  const { setTab, setLaptop, setToast, closeLaptop, openFocus } = useAppActions();
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
    laptop,
    setLaptop,
    toast,
    firstDay,
    firstScene,
    onboarding,
    pageRef,
    closeLaptop,
  };
}
