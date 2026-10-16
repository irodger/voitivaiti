import { useI18n } from '../content/localization';
import { isOrderedPlan, planOrder } from '../world/planOrder';
import { useWorld } from '../world/store';
import type { Step, StepProgress } from '../world/types';
export type Props = {
  step: Step;
  progress: StepProgress;
  disabled: boolean;
  consequential: boolean;
};
export function useStepItems(props: Pick<Props, 'step' | 'progress' | 'consequential'>) {
  const { step, progress, consequential } = props;
  const dispatch = useWorld((s) => s.dispatch);
  const { t } = useI18n();
  const done = progress.status === 'completed';
  const ordered = isOrderedPlan(step);
  const allocation = step.type === 'resource-allocation';
  const displayOrder = ordered && !done ? planOrder(step, progress.draft) : progress.draft;
  const items =
    ordered && displayOrder.length
      ? [
          ...displayOrder.map((id) => step.items!.find((item) => item.id === id)!),
          ...step.items!.filter((item) => !displayOrder.includes(item.id)),
        ]
      : step.items;
  if (!items) return null;
  const graph = ['dependency-map', 'architecture-diagram'].includes(step.type);
  const instruction = allocation
    ? 'ui.allocationHelp'
    : ordered
      ? 'plan.reorderHelp'
      : consequential
        ? 'fix.observations'
        : 'ui.selectHelp';
  return { dispatch, t, ordered, allocation, displayOrder, items, graph, instruction };
}
