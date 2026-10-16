import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import { availableTechnicalActions } from '../world/technicalActions';
import type { Step, StepProgress } from '../world/types';
export function useTechnicalScene(props: { step: Step; progress: StepProgress }) {
  const { step, progress } = props;
  const { t } = useI18n();
  const dispatch = useWorld((s) => s.dispatch);
  const history = (progress.actionHistory ?? [])
    .map((id) => step.actionFlow!.actions.find((a) => a.id === id))
    .filter((a) => !!a);
  const available = availableTechnicalActions(step, progress);
  return { t, dispatch, history, available };
}
