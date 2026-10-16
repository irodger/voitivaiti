import { useState } from 'react';
import { useI18n } from '../content/localization';
import { handoffCandidate } from '../world/responsibility';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import { absenceObligations, type VacationArrangements } from '../world/vacation';
export function useRoutinePanel() {
  const w = useWorld();
  const { t } = useI18n();
  const l = w.life!;
  const ch = activeCharacter(w);
  const [leave, setLeave] = useState<3 | 7 | 14 | null>(null);
  const [arrangements, setArrangements] = useState<VacationArrangements>({});
  const ready = l.characterPlayedDays - (l.lastMontagePlayedDay ?? 0) >= 3;
  const startVacation = () => {
    w.dispatch({ type: 'vacation', days: leave!, arrangements });
    setLeave(null);
  };
  const prepareLeave = (days: 3 | 7 | 14) => {
    setArrangements({});
    setLeave(days);
  };
  const setArrangement = (id: string, value: string) =>
    setArrangements((a) => ({
      ...a,
      [id]: value.startsWith('handoff:')
        ? { kind: 'handoff', npcId: value.slice(8) }
        : (value as 'ignore' | 'postpone'),
    }));
  const obligations = leave
    ? absenceObligations(w)
        .filter((q) => !q.delegatedTo)
        .map((q) => {
          const reserved = Object.entries(arrangements)
            .filter(([id, a]) => id !== q.id && typeof a === 'object')
            .map(
              ([, a]) =>
                (
                  a as {
                    npcId: string;
                  }
                ).npcId,
            );
          const npc = handoffCandidate(w, q, reserved);
          const arrangement = arrangements[q.id];
          const value =
            typeof arrangement === 'object'
              ? 'handoff:' + arrangement.npcId
              : (arrangement ?? 'ignore');
          const canPostpone =
            q.expectation &&
            !q.expectation.extensionUsed &&
            q.urgency < 4 &&
            q.expectation.state !== 'escalated';
          return { q, npc, value, canPostpone };
        })
    : [];
  return {
    prepareLeave,
    setArrangement,
    obligations,
    startVacation,
    w,
    t,
    l,
    ch,
    leave,
    setLeave,
    arrangements,
    setArrangements,
    ready,
  };
}
