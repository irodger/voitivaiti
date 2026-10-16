import { useAppActions } from '../hooks/useAppActions';
import { useI18n } from '../content/localization';
import { professionById } from '../content/professions';
import { glossary } from '../content/world';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useSkills() {
  const { openCareerWork: onWork } = useAppActions();
  const ch = useWorld(activeCharacter);
  const { t } = useI18n();
  const role = professionById[ch.profession];
  const node = role.careers.find((n) => n.id === ch.careerNodeId)!;
  const scale = Math.max(1, ...Object.values(ch.skills));
  const terms = glossary.filter((term) => ch.discoveredTerms.includes(term.id));
  const jump = (id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth',
    });
    target?.focus({ preventScroll: true });
  };
  return { onWork, ch, t, role, node, scale, terms, jump };
}
