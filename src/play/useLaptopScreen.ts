import { useAppActions } from '../hooks/useAppActions';
import { useI18n } from '../content/localization';
import { useLaptopTools } from '../hooks/useLaptopTools';
import type { LaptopWorkspace } from './useLaptopWorkspace';
export function useLaptopScreen(props: { workspace: LaptopWorkspace }) {
  const { closeLaptop } = useAppActions();
  const { workspace: w } = props;
  const { t } = useI18n();
  const tools = useLaptopTools();
  const { task, step, app, view } = w;
  return { closeLaptop, t, tools, task, step, app, view };
}
