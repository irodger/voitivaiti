import { useI18n } from '../content/localization';
import type { WorkItem } from '../world/lifeTypes';
import { useWorld } from '../world/store';
import { workOwner } from '../world/workLoop';
export function useWorkItemContext(props: { item: WorkItem }) {
  const { item } = props;
  const w = useWorld();
  const { t } = useI18n();
  const owner = w.characters.find((c) => c.id === workOwner[item.id]);
  const problem = w.company?.projects
    .find((p) => p.id === item.projectId)
    ?.problems.find((p) => p.id === item.problemId);
  const past = problem?.story?.encounters.length ?? 0;
  return { t, owner, problem, past };
}
