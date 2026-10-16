import { useRef } from 'react';
import { ProfessionIcon } from '../components/ProfessionIcon';
import { useViewEntrance } from '../hooks/useViewEntrance';
import { useI18n } from '../content/localization';
import { professionById } from '../content/professions';
import { professionDilemma } from '../content/professionExperience';
import { templateById } from '../content/scenarios';
import './professionPreview.css';

export function ProfessionPreview({ role }: { role: string }) {
  const { t } = useI18n();
  const profession = professionById[role];
  const ref = useRef<HTMLElement>(null);
  useViewEntrance(ref, role);
  const first = templateById[profession.scenarioIds[0]];
  return <section ref={ref} className="profession-preview" aria-label={t('roleExperience.title')} aria-live="polite">
    <div className="profession-preview-heading"><ProfessionIcon profession={role} size={54}/><div>
      <small>{t('roleExperience.title')}</small>
      <h3>{t(profession.titleKey)}</h3>
    </div></div>
    <p>{t(professionDilemma[role])}</p>
    <p className="profession-preview-first"><b>{t('roleExperience.first')}: </b>{t(first.titleKey)}</p>
  </section>;
}
