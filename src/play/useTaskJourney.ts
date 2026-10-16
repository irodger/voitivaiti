import { taskStepSummary } from '../utils/taskContext';
import { Code2 } from 'lucide-react';
import { useI18n } from '../content/localization';
import { useLaptopTools } from '../hooks/useLaptopTools';
import type { Step, Task } from '../world/types';
export type Stage = {
  id: string;
  title: string;
  state: 'done' | 'current' | 'next' | 'locked';
  Icon: typeof Code2;
  selected?: boolean;
  onClick?: () => void;
};
export function useTaskJourney(props: { task: Task; steps: Step[] }) {
  const { task, steps } = props;
  const { t } = useI18n();
  const tools = useLaptopTools();
  const { done, current } = taskStepSummary(task, steps);
  return { t, tools, done, current };
}
