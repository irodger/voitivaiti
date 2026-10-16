import { useI18n } from '../content/localization';
import { activeCharacter, activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
import type { Project } from '../world/types';
export function useCompanyProject(props: {
    project: Project;
}) {
    const { project: p } = props;
    const w = useWorld();
    const { t } = useI18n();
    const ch = activeCharacter(w);
    const current = ch.currentProjectIds.includes(p.id);
    const blocked = !!activeTask(w) && !activeTask(w)!.rewarded;
    const known = p.problems.filter(x => x.discovered);
    return { w, t, current, blocked, known };
}
