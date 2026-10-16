import { ProfessionIcon } from '../components/ProfessionIcon';
import { professionDilemma } from '../content/professionExperience';
import './professionPreview.css';
import { useProfessionPreview } from './useProfessionPreview';

export function ProfessionPreview({ role }: { role: string }) {
 const {t,profession,ref,first}=useProfessionPreview(role);

  return <section ref={ref} className="profession-preview" aria-label={t('roleExperience.title')} aria-live="polite">
    <div className="profession-preview-heading"><ProfessionIcon profession={role} size={54}/><div>
      <small>{t('roleExperience.title')}</small>
      <h3>{t(profession.titleKey)}</h3>
    </div></div>
    <p>{t(professionDilemma[role])}</p>
    <p className="profession-preview-first"><b>{t('roleExperience.first')}: </b>{t(first.titleKey)}</p>
  </section>;
}
