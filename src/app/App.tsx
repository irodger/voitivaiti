import '../content/timeClarity';
import { FirstDay } from '../play/FirstDay';
import { InstallGame } from '../play/InstallGame';
import { LifeStatus } from '../play/LifeStatus';
import { MoneyReceipt } from '../play/MoneyReceipt';
import '../play/screenUx.css';
import { AppHeader } from './AppHeader';
import { AppSettings } from './AppSettings';
import './themes.css';
import { useApp } from './useApp';

import { AnimatePresence, LayoutGroup, motion, MotionConfig } from 'framer-motion';
import { Check } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { Laptop } from '../play/Laptop';

import { Hud } from '../play/Hud';
import { Onboarding } from '../play/Onboarding';

import { Work } from '../play/Work';
const Career = lazy(() => import('../play/Career').then((module) => ({ default: module.Career })));
const Company = lazy(() =>
  import('../play/Company').then((module) => ({ default: module.Company })),
);
const Home = lazy(() => import('../play/Home').then((module) => ({ default: module.Home })));
const Skills = lazy(() => import('../play/Skills').then((module) => ({ default: module.Skills })));
const Team = lazy(() => import('../play/Team').then((module) => ({ default: module.Team })));
const EndedCareer = lazy(() =>
  import('../play/EndedCareer').then((module) => ({ default: module.EndedCareer })),
);

export default function App() {
  const {
    openFocus,
    visibleTabs,
    feedback,
    installEligible,
    w,
    t,
    prefs,
    tab,
    setTab,
    settings,
    laptop,
    toast,
    firstScene,
    onboarding,
    pageRef,
  } = useApp();

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div
          className={`app-shell world-game theme-${prefs.colorScheme ?? 'green'} ${onboarding ? 'onboarding-shell' : 'game-shell'}`}
        >
          <AppHeader />
          {w.saveWarning && (
            <div className="save-error" role="alert">
              {t('ui.saveError')}
            </div>
          )}
          {onboarding ? (
            <Onboarding />
          ) : (
            <>
              <main className="game-main">
                <Hud showResources={!firstScene}>
                  <LifeStatus onOpen={openFocus} />
                </Hud>
                <div className="game-view" ref={pageRef} role="region" aria-label={t(`ui.${tab}`)}>
                  <Suspense fallback={<p role="status">{t('ui.loading')}</p>}>
                    {firstScene && tab === 'work' ? (
                      <FirstDay />
                    ) : w.phase === 'ended' ? (
                      <EndedCareer />
                    ) : tab === 'work' ? (
                      w.phase === 'home' ? (
                        <Home />
                      ) : (
                        <Work />
                      )
                    ) : tab === 'home' ? (
                      <Home returnToWork />
                    ) : tab === 'career' ? (
                      <Career />
                    ) : tab === 'team' ? (
                      <Team />
                    ) : tab === 'skills' ? (
                      <Skills />
                    ) : (
                      <Company />
                    )}
                  </Suspense>
                </div>
              </main>
              <InstallGame automatic eligible={installEligible} />
              <nav className="bottom-nav" aria-label={t('ui.workspace')}>
                <div className="nav-inner">
                  {visibleTabs.map(({ id, Icon }) => (
                    <button
                      key={id}
                      className={tab === id ? 'active' : ''}
                      aria-current={tab === id ? 'page' : undefined}
                      onClick={() => setTab(id)}
                    >
                      <Icon size={20} />
                      <span>{t(`ui.${id}`)}</span>
                    </button>
                  ))}
                </div>
                <span className="autosave">
                  <Check size={13} />
                  {t(w.saveWarning ? 'ui.saveError' : 'ui.saved')}
                </span>
              </nav>
            </>
          )}
          <AnimatePresence>{laptop && <Laptop />}</AnimatePresence>
          <div className="floating-feedback" aria-live="polite">
            <AnimatePresence>
              {feedback.map((f) => (
                <motion.div
                  key={f.id}
                  className={f.good ? 'good' : 'bad'}
                  initial={{ opacity: 0, y: 18, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {f.key === 'ui.min'
                    ? `+${t(f.key, { value: f.value ?? 0 })}`
                    : `${f.value! > 0 ? '+' : ''}${f.value} ${t(f.key)}`}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <MoneyReceipt />
          {toast && (
            <div role="status" className="mode-toast">
              {t(toast)}
            </div>
          )}
          {settings && <AppSettings />}
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}
