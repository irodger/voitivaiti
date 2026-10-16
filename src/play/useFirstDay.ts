import { useState } from 'react';
import { useI18n } from '../content/localization';
import { professionById } from '../content/professions';
import { templateById } from '../content/scenarios';
import { lastPlayerName } from '../world/playerName';
import { activeCharacter, plannedTemplateId } from '../world/simulation';
import { useWorld } from '../world/store';
export function useFirstDay(onStartWork?: () => void) {
  const w = useWorld();
  const ch = activeCharacter(w);
  const f = ch.firstDay!;
  const { t } = useI18n();
  const [name, setName] = useState(lastPlayerName);
  const step = f.currentOnboardingStep;
  const project =
    w.company!.projects.find((p) => ch.currentProjectIds.includes(p.id)) ?? w.company!.projects[0];
  const npcs = w.characters.filter((n) => n.employed && n.id !== ch.id);
  const role = professionById[ch.profession];
  const task = templateById[plannedTemplateId(w)];
  const go = (choice?: string) => w.dispatch({ type: 'onboarding', choice });
  const introduce = (e: import('react').FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    w.dispatch({ type: 'onboarding', name });
  };
  const startWork = () => {
    go();
    w.dispatch({ type: 'take-task' });
    if (activeCharacter(useWorld.getState()).firstDay?.currentOnboardingStep === 'work')
      onStartWork?.();
  };
  return { introduce, startWork, w, ch, f, t, name, setName, step, project, npcs, role, task, go };
}
