import { officeSceneModel, officeViewport } from './officeSceneModel';
import { useElementSize } from '../hooks/useElementSize';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { gameConfig } from '../config/game';
import { useI18n } from '../content/localization';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useWorld } from '../world/store';
export function useOfficeSimulation(paused: boolean, onTalk: (id: string) => void) {
  const w = useWorld();
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const compact = useMediaQuery(gameConfig.ui.compactQuery);
  const [beat, setBeat] = useState(0);
  const host = useRef<HTMLDivElement>(null);
  const size = useElementSize(host);
  useEffect(() => {
    if (reduced || paused) return;
    const timer = setInterval(() => {
      if (!document.hidden) setBeat((b) => b + 1);
    }, 18000);
    return () => clearInterval(timer);
  }, [reduced, paused]);
  const { dispute, status, residents, playerProps, experience } = officeSceneModel(
    w,
    beat,
    t,
    onTalk,
  );
  useEffect(() => {
    if (dispute && w.phase === 'office' && w.life?.officeEncounterDay !== w.company?.currentDay)
      w.dispatch({ type: 'office-encounter' });
  }, [dispute, w.phase, w.life?.officeEncounterDay, w.company?.currentDay]);
  const { width, height } = officeViewport(size, compact);
  return { host, t, status, width, height, residents, playerProps, experience };
}
