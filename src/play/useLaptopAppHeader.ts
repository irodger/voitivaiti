import { useI18n } from '../content/localization';
import { useLaptopTools } from '../hooks/useLaptopTools';
import type { AppId, Step, Task } from '../world/types';
export function useLaptopAppHeader(props: {
  app: AppId;
  task: Task;
  steps: Step[];
  view: Step | null;
}) {
  const { app, task, steps, view } = props;
  const { t } = useI18n();
  const tools = useLaptopTools();
  const tool = tools.get(app);
  const Icon = tool.Icon;
  const done = steps.filter((s) => task.progress[s.id]?.status === 'completed').length;
  const shown = view ?? steps.find((s) => s.id === task.currentStepId);
  return { t, tools, tool, Icon, done, shown };
}
