import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import type { Task } from '../world/types';
export function useProblemHistory(props: { task: Task }) {
  const { task } = props;
  const w = useWorld();
  const { t } = useI18n();
  const problem = w.company?.projects
    .find((p) => p.id === task.projectId)
    ?.problems.find((p) => p.id === task.problemId);
  const story = problem?.story;
  if (!story?.encounters.length) return null;
  return { w, t, story };
}
