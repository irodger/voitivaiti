import { useState } from 'react';
import { useI18n } from '../content/localization';
import { professionById } from '../content/professions';
import { flushRunTiming } from '../world/runTiming';
import { activeCharacter, candidates, isLeader } from '../world/simulation';
import { useWorld } from '../world/store';
export function useCareer() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const role = professionById[ch.profession];
  const node = role.careers.find((n) => n.id === ch.careerNodeId)!;
  const { t } = useI18n();
  const [victory, setVictory] = useState(false);
  const [hiring, setHiring] = useState(false);
  const [selected, setSelected] = useState('qa');
  const pool = candidates(w);
  const candidate = pool.find((c) => c.profession === selected)!;
  const canHire =
    isLeader(ch) && w.schedule.every((e) => e.status === 'completed') && w.phase !== 'reward';
  const openVictory = () => {
    flushRunTiming();
    setVictory(true);
  };
  const continueHiring = () => {
    setVictory(false);
    setHiring(true);
  };
  const hireCandidate = () => {
    w.dispatch({ type: 'hire', id: candidate.id });
    setHiring(false);
  };
  return {
    hireCandidate,
    continueHiring,
    openVictory,
    w,
    role,
    node,
    t,
    victory,
    setVictory,
    hiring,
    setHiring,
    selected,
    setSelected,
    candidate,
    canHire,
  };
}
