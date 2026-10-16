import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
import { currentFocus, type FocusTarget } from './currentFocus';
export function useLifeStatus(props: { onOpen?: (target: FocusTarget) => void }) {
  const { onOpen } = props;
  const w = useWorld();
  const { t } = useI18n();
  const ch = activeCharacter(w);
  const l = w.life;
  if (!l) return null;
  const event = l.worldEvents.at(-1);
  const focus = currentFocus(w);
  const label = t(focus.key, {
    task: focus.taskId?.startsWith('FE-') ? focus.taskId : t('focus.task'),
    step: focus.stepKey ? t(focus.stepKey) : '',
    count: focus.count,
  });
  const open = focus.target && onOpen ? () => onOpen(focus.target!) : undefined;
  return { t, ch, l, event, label, open };
}
