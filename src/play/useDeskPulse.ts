import { useI18n } from '../content/localization';
import { deskPulse } from '../world/deskPulse';
import { useWorld } from '../world/store';
export function useDeskPulse(props: {
  onResume: () => void;
  onOffice?: () => void;
  onQueue: () => void;
}) {
  const { onResume, onOffice, onQueue } = props;
  const w = useWorld();
  const { t } = useI18n();
  const pulse = deskPulse(w);
  const next =
    pulse.focus === 'task'
      ? onResume
      : pulse.focus === 'queue'
        ? pulse.selectable
          ? onQueue
          : undefined
        : pulse.focus === 'offDuty'
          ? undefined
          : onOffice;
  return { t, pulse, next };
}
