import { useRef } from 'react';
import { useI18n } from '../content/localization';
import { professionById } from '../content/professions';
import { templateById } from '../content/scenarios';
import { useViewEntrance } from '../hooks/useViewEntrance';
export function useProfessionPreview(role: string) {
  const { t } = useI18n();
  const profession = professionById[role];
  const ref = useRef<HTMLElement>(null);
  useViewEntrance(ref, role);
  const first = templateById[profession.scenarioIds[0]];
  return { t, profession, ref, first };
}
