import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import type { Step, StepProgress } from '../world/types';
export type Props = {
  step: Step;
  progress: StepProgress;
  disabled: boolean;
  consequential: boolean;
};
export function useStepOptions(props: Pick<Props, 'step' | 'progress'>) {
  const { step, progress } = props;
  const dispatch = useWorld((s) => s.dispatch);
  const { t } = useI18n();
  const done = progress.status === 'completed';
  if (!step.options || (step.type === 'review' && progress.run !== 'done')) return null;
  return { options: step.options, dispatch, t, done };
}
